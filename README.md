# PeopleCore — Enterprise Human Resource Management Suite

<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white&style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
</div>

<br/>

> A modern, feature-rich HRM platform built with React + Vite. Premium dark glassmorphism UI with comprehensive workforce management tools.

---

## ✨ Modules

| Module | Description |
|--------|-------------|
| 📊 **Dashboard** | Live KPIs, charts, activity feed, recent hires |
| 👥 **Employees** | Full CRUD, search, filter, profile drawer, CSV export |
| 📅 **Attendance** | Monthly calendar, per-employee drill-down |
| 💰 **Payroll** | Payslip generation, CSV export, print-to-PDF |
| 🎯 **Recruitment** | Kanban pipeline, job listings, candidate profiles |
| 🏖️ **Leave Management** | Submit, approve/reject requests, leave balance |
| ⭐ **Performance** | Review cycles, goal tracking, radar scorecards |
| 🌿 **Org Chart** | Interactive hierarchy tree + department view |
| 📈 **Reports & Analytics** | Headcount, payroll, attendance charts |
| ⚙️ **Settings** | Profile, security (2FA), appearance, company settings |

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

**Demo Credentials:**
- Admin: `admin@nexushr.com` / `admin123`
- Manager: `manager@nexushr.com` / `manager123`

---

## 🏗️ Architecture

```
src/
├── components/        # Sidebar, Topbar
├── context/           # AuthContext, HRMContext, ToastContext
├── data/              # mockData.js (central data store)
├── hooks/             # useDocumentTitle
├── layouts/           # AdminLayout
├── pages/             # All 10 module pages
└── utils/             # exportUtils (CSV + print)
```

**Key integrations:**
- 🔐 Auth with localStorage persistence + protected routes
- 🌐 Global state (React Context) shared across all modules
- 🔔 Toast notifications on every action
- 📄 Dynamic browser tab titles per page
- 📥 Real CSV file downloads via Blob URL
- 🖨️ Print-to-PDF payslips in a new window

---

## 🔥 Firebase Roadmap

For production, replace the mock data layer with Firebase:

| Firebase Service | Use Case |
|-----------------|----------|
| **Authentication** | Replace demo login — Google SSO, email/password, role-based claims |
| **Firestore** | Real-time employee, leave, payroll, candidate collections |
| **Storage** | Employee profile photos, payslip PDFs, document uploads |
| **Cloud Functions** | Payroll processing, email notifications on leave approval |
| **Hosting** | Deploy the Vite build with CDN edge caching |
| **Analytics** | Track module usage, session analytics |

---

## 📄 License

MIT © PeopleCore
