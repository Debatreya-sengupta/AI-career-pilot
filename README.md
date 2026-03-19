🚀 AI Career Copilot
Turn Your Career Into a Product. Optimize It. Ship It.
🧠 What is this?

AI Career Copilot is an LLM-powered career intelligence platform that treats your career like a product roadmap—not guesswork.

Instead of asking:

“What should I learn next?”

It tells you:

“Here’s exactly what you’re missing, why it matters, and what to do next.”

⚡ What Makes It Powerful?

This isn’t just another resume tool.

It’s a multi-agent AI system that:

Understands your resume

Analyzes real job market demand

Identifies gaps

Builds a roadmap

Trains you with AI interviews

👉 All inside a clean, SaaS-style dashboard

🎯 Core Features
📊 ATS Resume Intelligence

Upload your resume → get a real ATS score (0–100)

Detect missing keywords recruiters care about

Get precise, actionable fixes

Visual readiness indicators

🔗 Resume ↔ Job Matching

Compare resume with any job description

Instantly see:

Match score

Missing vs matching skills

Improve alignment with targeted suggestions

📈 Market Skill Radar

Query roles like “ML Engineer”

Extract live market demand signals

See top skills ranked by demand %

🧠 Skill Gap → Roadmap Engine

Combines:

ATS insights

Job match results

Market data

➡️ Outputs a step-by-step learning roadmap
(what → why → in what order)

🎤 AI Interview Trainer

Role-based mock interviews

Adaptive questioning

Real-time answer evaluation

Final report:

Strengths

Weaknesses

Coaching insights

🔐 Auth + SaaS Experience

Secure login system (JWT + refresh tokens)

Persistent Day/Night mode

Fully product-like UX

🔄 The Intelligence Pipeline
Resume → Parse → ATS Score → Job Match → Market Analysis
        → Skill Gap → Roadmap → AI Interview → Insights

Every step is AI-driven + structured as JSON, enabling rich UI insights.

🤖 Multi-Agent System Design

Each capability is powered by a dedicated agent:

Agent	Responsibility
📄 Resume Parser	Extract structured text from PDFs
📊 ATS Agent	Score + optimize resume
🔗 Match Agent	Compare resume vs job
🌐 Market Agent	Analyze job demand
🧠 Gap Agent	Identify missing skills
🗺️ Roadmap Agent	Generate learning plan
🎤 Interview Agent	Simulate + evaluate
🏗️ Architecture
🖥️ Frontend

React + Vite

TypeScript

Tailwind CSS

Auth-protected routes

Persistent theming

⚙️ Backend

FastAPI (modular services)

REST APIs:

/ats-check-file

/job-match

/market-skills

/interview

🤖 AI Layer

Groq LLM APIs (OpenAI-compatible)

Handles reasoning, scoring, extraction, evaluation

🗄️ Data Layer

SQLite (dev) → easily upgrade to Postgres

SQLAlchemy + Alembic

Auth + token management

🔁 Example Flow
POST /ats-check-file
→ Parse Resume
→ Run ATS Agent
→ Call LLM (Groq)
→ Return structured JSON
→ Render UI insights
💻 Tech Stack

Frontend

React

Vite

TypeScript

Tailwind

Backend

FastAPI

SQLAlchemy

Alembic

AI

Groq LLM APIs

Other

PDF parsing

Job data APIs

🧪 Real User Journey

🔐 Sign up

📄 Upload resume → get ATS score

📌 Paste job description → match insights

📊 Analyze market demand

🧠 Generate roadmap

🎤 Practice interview

🚀 Improve and iterate

🧩 Why This Project Stands Out

✔️ Full-stack + AI system design
✔️ Real-world SaaS architecture
✔️ Multi-agent orchestration
✔️ Practical, not theoretical
✔️ Built for actual user value

🚀 Getting Started
# Clone repo
git clone https://github.com/Debatreya-sengupta/ai-career-copilot.git

# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
🔮 Future Scope

Real-time job scraping pipelines

Resume auto-rewriter (LLM-enhanced)

LinkedIn/GitHub integration

Advanced analytics dashboard

Docker + cloud deployment

🤝 Contributing

PRs, ideas, and feedback are welcome 🚀

📄 License

MIT

💡 Final Thought

Your career shouldn’t be guesswork.
It should be engineered. measured. optimized.

🔥 If this helped you, give it a ⭐ and build your future like a product.
