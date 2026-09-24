# ⚡ JobMatch AI — Placement & Career Intelligence Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://jobmatchingagent.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)

> **Live Deployed Application:** 🌐 [https://jobmatchingagent.onrender.com](https://jobmatchingagent.onrender.com)

---

## 🌟 Overview

**JobMatch AI** (powered by the **Agent 50** placement intelligence engine) is a comprehensive academic career intelligence and campus recruitment platform. It connects Students, Training & Placement (T&P) Officers, and Heads of Departments (HOD) through multi-factor match algorithms, automated JD structuring, real-time application pipelines, and dynamic AI-powered insights.

---

## 🚀 Key Features

### 1. 🧠 Agent 50 Multi-Parametric Matching Engine
- **Skill Alignment (40%)**: Fuzzy matching, technology synonym mapping (`React` $\leftrightarrow$ `React.js`, `Python` $\leftrightarrow$ `Python3`), verified skill weighting, and proficiency multipliers (*Expert*, *Advanced*, *Intermediate*, *Beginner*).
- **Project & Portfolio Relevance (20%)**: Live scanning of project descriptions, GitHub repositories, and deployed links against required stacks.
- **Academic & Readiness Rigor (15%)**: CGPA evaluation against threshold cutoffs, backlog penalties, and technical readiness index evaluation.
- **Role & Domain Track Fit (15%)**: Match analysis between student career track preferences and job profiles.
- **Location & Work Mode Mobility (10%)**: Matching preferred locations, hybrid/remote mode, and relocation flexibility.
- **Dynamic Explainability**: Generates concrete reasons (*"Matches 5 of 6 required skills (Python, SQL, Docker)"*) and actionable remediation roadmaps for identified skill gaps.

### 2. 📄 AI Job Description Auto-Structuring
- Paste raw JD text or upload drive documents to automatically extract company, job role, eligibility thresholds, required/preferred skills, location, and salary packages without fabricating undisclosed numbers.

### 3. 👥 Multi-Role Portal Isolation
- **Student Portal**: Explore personalized AI match rankings, radial compatibility breakdowns, apply for drives, track interview rounds, and remediate skill gaps.
- **Training & Placement (T&P) Portal**: Create drives, rank candidate pools using Agent 50, shortlist students with single-click interactive Undo, manage drive rounds, and review institutional analytics.
- **HOD Portal**: Read-only departmental oversight, monitor student placement statistics, track active company drives, and identify curriculum skill gaps.

### 4. 🤖 SantraAI Intelligent Assistant
- Context-aware conversational assistant grounded in real database records, providing match explanations, interview timelines, and readiness advice.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide React, Canvas Confetti, Modern Neo-Pop CSS Design System
- **Backend**: Node.js, Express, JWT Authentication, CORS
- **Database**: SQLite with parameterized SQL queries
- **Intelligence Engine**: Agent 50 Multi-Factor Match Engine & JD Analyzer
- **Deployment**: Render Cloud ([https://jobmatchingagent.onrender.com](https://jobmatchingagent.onrender.com))

---

## 💻 Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/SubbaReddyK-18/JobMatchingAgent.git
cd JobMatchingAgent
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

### 3. Start the application
```bash
# Concurrently runs both Express backend (:5000) and Vite frontend (:5173)
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173) to view the application locally.

---

## 🔒 Demo Credentials

| Role | Email / Identifier | Password | Access Level |
|---|---|---|---|
| **Student** | `subbu@college.edu` | `student123` | Student Portal |
| **T&P Officer** | `tp@college.edu` | `tp123` | Institution Placement Panel |
| **HOD** | `hod@college.edu` | `hod123` | Department Overview (Read-Only) |

---

## 📁 Repository Structure

```
JobMatchingAgent/
├── client/                     # Vite + React Frontend
│   ├── public/                 # Brand assets & icons
│   └── src/
│       ├── components/         # Reusable UI components (Sidebar, TopNavbar, Gauges)
│       ├── context/            # AuthContext & state providers
│       ├── pages/              # Role views, Landing page, Portals hub, Match details
│       └── main.jsx            # Entry point
├── server/                     # Node.js + Express Backend
│   ├── db/                     # SQLite database & seed datasets
│   ├── engine/                 # Agent 50 Matching Engine & JD Analyzer
│   ├── middleware/             # JWT Authentication & RBAC
│   ├── routes/                 # REST API endpoints (jobs, students, matching, auth)
│   ├── services/               # SantraAI chatbot & analytics
│   └── server.js               # Express application entry
└── README.md
```

---

## 👨‍💻 Author & Attribution

*Crafted with ❤️ by **KOWSIK***
