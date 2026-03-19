# AI Career Assistant

This project is an AI Career Assistant platform that provides various features to help users with their career development. It consists of a frontend built with Streamlit and a backend powered by FastAPI.

## Project Structure

```
ai-career-assistant
├── frontend
│   ├── src
│   │   ├── app.py
│   │   ├── pages
│   │   │   ├── home.py
│   │   │   ├── career_guidance.py
│   │   │   ├── skill_assessment.py
│   │   │   └── job_recommendations.py
│   │   ├── components
│   │   │   ├── sidebar.py
│   │   │   ├── header.py
│   │   │   └── footer.py
│   │   ├── utils
│   │   │   ├── api_client.py
│   │   │   ├── styling.py
│   │   │   └── helpers.py
│   │   └── config.py
│   ├── requirements.txt
│   └── .streamlit
│       └── config.toml
├── backend
│   ├── src
│   │   ├── main.py
│   │   ├── api
│   │   │   ├── __init__.py
│   │   │   ├── routes.py
│   │   │   └── dependencies.py
│   │   ├── models
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   ├── services
│   │   │   ├── __init__.py
│   │   │   ├── career_service.py
│   │   │   ├── skill_service.py
│   │   │   └── recommendation_service.py
│   │   ├── utils
│   │   │   ├── __init__.py
│   │   │   └── helpers.py
│   │   └── config.py
│   ├── requirements.txt
│   └── .env
├── README.md
└── .gitignore
```

## Features

- **ATS Resume Checker**: Upload a resume and check it against ATS criteria.
- **Job Market Skills Analyzer**: Fetch and display top skills for a specified role.
- **Resume ↔ Job Match Analyzer**: Analyze the match between a resume and a job description.

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-career-assistant
   ```

2. Set up the backend:
   - Navigate to the `backend` directory.
   - Install the required dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Run the FastAPI server:
     ```
     uvicorn src.main:app --reload
     ```

3. Set up the frontend:
   - Navigate to the `frontend` directory.
   - Install the required dependencies:
     ```
     pip install -r requirements.txt
     ```
   - Run the Streamlit dashboard:
     ```
     streamlit run src/app.py
     ```

## Usage

Once both the backend and frontend are running, you can access the Streamlit dashboard in your web browser at `http://localhost:8501`. From there, you can navigate through the different features of the AI Career Assistant platform.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.