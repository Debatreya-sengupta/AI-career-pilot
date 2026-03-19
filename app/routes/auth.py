from datetime import datetime, timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.auth_models import (
    EmailVerificationToken,
    PasswordResetToken,
    RefreshToken,
    User,
)
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserOut,
    VerifyEmailRequest,
)
from app.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    fingerprint_token,
    generate_urlsafe_token,
    hash_password,
    verify_password,
)


router = APIRouter(prefix="/auth", tags=["auth"])
DbDep = Annotated[Session, Depends(get_db)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

REFRESH_COOKIE_NAME = "refresh_token"


def _set_refresh_cookie(response: Response, token: str):
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=False,  # set True behind HTTPS
        samesite="lax",
        path="/auth",
    )


def _clear_refresh_cookie(response: Response):
    response.delete_cookie(REFRESH_COOKIE_NAME, path="/auth")


def get_current_user(db: DbDep, token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")
    try:
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid access token")

    user = db.query(User).filter(User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: DbDep):
    email = payload.email.strip().lower()
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    user = User(email=email, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DbDep, response: Response):
    email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    access = create_access_token(user.id)
    refresh = create_refresh_token(user.id)

    db.add(RefreshToken(user_id=user.id, token_fingerprint=fingerprint_token(refresh)))
    db.commit()

    _set_refresh_cookie(response, refresh)
    return TokenResponse(access_token=access)


@router.get("/me", response_model=UserOut)
def me(user: Annotated[User, Depends(get_current_user)]):
    return user


@router.post("/refresh", response_model=TokenResponse)
def refresh(db: DbDep, request: Request, response: Response):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    try:
        user_id = int(payload.get("sub"))
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    fp = fingerprint_token(refresh_token)
    token_row = db.query(RefreshToken).filter(RefreshToken.token_fingerprint == fp).first()
    if not token_row or token_row.revoked_at is not None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token revoked")

    # Rotate
    token_row.revoked_at = datetime.utcnow()
    new_refresh = create_refresh_token(user_id)
    db.add(RefreshToken(user_id=user_id, token_fingerprint=fingerprint_token(new_refresh)))
    db.commit()

    _set_refresh_cookie(response, new_refresh)
    return TokenResponse(access_token=create_access_token(user_id))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(db: DbDep, request: Request, response: Response):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)
    if refresh_token:
        fp = fingerprint_token(refresh_token)
        row = db.query(RefreshToken).filter(RefreshToken.token_fingerprint == fp).first()
        if row and row.revoked_at is None:
            row.revoked_at = datetime.utcnow()
            db.commit()

    _clear_refresh_cookie(response)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/request-email-verification")
def request_email_verification(db: DbDep, user: Annotated[User, Depends(get_current_user)]):
    if user.is_email_verified:
        return {"status": "already_verified"}

    token = generate_urlsafe_token()
    db.add(
        EmailVerificationToken(
            user_id=user.id,
            token=token,
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
    )
    db.commit()

    # For now (SQLite/dev): return token in response.
    return {"status": "sent", "token": token}


@router.post("/verify-email")
def verify_email(db: DbDep, payload: VerifyEmailRequest):
    row = db.query(EmailVerificationToken).filter(EmailVerificationToken.token == payload.token).first()
    if not row or row.used_at is not None or row.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == row.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    user.is_email_verified = True
    row.used_at = datetime.utcnow()
    db.commit()
    return {"status": "verified"}


@router.post("/forgot-password")
def forgot_password(db: DbDep, payload: ForgotPasswordRequest):
    email = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email).first()

    # Always return ok to avoid account enumeration
    if not user:
        return {"status": "ok"}

    token = generate_urlsafe_token()
    db.add(
        PasswordResetToken(
            user_id=user.id,
            token=token,
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
    )
    db.commit()

    # For now (SQLite/dev): return token in response.
    return {"status": "ok", "token": token}


@router.post("/reset-password")
def reset_password(db: DbDep, payload: ResetPasswordRequest):
    row = db.query(PasswordResetToken).filter(PasswordResetToken.token == payload.token).first()
    if not row or row.used_at is not None or row.expires_at < datetime.utcnow():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")

    user = db.query(User).filter(User.id == row.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token")

    user.password_hash = hash_password(payload.new_password)
    row.used_at = datetime.utcnow()

    # revoke all refresh tokens for this user
    db.query(RefreshToken).filter(RefreshToken.user_id == user.id, RefreshToken.revoked_at.is_(None)).update(
        {"revoked_at": datetime.utcnow()}
    )
    db.commit()
    return {"status": "password_updated"}

