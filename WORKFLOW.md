# WORKFLOW.md - WeWithU AI Project Execution & Architecture Workflow

Welcome to the **WeWithU AI** complete project workflow documentation. This document is designed for interview preparation and codebase comprehension. It details the complete folder execution order, user feature file-to-file flows, a granular breakdown of every single folder and file, and end-to-end request flow ASCII diagrams.

---

## 1. Execution Order & User Feature Journeys

### 1.1 System Bootstrapping Order

When starting the application, files and folders execute in the following strict order:

```
[SERVER BOOTSTRAP]
1. server/package.json         -> Node.js reads dependencies & scripts.
2. server/.env                 -> Loads environment variables (PORT, MONGO_URI, JWT_SECRET, GROQ_API_KEY).
3. server/index.js             -> Entry point initializes Express, CORS, Cookie Parser, & Routes.
4. server/config/connectDb.js  -> Connects backend to MongoDB database.
5. server/routes/*             -> Express registers API route endpoints.
6. server/middlewares/*        -> Attaches authentication (isAuth.js) & file uploads (multer.js).
7. server/controllers/*        -> Controller logic stands ready to process HTTP requests.
8. server/services/*           -> External AI (Groq/OpenRouter) & Payment (Razorpay) helpers ready.

[CLIENT BOOTSTRAP]
1. client/index.html           -> Entry HTML page hosting React root div.
2. client/src/main.jsx         -> React entry point rendering <App /> wrapped in Redux Provider.
3. client/src/redux/store.js   -> Initializes Redux global state store (userSlice, interviewSlice).
4. client/src/App.jsx          -> Sets up React Router paths, dark mode, & auth check on mount.
5. client/src/pages/*          -> Renders page components depending on current URL route.
6. client/src/components/*     -> Reusable UI elements render inside active pages.
```

---

### 1.2 User Feature Execution Journeys (File-to-File Flow)

Below is the step-by-step file navigation path for every feature when a user interacts with the application.

#### Feature 1: User Registration / Login (Google & Email)
- `client/src/pages/Home.jsx`
- `client/src/components/Navbar.jsx`
- `client/src/components/AuthModel.jsx` *(or `client/src/pages/Auth.jsx`)*
- `client/src/utils/firebase.js` *(Google OAuth popup)*
- `server/routes/auth.route.js`
- `server/controllers/auth.controller.js`
- `server/config/token.js` *(JWT cookie generation)*
- `server/models/user.model.js`
- `client/src/redux/userSlice.js` *(Updates Redux user state)*

#### Feature 2: AI Mock Interview (Setup → Audio Interview → AI Report)
- `client/src/pages/InterviewPage.jsx`
- `client/src/components/Step1SetUp.jsx` *(Role, experience, optional resume upload)*
- `server/routes/interview.route.js`
- `server/middlewares/multer.js` *(If PDF resume uploaded)*
- `server/middlewares/isAuth.js`
- `server/controllers/interview.controller.js`
- `server/services/groq.service.js` *(AI question generation)*
- `server/models/interview.model.js` *(Saves interview session)*
- `client/src/components/Step2Interview.jsx` *(Audio synthesis, speech recognition, timer)*
- `client/src/components/Timer.jsx`
- `client/src/assets/videos/female-ai.mp4` / `male-ai.mp4`
- `server/routes/interview.route.js` `(/submit-answer & /finish)`
- `server/controllers/interview.controller.js`
- `server/services/scorer.service.js` *(Evaluates feedback, scores, metrics)*
- `client/src/components/Step3Report.jsx` *(Displays score breakdown, strengths, areas for improvement)*

#### Feature 3: Full Placement Readiness Test
- `client/src/pages/PlacementTestPage.jsx`
- `server/routes/placement.route.js`
- `server/middlewares/isAuth.js`
- `server/controllers/placement.controller.js`
- `server/services/groq.service.js`
- `server/models/placement.model.js`
- `client/src/pages/PlacementResultsPage.jsx`
- `server/routes/evaluate.route.js`
- `server/controllers/evaluate.controller.js`

#### Feature 4: Interview History & Past Reports
- `client/src/pages/InterviewHistory.jsx`
- `server/routes/interview.route.js` `(/user-interviews)`
- `server/controllers/interview.controller.js`
- `server/models/interview.model.js`
- `client/src/pages/InterviewReport.jsx` *(Detailed single interview view)*

#### Feature 5: Company-Specific Prep & Question Generator
- `client/src/pages/CompanyPrep.jsx`
- `server/routes/questions.route.js`
- `server/controllers/questions.controller.js`
- `server/services/groq.service.js`

#### Feature 6: AI Career Roadmap Generator
- `client/src/pages/Roadmap.jsx`
- `server/routes/questions.route.js` `(/generate-roadmap)`
- `server/controllers/questions.controller.js`
- `server/services/groq.service.js`

#### Feature 7: AI Resume Review & Optimization
- `client/src/pages/ResumeTips.jsx`
- `server/routes/resume.route.js`
- `server/middlewares/multer.js`
- `server/controllers/resume.controller.js`
- `server/services/groq.service.js`

#### Feature 8: Credit Top-up via Razorpay Payment
- `client/src/pages/Pricing.jsx`
- `server/routes/payment.route.js`
- `server/controllers/payment.controller.js`
- `server/services/razorpay.service.js`
- `server/models/payment.model.js`
- `server/models/user.model.js` *(Increases user credits)*

---

## 2. Complete Folder & File Breakdown

Every folder and file in the project is listed below in execution sequence.

### 2.1 Server-Side Files (`server/`)

#### 📁 `server/` (Root Server Directory)
- **`server/.env`**:
  - **Purpose:** Stores sensitive environment configuration keys (PORT, MONGO_URI, JWT_SECRET, GROQ_API_KEY, RAZORPAY keys).
  - **When Executed:** Loaded on server startup by `dotenv.config()`.
  - **Called By:** `server/index.js`, controllers, & services.
  - **Calls Next:** Environment runtime memory.
