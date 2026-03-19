from streamlit import title, markdown, subheader

def home():
    title("AI Career Copilot")
    markdown("""
    Welcome to the AI Career Copilot! This platform is designed to assist you in navigating your career journey with the help of advanced AI tools. 
    Here are some of the features you can explore:
    - ATS Resume Checker: Ensure your resume meets Applicant Tracking System standards.
    - Job Market Skills Analyzer: Discover the top skills required for your desired role.
    - Resume ↔ Job Match Analyzer: Analyze how well your resume matches a specific job description.

    ### Example Workflow
    1. Upload your resume.
    2. Select a job description.
    3. Get insights and recommendations to improve your chances of landing the job!
    """)
    
if __name__ == "__main__":
    home()