# ![RIMI LMS](./public/rimilogo.png)  
*RIMI Agent Training & Certification Portal*

---

## Introduction

**RIMI Agent Training & Certification Portal** s a web-based platform built to streamline agent onboarding, training, assessment, and certification. It provides a modern and centralized interface for course management, test configuration, certificate issuance, and user progress tracking.

---

## Project Objectives

- Digitize and simplify the agent training and certification workflow.
- Ensure secure, role-based access for course and test administration.
- Enable dynamic certificate generation and verification.
- Offer real-time visual insights into agent performance.
- Provide multilingual support for diverse audiences.

---

## Key Features

- **Course Management**: Create, edit, and assign courses with ease.
- **Test Engine**: Define custom tests, set video checkpoints, and evaluate responses.
- **Certificate Builder**: Auto-generate branded certificates with verification support.
- **Language Support**: Dynamic internationalization.
- **PDF Exporting**: Capture pages/certificates as downloadable PDFs.
- **Progress Visualization**: Track user progress via interactive charts.
- **Admin Dashboard**: Centralized control of users, categories, and training modules.

---

## Implementation Strategy

Each objective was mapped to a feature and delivered using modern web development best practices:

- **Agent Training** → Courses & embedded videos with test overlays.
- **Evaluation** → React Hook Form-powered test forms validated in real-time.
- **Certificate Generation** → Template system with dynamic data binding + PDF export.
- **Multi-language Support** → Language detection and switching.
- **Performance Insights** → Visualize user metrics over time.
- **Admin Controls** → Protected routes, role-based content rendering, and interactive tables.

---

## Tech Stack

| Layer               | Technology                 |
|--------------------|----------------------------|
| Frontend Framework | React 19                   |
| Styling            | TailwindCSS 4              |
| Routing            | React Router v7            |
| Forms              | React Hook Form            |
| Charts             | Recharts                   |
| Internationalization | i18next                   |
| PDF Generation     | jsPDF + html2canvas        |
| HTTP Client        | Axios                      |
| Utilities          | UUID, js-cookie            |
| Build Tool         | Vite                       |
| Linting            | ESLint                     |
| Type Checking      | TypeScript                 |

---

## Installation

### Prerequisites

- Node.js v18+
- npm or yarn

### Clone the repo

```bash
git clone https://github.com/your-username/rimi-lms.git
cd rimi-lms
```

### Install dependencies

```bash
npm install
```

---

## 🔧 Usage

### Development server

```bash
npm run dev
```

Runs the app in development mode at:  
`http://localhost:5173`

### Build for production

```bash
npm run build
```