- **`server/package.json`**:
  - **Purpose:** Defines backend metadata, dependencies (express, mongoose, groq-sdk, razorpay, multer), and scripts (`npm start`, `npm run dev`).
  - **When Executed:** Read by Node.js/NPM on startup or package installation.
  - **Called By:** NPM CLI (`npm run dev`).
  - **Calls Next:** Loads node_modules.
- **`server/package-lock.json`**:
  - **Purpose:** Locks exact dependency versions for reproducible backend builds.
  - **When Executed:** Read during `npm install`.
  - **Called By:** NPM CLI.
  - **Calls Next:** N/A.
- **`server/.gitignore`**:
  - **Purpose:** Specifies node_modules, .env, and logs to ignore in Git.
  - **When Executed:** Read by Git VCS.
  - **Called By:** Git CLI.
  - **Calls Next:** N/A.
- **`server/index.js`**:
  - **Purpose:** Primary entry point of the Express server. Configures middleware (CORS, JSON, Cookies) and registers API routes.
  - **When Executed:** On backend initialization (`node index.js`).
  - **Called By:** NPM startup scripts.
  - **Calls Next:** `server/config/connectDb.js` and all route files in `server/routes/`.
- **`server/check_credits.js`**:
  - **Purpose:** Utility database diagnostic script to view user credit balances.
  - **When Executed:** Manually executed via CLI (`node check_credits.js`).
  - **Called By:** Developer / Admin.
  - **Calls Next:** `server/config/connectDb.js` & `server/models/user.model.js`.
- **`server/server_log.txt`**:
  - **Purpose:** Output log text file recording server runtime console messages and debug logs.
  - **When Executed:** Written to during server execution.
  - **Called By:** Server logging functions.
  - **Calls Next:** N/A.

#### 📁 `server/config/`
- **`server/config/connectDb.js`**:
  - **Purpose:** Establishes connection between Node.js Express server and MongoDB Atlas using Mongoose.
  - **When Executed:** Called when server starts listening on port in `index.js`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** MongoDB Atlas Database.
- **`server/config/token.js`**:
  - **Purpose:** Generates JSON Web Tokens (JWT) signed with JWT_SECRET and attaches them as HTTP-only cookies.
  - **When Executed:** During user login or signup.
  - **Called By:** `server/controllers/auth.controller.js`.
  - **Calls Next:** Client HTTP cookie storage.

#### 📁 `server/models/`
- **`server/models/user.model.js`**:
  - **Purpose:** Mongoose schema for User profiles (name, email, password, googleId, credits, timestamps).
  - **When Executed:** Imported on controller demand for DB operations.
  - **Called By:** Auth, User, Payment, and Interview controllers.
  - **Calls Next:** MongoDB `users` collection.
- **`server/models/interview.model.js`**:
  - **Purpose:** Mongoose schema storing interview sessions, question lists, candidate answers, feedback, and score reports.
  - **When Executed:** Created during setup and updated during interview progression.
  - **Called By:** `server/controllers/interview.controller.js`.
  - **Calls Next:** MongoDB `interviews` collection.
- **`server/models/placement.model.js`**:
  - **Purpose:** Mongoose schema storing placement test submissions (MCQs, written responses, scores, AI feedback).
  - **When Executed:** Created during placement test initialization and evaluation.
  - **Called By:** `server/controllers/placement.controller.js` & `server/controllers/evaluate.controller.js`.
  - **Calls Next:** MongoDB `placements` collection.
- **`server/models/payment.model.js`**:
  - **Purpose:** Mongoose schema recording credit purchase transactions (orderId, paymentId, amount, status).
  - **When Executed:** Created during Razorpay payment verification.
  - **Called By:** `server/controllers/payment.controller.js`.
  - **Calls Next:** MongoDB `payments` collection.

#### 📁 `server/middlewares/`
- **`server/middlewares/isAuth.js`**:
  - **Purpose:** Authentication middleware that inspects JWT cookies in incoming HTTP requests to verify user identity.
  - **When Executed:** Before executing any protected API route handler.
  - **Called By:** Protected routes (`interview.route.js`, `placement.route.js`, etc.).
  - **Calls Next:** Route controllers or returns 401 Unauthorized response.
- **`server/middlewares/multer.js`**:
  - **Purpose:** File upload middleware configured with disk storage for handling PDF resume uploads.
  - **When Executed:** When a multipart request containing a file is sent to upload routes.
  - **Called By:** `interview.route.js` & `resume.route.js`.
  - **Calls Next:** Controller handlers (providing `req.file`).

#### 📁 `server/routes/`
- **`server/routes/auth.route.js`**:
  - **Purpose:** Defines API endpoints for authentication (`/register`, `/login`, `/google`, `/logout`).
  - **When Executed:** When requests hit `/api/auth/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/auth.controller.js`.
- **`server/routes/user.route.js`**:
  - **Purpose:** Defines API endpoints for user profile and credit balance retrieval (`/me`).
  - **When Executed:** When requests hit `/api/user/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/user.controller.js`.
- **`server/routes/interview.route.js`**:
  - **Purpose:** Defines API endpoints for interview workflows (`/generate-questions`, `/submit-answer`, `/finish`, `/user-interviews`, `/:id`).
  - **When Executed:** When requests hit `/api/interview/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/interview.controller.js`.
- **`server/routes/placement.route.js`**:
  - **Purpose:** Defines API endpoints for generating and retrieving placement test suites.
  - **When Executed:** When requests hit `/api/placement/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/placement.controller.js`.
