from streamlit import st
from components.sidebar import sidebar
from pages import home, career_guidance, skill_assessment, job_recommendations

def main():
    st.set_page_config(page_title="AI Career Copilot", layout="wide")
    sidebar()

    page = st.sidebar.selectbox("Select a page", ["Home", "Career Guidance", "Skill Assessment", "Job Recommendations"])

    if page == "Home":
        home.show()
    elif page == "Career Guidance":
        career_guidance.show()
    elif page == "Skill Assessment":
        skill_assessment.show()
    elif page == "Job Recommendations":
        job_recommendations.show()

if __name__ == "__main__":
    main()