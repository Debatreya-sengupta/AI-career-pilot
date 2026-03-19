🚀 AI Career Copilot
Your LLM-Powered Career Intelligence Platform
🌟 Overview

AI Career Copilot transforms your career into a data-driven product roadmap.

Upload your resume once—and unlock a powerful dashboard that helps you:

📊 Optimize for ATS systems

🎯 Match real job descriptions

📈 Track in-demand market skills

🧠 Identify skill gaps

🎤 Practice interviews with AI

All wrapped in a modern SaaS-style UI powered by LLMs + FastAPI + React.

✨ Key Features
📄 ATS Resume Checker

Upload your resume (PDF) + target role

Get a 0–100 ATS score

Identify missing keywords

Receive actionable improvement tips

Visual feedback with progress bars & readiness labels

🔗 Resume ↔ Job Match

Compare resume with real job descriptions

See:

✅ Matching skills

❌ Missing skills

📊 Match score

Get tailored suggestions to improve alignment

📊 Market Skills Analyzer

Query roles like “Data Scientist” or “ML Engineer”

Aggregates job listings

Extracts top in-demand skills

Displays ranked demand insights

🧠 Skill Gap & Roadmap Generator

Combines:

ATS results

Job match insights

Market demand

Outputs a personalized learning roadmap:

What to learn

In what order

Why it matters

🎤 AI Interview Simulator

Start role-based interview sessions

Get adaptive questions

Submit answers & receive:

📌 Structured feedback

💪 Strengths & weaknesses

🚀 Final coaching summary

🔐 Auth + Theme System

Email/password authentication (SQLite demo)

🌙 Day/Night mode toggle

Preferences persist like a real SaaS product

🔄 End-to-End Workflow
Resume Upload (PDF)
        ↓
Resume Parsing
        ↓
ATS Score Analysis
        ↓
Resume ↔ Job Match
        ↓
Market Skill Analysis
        ↓
Skill Gap Detection
        ↓
Career Roadmap Generation
        ↓
AI Interview Simulation
        ↓
Final Career Insights Dashboard
🧩 Agent-Based Architecture

Each step is powered by specialized AI agents:

📥 Resume Parser → Extracts structured text

📊 ATS Agent → Scores + suggests improvements

🔗 Job Match Agent → Compares resume vs JD

🌐 Market Analyzer Agent → Extracts demand signals

🧠 Gap + Roadmap Agents → Build learning paths

🎤 Interview Agent → Simulates + evaluates interviews

👉 All outputs are structured JSON, enabling rich UI rendering.

🏗️ System Architecture
🖥️ Frontend

React + Vite

TypeScript

Tailwind CSS

Auth context + protected routes

Persistent theme system

⚙️ Backend

FastAPI

REST APIs:

/auth/*

/ats-check-file

/job-match

/market-skills

/interview

Modular agent services

🤖 AI Layer

Groq LLM APIs (OpenAI-compatible)

Handles:

ATS scoring

Resume ↔ job matching

Skill extraction

Interview simulation

🗄️ Data Layer

SQLite (dev)

SQLAlchemy + Alembic

Tables:

Users

Tokens (auth, reset, verification)

🔁 Example Request Flow
User (React UI)
   ↓
POST /ats-check-file
   ↓
FastAPI Backend
   ↓
Resume Parser
   ↓
ATS Agent
   ↓
Groq LLM
   ↓
JSON Response
   ↓
UI Metrics + Visualizations
💻 Tech Stack
Frontend

React

Vite

TypeScript

Tailwind CSS

Backend

FastAPI

SQLAlchemy

Alembic

SQLite

AI / Integrations

Groq LLM APIs

PDF parsing

Job data APIs (optional scraping)

🧪 Example User Journey

🔐 Sign Up / Login

📄 Upload Resume → Get ATS Score

📌 Paste Job Description → Match Analysis

📊 Analyze Market Skills

🧠 Generate Skill Roadmap

🎤 Practice Interview with AI

🚀 Review Final Career Insights Dashboard

🎯 Why This Project Stands Out

✅ Real-world SaaS architecture
✅ Multi-agent LLM orchestration
✅ End-to-end career intelligence pipeline
✅ Clean UI + structured AI outputs
✅ Practical + portfolio-worthy

🚀 Getting Started
# Clone repo
git clone https://github.com/your-username/ai-career-copilot.git

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
🛠️ Future Improvements

📊 Advanced analytics dashboard

🌍 Real-time job scraping pipelines

🧾 Resume auto-enhancement generator

🤝 LinkedIn/GitHub integration

☁️ Deployment (Docker + cloud)

🤝 Contributing

Contributions are welcome!
Feel free to fork, open issues, or submit PRs 🚀

📄 License

MIT License

🔥 Turn your career into a product. Build it. Optimize it. Ship it.