- **`server/routes/evaluate.route.js`**:
  - **Purpose:** Defines API endpoints for submitting placement test answers and triggering AI evaluation.
  - **When Executed:** When requests hit `/api/evaluate/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/evaluate.controller.js`.
- **`server/routes/questions.route.js`**:
  - **Purpose:** Defines API endpoints for company-specific question generation and roadmap creation.
  - **When Executed:** When requests hit `/api/questions/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/questions.controller.js`.
- **`server/routes/resume.route.js`**:
  - **Purpose:** Defines API endpoints for uploading and analyzing resumes.
  - **When Executed:** When requests hit `/api/resume/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/resume.controller.js`.
- **`server/routes/payment.route.js`**:
  - **Purpose:** Defines API endpoints for Razorpay order creation and payment verification (`/create-order`, `/verify`).
  - **When Executed:** When requests hit `/api/payment/*`.
  - **Called By:** `server/index.js`.
  - **Calls Next:** `server/controllers/payment.controller.js`.

#### 📁 `server/controllers/`
- **`server/controllers/auth.controller.js`**:
  - **Purpose:** Handles registration, password hashing (bcrypt), login validation, Google OAuth token verification, and cookie clearing.
  - **When Executed:** In response to `/api/auth` endpoint hits.
  - **Called By:** `server/routes/auth.route.js`.
  - **Calls Next:** `server/models/user.model.js` & `server/config/token.js`.
- **`server/controllers/user.controller.js`**:
  - **Purpose:** Fetches currently authenticated user data and credit balance from MongoDB.
  - **When Executed:** On client initial load or credit refresh.
  - **Called By:** `server/routes/user.route.js`.
  - **Calls Next:** `server/models/user.model.js`.
- **`server/controllers/interview.controller.js`**:
  - **Purpose:** Parses resumes, builds AI prompts, generates interview questions, handles step-by-step candidate answers, and compiles final scores.
  - **When Executed:** During interview creation, execution, and finishing.
  - **Called By:** `server/routes/interview.route.js`.
  - **Calls Next:** `server/services/groq.service.js`, `server/services/scorer.service.js`, & `server/models/interview.model.js`.
- **`server/controllers/placement.controller.js`**:
  - **Purpose:** Generates comprehensive multi-section placement tests (MCQ, written, aptitude, HR, projects) matching candidate target roles.
  - **When Executed:** When candidate launches a Placement Test.
  - **Called By:** `server/routes/placement.route.js`.
  - **Calls Next:** `server/services/groq.service.js` & `server/models/placement.model.js`.
- **`server/controllers/evaluate.controller.js`**:
  - **Purpose:** Evaluates completed placement tests, grading written answers and computing candidate readiness index.
  - **When Executed:** Upon submitting placement test answers.
  - **Called By:** `server/routes/evaluate.route.js`.
  - **Calls Next:** `server/services/groq.service.js` & `server/models/placement.model.js`.
- **`server/controllers/questions.controller.js`**:
  - **Purpose:** Generates company-tailored interview questions and personalized step-by-step career roadmaps.
  - **When Executed:** On Company Prep or Roadmap page form submissions.
  - **Called By:** `server/routes/questions.route.js`.
  - **Calls Next:** `server/services/groq.service.js`.
- **`server/controllers/resume.controller.js`**:
  - **Purpose:** Extracts text from uploaded PDF resumes using pdfjs-dist and sends prompt to Groq AI for detailed feedback.
  - **When Executed:** When user uploads a resume on the Resume Tips page.
  - **Called By:** `server/routes/resume.route.js`.
  - **Calls Next:** `pdfjs-dist` library & `server/services/groq.service.js`.
- **`server/controllers/payment.controller.js`**:
  - **Purpose:** Manages Razorpay order generation and HMAC SHA256 signature verification for credit top-ups.
  - **When Executed:** When purchasing credit packs on the Pricing page.
  - **Called By:** `server/routes/payment.route.js`.
  - **Calls Next:** `server/services/razorpay.service.js`, `server/models/payment.model.js`, & `server/models/user.model.js`.

#### 📁 `server/services/`
- **`server/services/groq.service.js`**:
  - **Purpose:** Primary AI service wrapper interacting with Groq SDK (Llama 3 / Mixtral models) with fallback support.
  - **When Executed:** Whenever any controller requires AI text analysis or JSON generation.
  - **Called By:** All controller files.
  - **Calls Next:** Groq Cloud API.
- **`server/services/openRouter.service.js`**:
  - **Purpose:** Secondary backup AI API service routing requests via OpenRouter if primary Groq service is unavailable.
  - **When Executed:** On Groq service fallback trigger.
  - **Called By:** Backend services/controllers.
  - **Calls Next:** OpenRouter API.
- **`server/services/scorer.service.js`**:
  - **Purpose:** Evaluates transcript metrics (grammar, technical accuracy, speech speed, filler words) to calculate final interview score out of 100.
  - **When Executed:** On finishing an interview session.
  - **Called By:** `server/controllers/interview.controller.js`.
  - **Calls Next:** Groq AI service & returns computed scoring metrics object.
- **`server/services/razorpay.service.js`**:
  - **Purpose:** Initializes Razorpay SDK instance using environment API keys.
  - **When Executed:** Loaded on server startup.
  - **Called By:** `server/controllers/payment.controller.js`.
  - **Calls Next:** Razorpay Gateway API.

#### 📁 `server/public/`
- **`server/public/.gitkeep`**:
  - **Purpose:** Placeholder file ensuring the `public` uploads directory is tracked by Git.
  - **When Executed:** Static directory reference.
  - **Called By:** N/A.
  - **Calls Next:** N/A.

#### 📁 `server/scratch/`
- **`server/scratch/test_ai_questions.js`**:
  - **Purpose:** Test script to test Groq AI question generation directly from terminal.
  - **When Executed:** Manually run during development.
  - **Called By:** Developer via CLI.
  - **Calls Next:** `server/services/groq.service.js`.

