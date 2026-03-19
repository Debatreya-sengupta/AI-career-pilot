from streamlit import st
import requests
from utils.api_client import analyze_job_match
from utils.styling import set_page_config

set_page_config()

def job_recommendations_page():
    st.title("Resume ↔ Job Match Analyzer")
    
    st.write("Upload your resume and enter a job description to analyze the match.")
    
    resume_file = st.file_uploader("Upload Resume", type=["pdf", "docx"])
    job_description = st.text_area("Job Description", height=200)
    
    if st.button("Analyze Match"):
        if resume_file and job_description:
            resume_content = resume_file.read()
            response = analyze_job_match(resume_content, job_description)
            
            if response.status_code == 200:
                match_score = response.json().get("match_score")
                st.success(f"Match Score: {match_score}%")
            else:
                st.error("Error analyzing the match. Please try again.")
        else:
            st.warning("Please upload a resume and enter a job description.")

if __name__ == "__main__":
    job_recommendations_page()