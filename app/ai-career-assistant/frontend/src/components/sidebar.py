from streamlit import sidebar

def render_sidebar():
    sidebar.title("AI Career Assistant")
    sidebar.header("Navigation")
    sidebar.markdown("[Home](./home)")
    sidebar.markdown("[Career Guidance](./career_guidance)")
    sidebar.markdown("[Skill Assessment](./skill_assessment)")
    sidebar.markdown("[Job Recommendations](./job_recommendations)")