---

### 2.2 Client-Side Files (`client/`)

#### 📁 `client/` (Root Client Directory)
- **`client/.env`**:
  - **Purpose:** Frontend environment configuration holding API backend base URL and Firebase config keys.
  - **When Executed:** Loaded at build/dev server startup by Vite.
  - **Called By:** Vite runtime & client utility files.
  - **Calls Next:** `client/src/utils/serverUrl.js` & `client/src/utils/firebase.js`.
- **`client/package.json`**:
  - **Purpose:** Frontend dependencies (react, react-router-dom, redux, tailwindcss, lucide-react, motion) and build scripts (`npm run dev`).
  - **When Executed:** Read by Vite/NPM.
  - **Called By:** NPM CLI.
  - **Calls Next:** Vite build tool.
- **`client/package-lock.json`**:
  - **Purpose:** Locked dependency manifest for frontend node_modules.
  - **When Executed:** Read during `npm install`.
  - **Called By:** NPM CLI.
  - **Calls Next:** N/A.
- **`client/.gitignore`**:
  - **Purpose:** Ignores dist/, node_modules/, and .env in client directory.
  - **When Executed:** Read by Git VCS.
  - **Called By:** Git CLI.
  - **Calls Next:** N/A.
- **`client/README.md`**:
  - **Purpose:** Frontend project setup documentation and overview.
  - **When Executed:** Read by developers.
  - **Called By:** N/A.
  - **Calls Next:** N/A.
- **`client/index.html`**:
  - **Purpose:** Root HTML file containing metadata, Google Fonts links, and `#root` mounting element for React.
  - **When Executed:** Loaded first by browser when visiting frontend URL.
  - **Called By:** Web browser engine.
  - **Calls Next:** `client/src/main.jsx`.
- **`client/vite.config.js`**:
  - **Purpose:** Vite build configuration file setting up React plugin and dev server ports.
  - **When Executed:** On running `npm run dev` or `npm run build`.
  - **Called By:** Vite CLI.
  - **Calls Next:** Bundles frontend code.
- **`client/eslint.config.js`**:
  - **Purpose:** Linter configuration defining code style and syntax rules for JavaScript/React.
  - **When Executed:** Run during code linting commands (`npm run lint`).
  - **Called By:** ESLint CLI.
  - **Calls Next:** Code editor linting extensions.

#### 📁 `client/src/` (Source Directory)
- **`client/src/main.jsx`**:
  - **Purpose:** Application entry file. Renders `App.jsx` inside React DOM root wrapped with Redux `Provider` and React Router `BrowserRouter`.
  - **When Executed:** Immedately after `index.html` loads.
  - **Called By:** `client/index.html`.
  - **Calls Next:** `client/src/App.jsx` & `client/src/redux/store.js`.
- **`client/src/App.jsx`**:
  - **Purpose:** Root React App component. Handles route definitions (`/`, `/interview`, `/placement`, etc.), theme dark mode state, and user auth state hydration on mount.
  - **When Executed:** Rendered by `main.jsx`.
  - **Called By:** `client/src/main.jsx`.
  - **Calls Next:** `Navbar.jsx`, `Footer.jsx`, and requested route page components in `client/src/pages/`.
- **`client/src/index.css`**:
  - **Purpose:** Global CSS styles, Tailwind directives, dark mode colors, scrollbar styles, and glassmorphism utilities.
  - **When Executed:** Loaded into DOM on initial render.
  - **Called By:** `client/src/main.jsx`.
  - **Calls Next:** Applied to all styled components.
- **`client/src/App.css`**:
  - **Purpose:** Component-specific custom CSS animations and layout adjustments.
  - **When Executed:** Loaded into DOM.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Applied to targeted UI elements.

#### 📁 `client/src/redux/`
- **`client/src/redux/store.js`**:
  - **Purpose:** Configures central Redux store combining `userSlice` and `interviewSlice`.
  - **When Executed:** Initialized when `main.jsx` runs.
  - **Called By:** `client/src/main.jsx`.
  - **Calls Next:** Redux state tree.
- **`client/src/redux/userSlice.js`**:
  - **Purpose:** Redux state slice holding user authentication status, profile object, and current credit count.
  - **When Executed:** Updated whenever user logs in, logs out, or spends/buys credits.
  - **Called By:** `App.jsx`, `Navbar.jsx`, `Step1SetUp.jsx`, `Pricing.jsx`.
  - **Calls Next:** Consumed by UI components subscribing to `useSelector(state => state.user)`.
- **`client/src/redux/interviewSlice.js`**:
  - **Purpose:** Redux state slice holding active interview data (interviewId, questions, current index, interview step).
  - **When Executed:** Updated during AI mock interview setup and completion.
  - **Called By:** `InterviewPage.jsx`, `Step1SetUp.jsx`, `Step2Interview.jsx`.
  - **Calls Next:** Consumed by interview flow step components.

#### 📁 `client/src/utils/`
- **`client/src/utils/serverUrl.js`**:
  - **Purpose:** Exports the backend server base URL string depending on environment (production vs local localhost).
  - **When Executed:** Imported wherever `axios` API calls are made.
  - **Called By:** All page and component files making backend API calls.
  - **Calls Next:** `axios` HTTP requests.
- **`client/src/utils/firebase.js`**:
  - **Purpose:** Initializes Firebase App and Google Auth Provider for one-click Google Sign-In popups.
  - **When Executed:** Triggered when user clicks "Continue with Google" button.
  - **Called By:** `AuthModel.jsx` & `Auth.jsx`.
  - **Calls Next:** Firebase Authentication API & backend `/api/auth/google`.
