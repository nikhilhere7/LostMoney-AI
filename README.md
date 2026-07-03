<div align="center">

<img src="screenshots/logo.png" alt="LostMoney.AI Logo" width="80" />

# LostMoney.AI

### AI-powered personal finance tracker for India

Upload your bank statement → Get instant spending insights, recurring payment detection, and savings suggestions.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lostmoneyai.netlify.app-FF7A00?style=for-the-badge)](https://lostmoneyai.netlify.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Railway-blueviolet?style=for-the-badge)](https://YOUR-RAILWAY-BACKEND.up.railway.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

---

## Screenshots

---

# 📸 Screenshots

## Landing Page

![Landing Page](screenshots/landing-page.png)

---

## Sign In

![Sign In](screenshots/signin.png)

---

## Register

![Register](screenshots/register.png)

---

## Dashboard

![Dashboard](screenshots/dashboard.png)

---

## Upload Statement

![Upload Statement](screenshots/upload.png)

---

## Analytics

![Analytics](screenshots/analytics.png)

---

## Profile

![Profile](screenshots/profile.png)

---

## AI Insights

![AI Insights](screenshots/ai-insights.png)

---


## What It Does

Most Indians have no idea where their money goes. LostMoney.AI solves this by letting you upload your bank statement (PDF, CSV, or Excel) and instantly getting:

- A categorized breakdown of every transaction
- Detection of forgotten subscriptions and recurring charges
- Monthly income vs expense comparison
- Personalized savings suggestions
- Interactive charts and analytics dashboard

---

## Features

| Feature | Description |
|---|---|
| JWT Authentication | Secure register, login, token refresh |
| Multi-format Upload | PDF, CSV, Excel — all major Indian banks |
| Background Processing | Celery + Redis async task queue |
| AI Categorization | ML-powered, 95%+ accuracy on Indian transactions |
| Recurring Detection | Finds forgotten subscriptions automatically |
| Monthly Reports | Income vs expense trends over time |
| Smart Suggestions | Tells you exactly what you can cut to save more |
| Search & Filter | Filter transactions by date, category, type |
| REST API | Fully documented Django REST Framework API |

---

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios + React Router

### Backend
- Django + Django REST Framework
- PostgreSQL
- Celery + Redis
- JWT Authentication (simplejwt)

### Data Processing
- pdfplumber + camelot-py (PDF parsing)
- pandas + openpyxl (CSV/Excel)
- scikit-learn (transaction categorization)
- rapidfuzz (recurring payment detection)

### Deployment
- Frontend → Netlify
- Backend → Railway
- File Storage → Cloudinary

---

## Architecture
React Frontend (Netlify)
│
▼
Django REST API (Railway)
│
┌────┴────┐
▼         ▼
PostgreSQL  Redis
│
▼
Celery Worker
│
▼
PDF Parsing Engine
(pdfplumber + camelot)
│
▼
ML Categorization
(scikit-learn + rules)
│
▼
Analytics & Dashboard

---

## Project Structure
LostMoney-AI/
├── backend/
│   ├── apps/
│   │   ├── analytics/          # Monthly reports, savings suggestions
│   │   ├── statements/         # File upload, PDF/CSV parsing, Celery tasks
│   │   ├── transactions/       # Transaction models, categorization, recurring detection
│   │   └── users/              # Auth, registration, JWT
│   ├── core/                   # Django settings, Celery config, URL routing
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/              # Dashboard, Upload, Transactions, Analytics, Insights
│   │   ├── components/         # Layout, Sidebar, shared UI
│   │   ├── context/            # Auth context (JWT)
│   │   └── utils/              # Axios API client
│   └── package.json
│
└── README.md

---

## How It Works

User uploads bank statement (PDF/CSV/Excel)
↓
File stored securely on Cloudinary
↓
Celery task queued for background processing
↓
pdfplumber + camelot extract transaction table
↓
Rule-based + ML engine categorizes each transaction
↓
Recurring payment algorithm detects subscriptions
↓
Monthly reports and savings suggestions generated
↓
Dashboard visualizes everything in real time


---
## Author

**Nikhil Mahale**

[![GitHub](https://img.shields.io/badge/GitHub-nikhilhere7-181717?style=flat&logo=github)](https://github.com/nikhilhere7)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Nikhil%20Mahale-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/nikhil-mahale-293987271)


---

<div align="center">
Built by Nikhil Mahale
</div>