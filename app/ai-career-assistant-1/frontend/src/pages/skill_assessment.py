from streamlit import st
import pandas as pd
from utils.api_client import fetch_skills

def skill_assessment():
    st.title("Job Market Skills Analyzer")
    role = st.text_input("Enter the job role you want to analyze:")
    
    if st.button("Analyze"):
        if role:
            skills_data = fetch_skills(role)
            if skills_data:
                skills_df = pd.DataFrame(skills_data)
                st.bar_chart(skills_df.set_index('skill')['importance'])
            else:
                st.error("No skills found for the specified role.")
        else:
            st.warning("Please enter a job role to analyze.")

if __name__ == "__main__":
    skill_assessment()