- **`client/src/utils/jobRoles.js`**:
  - **Purpose:** Exports static dropdown datasets of job roles, skills, and experience options for interview setup forms.
  - **When Executed:** Imported when rendering form setup components.
  - **Called By:** `Step1SetUp.jsx`, `CompanyPrep.jsx`, `PlacementTestPage.jsx`.
  - **Calls Next:** Selection dropdown UI elements.

#### 📁 `client/src/assets/`
- **`logo.png`**: Brand logo graphic displayed in Navbar, Footer, and loading screens.
- **`HR.png`, `MM.png`, `ai-ans.png`, `career_path.png`, `confi.png`, `credit.png`, `history.png`, `img1.png`, `pdf.png`, `resume.png`, `tech.png`**: Visual icons and hero illustrations used across feature pages.
- **`videos/male-ai.mp4`**: Avatar video loop played when male AI interviewer is speaking during voice interviews.
- **`videos/female-ai.mp4`**: Avatar video loop played when female AI interviewer is speaking during voice interviews.

#### 📁 `client/src/pages/`
- **`client/src/pages/Home.jsx`**:
  - **Purpose:** Landing page showcasing platform features, animated hero banner, interactive feature cards, and CTA buttons.
  - **When Executed:** Route `/`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** `Navbar.jsx`, `Footer.jsx`, `AuthModel.jsx`.
- **`client/src/pages/Auth.jsx`**:
  - **Purpose:** Dedicated full-page authentication route for user signup and login.
  - **When Executed:** Route `/auth`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** `firebase.js`, backend `/api/auth`, `userSlice.js`.
- **`client/src/pages/InterviewPage.jsx`**:
  - **Purpose:** Main controller container page for the 3-step AI Mock Interview process.
  - **When Executed:** Route `/interview`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** `Step1SetUp.jsx`, `Step2Interview.jsx`, `Step3Report.jsx`.
- **`client/src/pages/PlacementTestPage.jsx`**:
  - **Purpose:** Interactive multi-part placement exam engine (MCQs, written coding questions, HR scenarios).
  - **When Executed:** Route `/placement`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Backend `/api/placement/generate`, `PlacementResultsPage.jsx`.
- **`client/src/pages/PlacementResultsPage.jsx`**:
  - **Purpose:** Displays comprehensive AI evaluation scorecard and feedback for completed placement tests.
  - **When Executed:** Route `/placement-results`.
  - **Called By:** `client/src/App.jsx` & `PlacementTestPage.jsx`.
  - **Calls Next:** Backend `/api/evaluate/submit`.
- **`client/src/pages/InterviewHistory.jsx`**:
  - **Purpose:** Shows list of all previous mock interviews taken by the logged-in user with dates and scores.
  - **When Executed:** Route `/history`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Backend `/api/interview/user-interviews`, `InterviewReport.jsx`.
- **`client/src/pages/InterviewReport.jsx`**:
  - **Purpose:** Displays standalone detailed performance report for a specific historical interview ID.
  - **When Executed:** Route `/report/:id`.
  - **Called By:** `client/src/App.jsx` & `InterviewHistory.jsx`.
  - **Calls Next:** Backend `/api/interview/:id`.
- **`client/src/pages/CompanyPrep.jsx`**:
  - **Purpose:** Allows users to pick specific target companies (e.g. Google, Amazon) and receive custom interview questions.
  - **When Executed:** Route `/company-prep`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Backend `/api/questions/company-questions`.
- **`client/src/pages/Roadmap.jsx`**:
  - **Purpose:** Generates interactive step-by-step career transition roadmaps tailored to user target job roles.
  - **When Executed:** Route `/roadmap`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Backend `/api/questions/generate-roadmap`.
- **`client/src/pages/ResumeTips.jsx`**:
  - **Purpose:** Resume review tool allowing PDF upload to receive AI feedback and ATS score optimization tips.
  - **When Executed:** Route `/resume-tips`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Backend `/api/resume/analyze`.
- **`client/src/pages/Guidance.jsx`**:
  - **Purpose:** Career counseling hub offering preparation strategies, interview tips, and salary negotiation guides.
  - **When Executed:** Route `/guidance`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Visual static components.
- **`client/src/pages/Pricing.jsx`**:
  - **Purpose:** Displays credit package options and handles Razorpay checkout popups to purchase credits.
  - **When Executed:** Route `/pricing`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** Backend `/api/payment/create-order` & `/api/payment/verify`.

#### 📁 `client/src/components/`
- **`client/src/components/Navbar.jsx`**:
  - **Purpose:** Top navigation bar displaying logo, page links, user credit badge, dark mode toggle, and profile menu.
  - **When Executed:** Rendered continuously across all pages by `App.jsx`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** `Logo.jsx`, `AuthModel.jsx`, `userSlice.js`.
- **`client/src/components/Footer.jsx`**:
  - **Purpose:** Bottom footer displaying brand info, social links, and navigational links.
  - **When Executed:** Rendered at bottom of pages by `App.jsx`.
  - **Called By:** `client/src/App.jsx`.
  - **Calls Next:** `Logo.jsx`.
- **`client/src/components/Logo.jsx`**:
  - **Purpose:** Reusable brand logo component rendering application icon and gradient text.
  - **When Executed:** Rendered inside Navbar, Footer, and Auth modals.
  - **Called By:** `Navbar.jsx`, `Footer.jsx`, `AuthModel.jsx`.
  - **Calls Next:** SVG / image assets.
- **`client/src/components/AuthModel.jsx`**:
  - **Purpose:** Modal popup window enabling user login, registration, and Google OAuth without leaving current page.
  - **When Executed:** Triggered when clicking "Login" or "Get Started" in Navbar or Home page.
  - **Called By:** `Navbar.jsx` & `Home.jsx`.
  - **Calls Next:** `firebase.js`, backend `/api/auth`, `userSlice.js`.
