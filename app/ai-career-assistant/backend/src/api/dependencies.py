from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.schemas import User, UserCreate
from ..services import user_service

def get_current_user(db: Session = Depends(get_db), user_id: int = Depends(user_service.get_current_active_user)):
    user = user_service.get_user(db, user_id=user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user

def validate_user_creation(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = user_service.get_user_by_email(db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return user