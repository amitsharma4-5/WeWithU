# 🏗️ WeWithU: System Architecture & Tech Stack Justification

This document details the industry-level and technical interview-focused architecture of the **WeWithU** platform, along with a comprehensive defense of the chosen technology stack.

---

## 1. High-Level System Architecture

WeWithU follows a decoupled, client-server architecture utilizing RESTful APIs. It is designed for high scalability, real-time AI processing, and secure stateless session management.

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                               🧑  USER LAYER                               │
│                   Browser / Desktop / Mobile Device                        │
└────────────────────────────────────────────────────────────────────────────┘
                                |
                                |  HTTPS / TLS
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    🌐  FRONTEND LAYER  (Port 5173)                         │
│                    React 19  +  Vite  +  Tailwind CSS                      │
│                                                                            │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌──────────────┐ │
│  │ Landing Page   │ │ Guidance Panel │ │ Interview AI   │ │ Placement    │ │
│  │ - Hero Section │ │ - ATS Checker  │ │ - Timer/Audio  │ │ - MCQs Test  │ │
│  │ - Pricing      │ │ - Resume Sync  │ │ - QA Simulator │ │ - Soft Skill │ │
│  │ - Auth UI      │ │ - Roadmaps     │ │ - Live Reports │ │ - Study Plan │ │
│  └────────────────┘ └────────────────┘ └────────────────┘ └──────────────┘ │
│                                                                            │
│  UI Libraries: Framer Motion · React Circular Progressbar · Recharts       │
│  State & Routing: Redux Toolkit · React Router DOM · Custom Hooks          │
│  Doc Generation: jsPDF · AutoTable for local PDF exports                   │
└────────────────────────────────────────────────────────────────────────────┘
                                |
                                |  REST API (JSON over HTTPS)
                                |  Authorization: Bearer <JWT HttpOnly Cookie>
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                    ⚡  BACKEND API LAYER  (Port 8000)                      │
│                     Node.js  +  Express.js  +  Mongoose                    │
│                                                                            │
│                 ───────── Middleware Stack ─────────                       │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ JWT Auth Middleware  |  CORS  |  Multer Uploads  |  Error Handling   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐   │
│  │ Auth Routes   │ │ Resume Routes │ │ Interview API │ │ Placement API │   │
│  │ /api/auth/*   │ │ /api/resume/* │ │ /api/interv/* │ │ /api/place/*  │   │
│  │ - Google SSO  │ │ - PDF Parsing │ │ - Timed QA    │ │ - Eval Engine │   │
│  │ - JWT Issue   │ │ - ATS Score   │ │ - Groq Prompt │ │ - Study Plan  │   │
│  └───────────────┘ └───────────────┘ └───────────────┘ └───────────────┘   │
│         |                 |                 |                  |           │
└─────────|─────────────────|─────────────────|──────────────────|───────────┘
          |                 |                 |                  |
          ▼                 ▼                 ▼                  ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ┌─────────────┐
│ 🍃 MongoDB Atlas │ │ 🤖 AI Engine    │ │ 💳 Payment Gate  │ │ 🔐 Auth SSO │
│ (Mongoose ODM)   │ │ (Groq Cloud)     │ │ (Razorpay SDK)   │ │ (Firebase)  │
│                  │ │                  │ │                  │ │             │
│ Collections:     │ │ - LLaMA 3.3 70B  │ │ - Subscriptions  │ │ - Google SSO│
│ - users          │ │ - Interview Gen  │ │ - Credit Top-ups │ │ - ID Tokens │
│ - interviews     │ │ - Score Grader   │ │ - Webhooks       │ │ - Profiles  │
│ - placements     │ │ - Resume Insight │ │ - Signature HMAC │ │ - Callback  │
│ - payments       │ │                  │ │                  │ │             │
└──────────────────┘ └──────────────────┘ └──────────────────┘ └─────────────┘
                                |
                                ▼
┌────────────────────────────────────────────────────────────────────────────┐
│                       🚀  DEPLOYMENT LAYER                                 │
│                                                                            │
│  Frontend  --> Render     (Vite build, global CDN, auto-deploy)           │
│  Backend   --> Render  (Node.js runtime, persistent web service)       │
│  Database  --> MongoDB Atlas (Managed cloud DB, replica set, auto-backup)  │
│  AI Engine --> Groq Cloud  (LPU Inference Engine API)                      │
└────────────────────────────────────────────────────────────────────────────┘
```

### Architectural Highlights
- **Decoupled Architecture**: The frontend (Vite/React) and backend (Node.js/Express) operate independently. This allows for horizontal scaling of the Node servers to handle concurrent AI API processing while the frontend is served as static assets from a CDN.
- **Stateless & Secure Authentication**: Instead of vulnerable `localStorage` tokens, the system uses Firebase for initial SSO, and then issues a custom JWT stored in an `HttpOnly`, `Secure` cookie. This prevents XSS attacks from stealing session tokens.
- **On-Demand AI Streaming**: The backend acts as a secure proxy to Groq Cloud (Llama 3.3 70B), ensuring API keys are never exposed to the client while rapidly parsing resumes and generating interview evaluations on the fly.

---

## 2. Core Workflows Architecture

### A. Authentication Flow
1. **Client**: User clicks Google Sign-In.
2. **Firebase**: Authenticates the user and returns a Firebase ID Token.
3. **Backend**: Receives the ID Token (`/api/auth/google`), verifies it securely with Firebase Admin.
4. **Database**: Finds or creates the user in MongoDB Atlas.
5. **Backend**: Generates a secure JWT and sets it as an `HttpOnly` cookie in the response.
6. **Client**: Subsequent requests automatically include the cookie, which the `isAuth` middleware decodes to set `req.userId`.

### B. AI Interview & Evaluation Flow
1. **Client**: Submits resume details and selected parameters (Role, Mode, Experience).
2. **Backend**: Deducts 50 credits. Sends a strict JSON prompt to **Groq Cloud API**.
3. **Groq API**: Returns an array of customized interview questions.
4. **Client**: User records/types answer within a strict timer.
5. **Backend**: Receives answer, passes it to Groq API with an evaluation rubric (Confidence, Communication, Correctness).
6. **Database**: Updates the `Interview` document with graded feedback.

---

## 3. Interview Question: "Why did you choose this specific tech stack for WeWithU?"

**Interviewer:** *"Walk me through the tech stack you chose for this project. Why these specific technologies over alternatives?"*

**Candidate Answer:**

"For WeWithU, I needed a stack that could handle real-time interactivity, rapid external API communication (for LLMs), secure payments, and complex state management, all while maintaining a fast time-to-market. I chose the **MERN (MongoDB, Express, React, Node.js)** stack enhanced with modern tooling. Here is the breakdown of my choices:

### 1. Frontend: React 19 + Vite
* **Why React?** The platform is highly interactive (timers, dynamic question rendering, multi-step forms). React's component-based architecture and Virtual DOM allow for efficient UI updates during these complex states.
* **Why Vite over Create React App (CRA)?** Vite uses native ES modules, making the local development server start instantly and Hot Module Replacement (HMR) incredibly fast, significantly speeding up development compared to Webpack-based CRA.

### 2. State Management: Redux Toolkit (RTK)
* **Why RTK?** While React Context is good for simple state, WeWithU has complex global states: User profiles, credit balances, and active interview session data. RTK provides a predictable, centralized store, prevents unnecessary re-renders, and reduces the boilerplate of legacy Redux.

### 3. Styling: Tailwind CSS 4.0 + Framer Motion
* **Why Tailwind?** It provides utility-first CSS that allows for rapid UI prototyping without context-switching between JSX and CSS files. It naturally enforces a consistent design system and keeps the production CSS bundle extremely small.
* **Why Framer Motion?** To create an 'industry-level' premium feel, smooth micro-interactions and route transitions were essential. Framer Motion integrates perfectly with React for declarative animations.

### 4. Backend: Node.js + Express.js
* **Why Node.js?** The backend is heavily I/O bound. It acts as an orchestrator—receiving client requests, calling external APIs (Groq, Razorpay), querying the database, and sending responses. Node's non-blocking, asynchronous event-driven architecture is perfectly suited for handling multiple concurrent network requests without blocking threads.
* **Why Express?** It's a minimalist framework that provides robust routing and middleware capabilities (like cookie parsing, auth guards, and multer for file uploads) without unnecessary bloat.

### 5. Database: MongoDB Atlas + Mongoose
* **Why NoSQL (MongoDB)?** The data structures in WeWithU are inherently document-oriented and variable. A user's resume data, interview transcripts (which vary in length and question count), and placement reports are nested and hierarchical. A NoSQL JSON-like document structure maps perfectly to these requirements without needing complex JOIN operations like in SQL.
* **Why Mongoose?** It provides a strict schema definition at the application layer, ensuring data integrity, default values, and easy validation before inserting into MongoDB.

### 6. AI Engine: Groq Cloud (Llama 3.3 70B)
* **Why Groq over OpenAI (ChatGPT)?** For a real-time interview simulator, latency is critical. Groq's LPU (Language Processing Unit) inference engine provides incredibly fast token generation (often 300+ tokens/second). This ensures the candidate receives immediate feedback and follow-up questions, creating a natural conversational flow that slower APIs would break.

### 7. Authentication: Firebase + JWT HttpOnly Cookies
* **Why Firebase?** It handles the complex OAuth flows (Google Login) seamlessly across devices, saving significant development time on secure password hashing and reset flows.
* **Why JWT HttpOnly Cookies?** Standard Firebase tokens on the client are vulnerable if stored in `localStorage`. By taking the Firebase ID token, validating it on the backend, and issuing a custom JWT wrapped in an `HttpOnly` cookie, the application is secured against Cross-Site Scripting (XSS) attacks.

### 8. Payments: Razorpay
* **Why Razorpay?** It is the industry standard for Indian payment gateways. It provides robust SDKs, seamless React integration for checkout popups, and secure webhook/HMAC-SHA256 signature verification to prevent fraudulent credit top-ups."