- **`client/src/components/Step1SetUp.jsx`**:
  - **Purpose:** Step 1 component of mock interview setup form (selecting role, experience level, mode, and PDF resume).
  - **When Executed:** Rendered inside `InterviewPage.jsx` when step is 1.
  - **Called By:** `client/src/pages/InterviewPage.jsx`.
  - **Calls Next:** Backend `/api/interview/generate-questions`, updates `interviewSlice.js`.
- **`client/src/components/Step2Interview.jsx`**:
  - **Purpose:** Step 2 interactive voice interview workspace with video AI avatar speaking questions and speech recognition capturing candidate spoken answers.
  - **When Executed:** Rendered inside `InterviewPage.jsx` when step is 2.
  - **Called By:** `client/src/pages/InterviewPage.jsx`.
  - **Calls Next:** `Timer.jsx`, Web Speech API, backend `/api/interview/submit-answer` & `/finish`.
- **`client/src/components/Step3Report.jsx`**:
  - **Purpose:** Step 3 component rendering interactive final scorecards, performance metrics, strengths, and Improvement recommendations.
  - **When Executed:** Rendered inside `InterviewPage.jsx` when step is 3.
  - **Called By:** `client/src/pages/InterviewPage.jsx`.
  - **Calls Next:** Renders report graphics & PDF download button.
- **`client/src/components/Timer.jsx`**:
  - **Purpose:** Circular SVG countdown timer component showing remaining time for current question.
  - **When Executed:** Rendered during active voice interview inside `Step2Interview.jsx`.
  - **Called By:** `client/src/components/Step2Interview.jsx`.
  - **Calls Next:** Pure UI component.

---

### 2.3 Workspace Root Documentation Files
- **`README.md`**: Project overview, feature highlights, environment setup guide, and tech stack details.
- **`arch.md`**: System architecture specification document detailing backend API schemas and database relationships.
- **`WORKFLOW.md`**: *(This file)* Comprehensive project execution order, file-by-file reference, and end-to-end request flow ASCII diagrams.

---

## 3. Comprehensive File Specifications Reference

| File Path | Purpose (1-2 lines) | Executed When | Called By | Calls Next |
| :--- | :--- | :--- | :--- | :--- |
| `server/index.js` | Server entry point configuring Express middleware, CORS, cookies, & API routes. | On backend boot | NPM start scripts | `connectDb.js`, `routes/*` |
| `server/config/connectDb.js` | Connects server to MongoDB Atlas using Mongoose client. | On server startup | `server/index.js` | MongoDB Database |
| `server/config/token.js` | Signs JWT token and sets secure HTTP-only cookie. | User auth success | `auth.controller.js` | Client HTTP Cookie |
| `server/middlewares/isAuth.js` | Protects private endpoints by verifying request JWT cookie. | API route request | Protected routes | Controller handlers |
| `server/middlewares/multer.js` | Handles disk storage for uploaded PDF resumes. | File upload route | `interview.route.js`, `resume.route.js` | Controllers |
| `server/models/user.model.js` | User database schema (email, password, credits, Google ID). | DB operations | Auth/User/Payment controllers | MongoDB `users` |
| `server/models/interview.model.js` | Interview session schema (questions, answers, scores, feedback). | Interview operations | `interview.controller.js` | MongoDB `interviews` |
| `server/models/placement.model.js` | Placement test schema (questions, answers, sections, scores). | Placement test operations | `placement.controller.js`, `evaluate.controller.js` | MongoDB `placements` |
| `server/models/payment.model.js` | Payment transaction schema (order ID, payment ID, amount, status). | Credit purchase | `payment.controller.js` | MongoDB `payments` |
| `server/routes/auth.route.js` | Auth route endpoints (`/register`, `/login`, `/google`, `/logout`). | Request to `/api/auth` | `server/index.js` | `auth.controller.js` |
| `server/routes/user.route.js` | User details endpoint (`/me`). | Request to `/api/user` | `server/index.js` | `user.controller.js` |
| `server/routes/interview.route.js` | Interview workflow endpoints. | Request to `/api/interview` | `server/index.js` | `interview.controller.js` |
| `server/routes/placement.route.js` | Placement test generation endpoints. | Request to `/api/placement` | `server/index.js` | `placement.controller.js` |
| `server/routes/evaluate.route.js` | Placement evaluation submission endpoints. | Request to `/api/evaluate` | `server/index.js` | `evaluate.controller.js` |
| `server/routes/questions.route.js` | Company prep & roadmap endpoints. | Request to `/api/questions` | `server/index.js` | `questions.controller.js` |
| `server/routes/resume.route.js` | Resume analysis upload endpoints. | Request to `/api/resume` | `server/index.js` | `resume.controller.js` |
| `server/routes/payment.route.js` | Razorpay order & verification endpoints. | Request to `/api/payment` | `server/index.js` | `payment.controller.js` |
| `server/controllers/auth.controller.js` | Logic for registration, login, Google OAuth & token creation. | Auth route triggered | `auth.route.js` | `user.model.js`, `token.js` |
| `server/controllers/interview.controller.js` | AI mock interview question generation and answer processing. | Interview route triggered | `interview.route.js` | `groq.service.js`, `interview.model.js` |
| `server/controllers/placement.controller.js` | Generates 5-part placement readiness test questions. | Placement route triggered | `placement.route.js` | `groq.service.js`, `placement.model.js` |
| `server/controllers/evaluate.controller.js` | Evaluates submitted placement test answers using AI. | Evaluate route triggered | `evaluate.route.js` | `groq.service.js`, `placement.model.js` |
| `server/controllers/questions.controller.js` | Generates company questions and roadmap guides via Groq AI. | Questions route triggered | `questions.route.js` | `groq.service.js` |
| `server/controllers/resume.controller.js` | Extracts PDF text and evaluates resume with Groq AI. | Resume route triggered | `resume.route.js` | `pdfjs-dist`, `groq.service.js` |
| `server/controllers/payment.controller.js` | Generates Razorpay orders & verifies payment HMAC signatures. | Payment route triggered | `payment.route.js` | `razorpay.service.js`, `user.model.js` |
| `server/services/groq.service.js` | Wrapper for Groq SDK (Llama 3 / Mixtral) AI queries. | Controller needs AI | Controllers | Groq Cloud API |
| `server/services/openRouter.service.js` | Fallback AI service via OpenRouter API. | Groq fails | Services/Controllers | OpenRouter API |
| `server/services/scorer.service.js` | Computes candidate speech accuracy, grammar, & score metrics. | Interview finishes | `interview.controller.js` | `groq.service.js` |
| `server/services/razorpay.service.js` | Initializes Razorpay API instance. | Server start / payment | `payment.controller.js` | Razorpay API |
| `client/src/main.jsx` | Mounts React app root inside DOM with Provider & Router. | On HTML load | `client/index.html` | `App.jsx`, `store.js` |
| `client/src/App.jsx` | App routing table, theme provider, & auth loader. | Rendered by `main.jsx` | `main.jsx` | `Navbar.jsx`, `pages/*` |
| `client/src/redux/store.js` | Configures global Redux state store. | App start | `main.jsx` | Redux Slices |
| `client/src/redux/userSlice.js` | Redux slice managing user auth state & credits. | User login/logout | Components | Redux State |
| `client/src/redux/interviewSlice.js` | Redux slice managing current interview state. | Interview workflow | Components | Redux State |
| `client/src/utils/serverUrl.js` | Exports backend base API URL string. | Component mounting | API call components | Axios requests |
| `client/src/utils/firebase.js` | Configures Firebase & Google OAuth popup provider. | User clicks Google login | `AuthModel.jsx`, `Auth.jsx` | Firebase Google Auth |
| `client/src/pages/Home.jsx` | Platform landing page with hero banner & features. | Route `/` | `App.jsx` | `Navbar.jsx`, `AuthModel.jsx` |
| `client/src/pages/InterviewPage.jsx` | Container for 3-step mock interview process. | Route `/interview` | `App.jsx` | `Step1SetUp.jsx`, `Step2Interview.jsx`, `Step3Report.jsx` |
| `client/src/components/Step1SetUp.jsx` | Interview role/experience/resume input form. | Step 1 active | `InterviewPage.jsx` | Backend `/api/interview/generate-questions` |
| `client/src/components/Step2Interview.jsx` | Interactive AI voice interview screen with video avatar. | Step 2 active | `InterviewPage.jsx` | `Timer.jsx`, Speech API, Backend `/submit-answer` |
| `client/src/components/Step3Report.jsx` | Final interview performance scorecard view. | Step 3 active | `InterviewPage.jsx` | UI canvas graphics |
| `client/src/components/Timer.jsx` | Circular SVG progress bar timer for questions. | Interview running | `Step2Interview.jsx` | UI rendering |
| `client/src/pages/PlacementTestPage.jsx` | 5-part placement test engine interface. | Route `/placement` | `App.jsx` | Backend `/api/placement/generate` |
| `client/src/pages/PlacementResultsPage.jsx` | Scorecard display for evaluated placement tests. | Route `/placement-results` | `App.jsx` | Backend `/api/evaluate/submit` |
| `client/src/pages/Pricing.jsx` | Credit pricing cards with Razorpay checkout integration. | Route `/pricing` | `App.jsx` | Backend `/api/payment/create-order` |

