from streamlit import file_uploader, button, write, header, subheader
import requests
import json

API_URL = "http://localhost:8000/api/ats_checker"  # Update with your FastAPI backend URL

def ats_resume_checker():
    header("ATS Resume Checker")
    subheader("Upload your resume to check against ATS criteria.")

    uploaded_file = file_uploader("Choose a file", type=["pdf", "docx", "txt"])

    if uploaded_file is not None:
        if button("Check Resume"):
            files = {"file": uploaded_file.getvalue()}
            response = requests.post(API_URL, files=files)

            if response.status_code == 200:
                result = response.json()
                write("ATS Check Results:")
                write(json.dumps(result, indent=2))
            else:
                write("Error checking resume. Please try again.")

ats_resume_checker()