---

## 4. End-to-End Request Flow Diagrams & Theory

### 4.1 Authentication Flow (Google OAuth / Email Login)

> **Theory:** When a user logs in via Google or Email, the client sends credentials to the backend. The server validates the user in MongoDB, generates a signed JWT token, and returns it inside an HTTP-only secure cookie while updating the client Redux state.

```
+------------------+         +--------------------+         +-----------------------+         +------------------+
| Client Browser   |         | Express Server     |         | External Auth         |         | MongoDB Atlas    |
| (AuthModel.jsx)  |         | (auth.controller)  |         | (Firebase / Google)   |         | (user.model.js)  |
+--------+---------+         +---------+----------+         +-----------+-----------+         +--------+---------+
         |                             |                                |                          |
         |  1. Google Login Click      |                                |                          |
         +---------------------------->|                                |                          |
         |                             |  2. Verify Token               |                          |
         |                             +------------------------------->|                          |
         |                             |<-------------------------------+                          |
         |                             |  3. Token Validated            |                          |
         |                             |                                                           |
         |                             |  4. Find or Create User                                   |
         |                             +---------------------------------------------------------->|
         |                             |<----------------------------------------------------------+
         |                             |  5. User Document Returned                                |
         |                             |                                                           |
         |                             |  6. Generate JWT Cookie (token.js)                        |
         |<----------------------------+                                                           |
         |  7. HTTP 200 OK + Cookie    |                                                           |
         |     Dispatch userSlice      |                                                           |
```

---

### 4.2 AI Mock Interview Flow (Resume Parsing & Question Generation)

> **Theory:** The user submits their target job role, experience level, and optional PDF resume. Multer parses the resume, the backend constructs a structured prompt for Groq AI, deducts 50 credits from the user's account, and returns synthesized interview questions.

```
+--------------------+      +--------------------+      +--------------------+      +--------------------+      +--------------------+
| Client             |      | Server Middleware  |      | Controller         |      | Groq Service       |      | MongoDB            |
| (Step1SetUp.jsx)   |      | (isAuth & multer)  |      | (interview.cntrl)  |      | (groq.service.js)  |      | (interview.model)  |
+---------+----------+      +---------+----------+      +---------+----------+      +---------+----------+      +---------+----------+
          |                           |                           |                           |                           |
          | 1. POST /generate-questions                           |                           |                           |
          +-------------------------->|                           |                           |                           |
          |                           | 2. Verify Cookie & Upload |                           |                           |
          |                           +-------------------------->|                           |                           |
          |                           |                           | 3. Parse PDF Resume       |                           |
          |                           |                           |                           |                           |
          |                           |                           | 4. Ask Groq AI for Qs     |                           |
          |                           |                           +-------------------------->|                           |
          |                           |                           |<--------------------------+                           |
          |                           |                           | 5. Return JSON Qs Array   |                           |
          |                           |                           |                                                       |
          |                           |                           | 6. Deduct 50 Credits & Save Session                   |
          |                           |                           +------------------------------------------------------>|
          |                           |                           |<------------------------------------------------------+
          |                           |                           | 7. Session Saved                                      |
          |<------------------------------------------------------+                                                       |
          | 8. Receive Questions & Render Voice Step2                                                                     |
```

---

### 4.3 Interactive Voice Interview & Answer Submission Flow

> **Theory:** During the voice interview, the browser synthesizes speech for questions and listens to candidate speech using the Web Speech API. When answered or when the timer expires, the answer text is posted to the server, where Groq AI generates instant real-time feedback.

```
+-----------------------+       +------------------------+       +-----------------------+       +-----------------------+
| Client UI             |       | Web Speech API         |       | Express Controller    |       | Groq AI Service       |
| (Step2Interview.jsx)  |       | (TTS & Recognition)    |       | (interview.cntrl)     |       | (groq.service.js)     |
+-----------+-----------+       +-----------+------------+       +-----------+-----------+       +-----------+-----------+
            |                               |                                |                               |
            | 1. Speak Question Text        |                                |                               |
            +------------------------------>|                                |                               |
            |                               | 2. Play Audio Avatar Voice     |                               |
            |                               |                                |                               |
            | 3. Turn on Mic & Capture      |                                |                               |
            +------------------------------>|                                |                               |
            |                               | 4. Return Transcribed Text     |                               |
            |<------------------------------+                                |                               |
            |                                                                |                               |
            | 5. POST /submit-answer (Answer + Time Taken)                   |                               |
            +--------------------------------------------------------------->|                               |
            |                                                                | 6. Analyze Answer Feedback    |
            |                                                                +------------------------------>|
            |                                                                |<------------------------------+
            |                                                                | 7. Return AI Feedback Text    |
            |<---------------------------------------------------------------+                               |
            | 8. Play Feedback Voice & Load Next Question                                                    |
```

---

### 4.4 Placement Test AI Evaluation Flow

> **Theory:** When a candidate completes the 5-part Placement Test, all technical MCQs and written responses are submitted. The evaluation controller passes written answers to Groq AI to calculate section scores, skill gaps, and a placement readiness index.

```
+---------------------------+       +------------------------+       +-----------------------+       +-----------------------+
| Client UI                 |       | Express Route          |       | Evaluate Controller   |       | Groq AI Service       |
| (PlacementResultsPage)    |       | (/api/evaluate/submit) |       | (evaluate.controller) |       | (groq.service.js)     |
+-------------+-------------+       +-----------+------------+       +-----------+-----------+       +-----------+-----------+
              |                                 |                                |                               |
              | 1. Submit Full Test Answers     |                                |                               |
              +-------------------------------->|                                |                               |
              |                                 | 2. Forward Request             |                               |
              |                                 +------------------------------->|                               |
              |                                 |                                | 3. Send Written Answers       |
              |                                 +------------------------------>|                                |
              |                                 |<------------------------------+                                |
              |                                 | 4. Return Graded Scores & Gaps |                                |
              |                                 |                                |                               |
              |                                 | 5. Save Scorecard to MongoDB  |                                |
              |                                 |<-------------------------------+                               |
              |<--------------------------------+                                                                |
              | 6. Render Visual Placement Scorecard                                                             |
```

---

### 4.5 Razorpay Payment & Credit Top-up Flow

> **Theory:** Purchasing credits triggers Razorpay order generation on the server. The user completes payment in the Razorpay modal. Upon return, the HMAC SHA256 payment signature is verified server-side, and user credits are increased in MongoDB.

```
+--------------------+     +--------------------+     +---------------------+     +-------------------+     +--------------------+
| Client             |     | Server             |     | Razorpay Gateway    |     | HMAC Signature    |     | MongoDB            |
| (Pricing.jsx)      |     | (payment.cntrl)    |     | (razorpay.service)  |     | Verification      |     | (user.model.js)    |
+---------+----------+     +---------+----------+     +----------+----------+     +---------+---------+     +---------+----------+
          |                          |                           |                          |                         |
          | 1. Click Buy Credits     |                           |                          |                         |
          +------------------------->| 2. Create Order           |                          |                         |
          |                          +-------------------------->|                          |                         |
          |                          |<--------------------------+                          |                         |
          |<-------------------------+ 3. Return Order ID                                   |                         |
          |                                                                                 |                         |
          | 4. Open Razorpay Modal & Complete Payment                                       |                         |
          +----------------------------------------------------->|                          |                         |
          |<-----------------------------------------------------+ 5. Return Payment ID     |                         |
          |                                                                                 |                         |
          | 6. POST /verify (orderId, paymentId, signature)                                 |                         |
          +-------------------------------------------------------------------------------->|                         |
          |                                                                                 | 7. Verify Signature     |
          |                                                                                 |    Match                |
          |                                                                                 |                         |
          |                                                                                 | 8. Increment Credits    |
          |                                                                                 +------------------------>|
          |                                                                                 |<------------------------+
          |<--------------------------------------------------------------------------------+                         |
          | 9. Payment Verified! Credits Updated in UI                                                                |
```

---

*This document serves as the authoritative execution flow reference for the WeWithU AI codebase.*
