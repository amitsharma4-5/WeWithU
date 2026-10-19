import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "motion/react";
import { BsMap, BsCalendar4Event, BsCurrencyRupee, BsPersonWorkspace, BsLink45Deg } from "react-icons/bs";

const FIELDS = [
  { id: "datascience",    label: "Data Science",          icon: "📊" },
  { id: "ml",             label: "Machine Learning",       icon: "🤖" },
  { id: "ai",             label: "Artificial Intelligence",icon: "🧠" },
  { id: "webdev",         label: "Web Development",        icon: "🌐" },
  { id: "fullstack",      label: "Full Stack Dev",         icon: "⚡" },
  { id: "backend",        label: "Backend Development",    icon: "⚙️" },
  { id: "frontend",       label: "Frontend Development",   icon: "🎨" },
  { id: "devops",         label: "DevOps",                 icon: "🔧" },
  { id: "cybersecurity",  label: "Cybersecurity",          icon: "🔒" },
  { id: "dataanalytics",  label: "Data Analytics",         icon: "📈" },
  { id: "cloud",          label: "Cloud Computing",        icon: "☁️" },
  { id: "appdev",         label: "App Development",        icon: "📱" },
  { id: "blockchain",     label: "Blockchain",             icon: "🔗" },
  { id: "uiux",           label: "UI/UX Design",           icon: "✏️" },
];

const ROADMAPS = {
  datascience: {
    title: "Data Science Specialization Roadmap",
    duration: "6-9 months",
    jobRoles: ["Data Scientist", "ML Engineer", "Data Analyst", "Research Scientist"],
    avgSalary: "6 - 25 LPA",
    steps: [
      { num: "01", title: "Mathematics & Statistics Core", icon: "📐", level: "beginner", time: "4 weeks", free: true, desc: "Linear Algebra (vectors, matrix transformations, eigenvalues), Probability Theory (Bayes' Theorem, combinations), Descriptive and Inferential Statistics (mean, standard deviation, hypothesis testing, p-values, z-scores). Essential for algorithm logic.", resources: "Khan Academy Math, 3Blue1Brown (YouTube), StatQuest" },
      { num: "02", title: "Python Programming & Sci-Kit Tools", icon: "🐍", level: "beginner", time: "4 weeks", free: true, desc: "Python basics (OOP, lambda functions, file management). NumPy for multidimensional array processing and Pandas for data manipulation. Matplotlib and Seaborn for standard plotting.", resources: "Corey Schafer YouTube, Kaggle Python tutorials, Pandas docs" },
      { num: "03", title: "Database Systems & SQL Queries", icon: "🗄️", level: "beginner", time: "2 weeks", free: true, desc: "Relational database basics, SELECT queries, JOIN operations, subqueries, GROUP BY, window functions, and database indexing. Necessary for retrieving large raw datasets.", resources: "Mode Analytics SQL, LeetCode SQL Practice, W3Schools SQL" },
      { num: "04", title: "Exploratory Data Analysis (EDA)", icon: "🔍", level: "intermediate", time: "3 weeks", free: true, desc: "Data cleaning processes, handling missing values and outliers, imputation strategies, correlation matrices, feature scaling, and standard data profiling.", resources: "Kaggle EDA Notebooks, Pandas profiling guides" },
      { num: "05", title: "Classical Machine Learning", icon: "🤖", level: "intermediate", time: "6 weeks", free: true, desc: "Supervised learning (linear/logistic regression, decision trees, random forests, SVMs) and unsupervised learning (K-Means, PCA). Learn cross-validation, hyperparameter tuning via GridSearchCV.", resources: "Andrew Ng ML course on Coursera, Hands-On ML (Geron Book)" },
      { num: "06", title: "Deep Learning Foundations", icon: "🧠", level: "intermediate", time: "6 weeks", free: false, desc: "Neural network architectures, activation functions (ReLU, Sigmoid), backpropagation algorithms. Building feedforward and convolutional neural networks (CNNs) in PyTorch or TensorFlow.", resources: "fast.ai Deep Learning course, DeepLearning.AI Coursera" },
      { num: "07", title: "Feature Engineering & Advanced Tuning", icon: "⚙️", level: "advanced", time: "3 weeks", free: true, desc: "Handling imbalanced datasets (SMOTE), target encoding, binning, dimensionality reduction (t-SNE), and advanced hyperparameter libraries like Optuna and XGBoost/LightGBM.", resources: "Kaggle Competitions, Feature Engineering for ML (O'Reilly Book)" },
      { num: "08", title: "Production Deployment & MLOps", icon: "🚀", level: "advanced", time: "4 weeks", free: true, desc: "Building dashboard UI with Streamlit or Gradio. Serving ML model predictions through REST APIs using FastAPI, containerizing with Docker, and hosting on AWS/Render.", resources: "Streamlit Docs, Docker Getting Started, FastAPI guides" },
    ],
  },
  ml: {
    title: "Machine Learning Engineering Roadmap",
    duration: "7-10 months",
    jobRoles: ["ML Engineer", "AI Researcher", "MLOps Engineer", "Data Scientist"],
    avgSalary: "8 - 30 LPA",
    steps: [
      { num: "01", title: "Mathematical Foundations for ML", icon: "📐", level: "beginner", time: "4 weeks", free: true, desc: "Multivariable Calculus (partial derivatives, gradients for optimization), Linear Algebra (matrix decomposition, SVD), Probability distributions, and optimization models.", resources: "Khan Academy Calculus, Mathematics for ML Book" },
      { num: "02", title: "Classical Machine Learning & Scikit-Learn", icon: "🤖", level: "beginner", time: "6 weeks", free: true, desc: "Mastering linear models, support vector machines, tree ensemble classifiers (Random Forest, Gradient Boosting, XGBoost), clustering engines, and pipelines in Scikit-Learn.", resources: "Scikit-Learn documentation, StatQuest YouTube Channel" },
      { num: "03", title: "Deep Learning & PyTorch/TensorFlow Core", icon: "🧠", level: "intermediate", time: "8 weeks", free: false, desc: "Deep neural networks (DNNs), activation functions, optimizers (Adam, SGD, RMSprop). CNNs for image processing, RNNs/LSTMs for sequential text data.", resources: "PyTorch Official Tutorials, DeepLearning.AI Specialization" },
      { num: "04", title: "Natural Language Processing & HuggingFace", icon: "📝", level: "intermediate", time: "5 weeks", free: true, desc: "Tokenization methods, TF-IDF, Word Embeddings (Word2Vec). Modern transformer models (BERT, GPT), fine-tuning pre-trained models using HuggingFace library.", resources: "HuggingFace NLP Course, Stanford CS224N Lectures" },
      { num: "05", title: "MLOps, MLflow & Docker Packaging", icon: "🏗️", level: "advanced", time: "6 weeks", free: true, desc: "Model tracking using MLflow, package management with Docker, building model serving pipelines via FastAPI, CI/CD for ML deployments, and tracking model drift.", resources: "MLflow documentation, Chip Huyen's ML Systems Design" },
    ],
  },
  ai: {
    title: "Generative AI & LLM Architect Roadmap",
    duration: "8-12 months",
    jobRoles: ["GenAI Engineer", "AI Solutions Architect", "LLM Engineer", "NLP Researcher"],
    avgSalary: "10 - 35 LPA",
    steps: [
      { num: "01", title: "Core Math & Python Foundations", icon: "📐", level: "beginner", time: "4 weeks", free: true, desc: "Multivariable Calculus, Linear Algebra, Probability, and Python programming with focus on scientific libraries (NumPy, PyTorch).", resources: "3Blue1Brown, Stanford CS229 math reviews" },
      { num: "02", title: "Deep Learning & NLP Basics", icon: "🧠", level: "beginner", time: "6 weeks", free: true, desc: "Multi-layer Perceptrons, Backpropagation, CNNs for vision, RNNs/LSTMs for text, word vectors, and basic seq2seq attention mechanisms.", resources: "DeepLearning.AI, Stanford CS224N lectures" },
      { num: "03", title: "Transformer Architecture & LLMs", icon: "🌐", level: "intermediate", time: "6 weeks", free: true, desc: "Self-Attention mechanism, Multi-head attention, Positional encoding, Encoder-Decoder architectures (BERT, GPT, T5). Understanding text generation parameters (temperature, top-k, top-p).", resources: "Illustrated Transformer (Jay Alammar), HuggingFace docs" },
      { num: "04", title: "Retrieval-Augmented Generation (RAG)", icon: "🔍", level: "intermediate", time: "6 weeks", free: true, desc: "Connecting LLMs to external data. Document loaders, text splitters, embedding models, vector databases (ChromaDB, Pinecone, Milvus), LangChain/LlamaIndex frameworks.", resources: "LangChain docs, Pinecone learning path" },
      { num: "05", title: "Fine-Tuning & Model Alignment", icon: "⚙️", level: "advanced", time: "6 weeks", free: true, desc: "Parameter-Efficient Fine-Tuning (PEFT, LoRA, QLoRA), Supervised Fine-Tuning (SFT), RLHF (Reinforcement Learning from Human Feedback), DPO (Direct Preference Optimization).", resources: "HuggingFace fine-tuning guides, Axolotl docs" },
      { num: "06", title: "Model Deployment & Quantization", icon: "🚀", level: "advanced", time: "6 weeks", free: false, desc: "Quantization strategies (GGML/GGUF, AWQ, GPTQ), model formats, deploying models locally with Ollama/vLLM, hosting serving APIs on AWS/GCP with secure authentication.", resources: "vLLM documentation, Ollama GitHub guides" },
    ],
  },
  webdev: {
    title: "Web Development Career Roadmap",
    duration: "5-7 months",
    jobRoles: ["Web Developer", "Frontend Dev", "Backend Dev", "Full Stack Dev"],
    avgSalary: "5 - 20 LPA",
    steps: [
      { num: "01", title: "HTML5 & CSS3 Web Basics", icon: "🌐", level: "beginner", time: "3 weeks", free: true, desc: "Semantic HTML5, CSS selectors, Box Model, Flexbox, CSS Grid, media queries, mobile-first responsive web design. Build 3 responsive landing pages.", resources: "MDN Web Docs, freeCodeCamp, CSS-Tricks" },
      { num: "02", title: "Modern JavaScript (ES6+)", icon: "⚡", level: "beginner", time: "5 weeks", free: true, desc: "Variables, scope, functions, arrays, objects, JSON, DOM manipulation, asynchronous programming (Promises, Async/Await), and fetching API data.", resources: "javascript.info, Eloquent JavaScript, Web Dev Simplified (YouTube)" },
      { num: "03", title: "React.js Frontend UI", icon: "⚛️", level: "intermediate", time: "6 weeks", free: true, desc: "Components, Props, Hooks (useState, useEffect, useContext, useRef), React Router navigation, State management, custom hooks, and form validations.", resources: "React.dev Docs, Scrimba React Course, Academind (YouTube)" },
      { num: "04", title: "Node.js & Express.js Server", icon: "🟢", level: "intermediate", time: "4 weeks", free: true, desc: "Building RESTful backend APIs with Express.js. Handling HTTP methods, request/response objects, writing middleware, and error handling configurations.", resources: "Node.js documentation, Express.js guides, The Odin Project" },
      { num: "05", title: "Databases, Authentication & Deploy", icon: "🗄️", level: "intermediate", time: "4 weeks", free: true, desc: "PostgreSQL (SQL) and MongoDB (NoSQL) databases. JWT (JSON Web Tokens) user authentication, password security with bcrypt, hosting on Vercel/Render.", resources: "Prisma docs, MongoDB University, JWT.io" },
    ],
  },
  fullstack: {
    title: "MERN & Next.js Full Stack Engineer",
    duration: "8-12 months",
    jobRoles: ["Full Stack Developer", "Software Engineer", "SDE-1", "Technical Architect"],
    avgSalary: "6 - 25 LPA",
    steps: [
      { num: "01", title: "Advanced Frontend Fundamentals", icon: "🎨", level: "beginner", time: "6 weeks", free: true, desc: "Mastering HTML5, CSS layout grids, flexbox, Tailwind CSS utility-first styling framework, responsive layout configurations, and modern ES6+ JS features.", resources: "Tailwind CSS documentation, MDN JS guides" },
      { num: "02", title: "React.js & State Management", icon: "⚛️", level: "intermediate", time: "6 weeks", free: true, desc: "Advanced React architectures, hook patterns, Context API, state management with Redux Toolkit or Zustand, and data queries using React Query.", resources: "Redux Toolkit docs, React Query guides, Jack Herrington (YouTube)" },
      { num: "03", title: "Server Architecture (Node & Express)", icon: "⚙️", level: "intermediate", time: "6 weeks", free: true, desc: "Building secure, modular, enterprise REST APIs. Controller-Service-Repository architecture pattern, request input validations, custom error handlers.", resources: "Node.js docs, Express.js controller routing guides" },
      { num: "04", title: "Databases & Data Modeling", icon: "🗄️", level: "intermediate", time: "4 weeks", free: true, desc: "Designing schemas. PostgreSQL relational design, tables, joins, transactions with Prisma. MongoDB document schemas, collections, indexes with Mongoose.", resources: "Mongoose guides, Prisma official database manuals" },
      { num: "05", title: "Next.js Full Stack Framework", icon: "🌐", level: "advanced", time: "6 weeks", free: true, desc: "Server-side rendering (SSR), Static Site Generation (SSG), Incremental Static Regeneration (ISR), Next.js App Router, Server Actions, API routes, middleware.", resources: "Nextjs.org/docs, Lee Robinson blogs" },
      { num: "06", title: "Docker & AWS Cloud Deployment", icon: "🐳", level: "advanced", time: "6 weeks", free: false, desc: "Writing Dockerfiles, containerizing frontend/backend applications. CI/CD pipelines via GitHub Actions. Deploying apps to AWS EC2, hosting assets on S3, SSL config.", resources: "Docker docs, AWS EC2 tutorials, Netlify/Vercel integrations" },
    ],
  },
  backend: {
    title: "Backend Software Architect Roadmap",
    duration: "6-8 months",
    jobRoles: ["Backend Engineer", "Systems Architect", "Database Developer", "API Engineer"],
    avgSalary: "6 - 22 LPA",
    steps: [
      { num: "01", title: "Core Backend Programming Language", icon: "💻", level: "beginner", time: "4 weeks", free: true, desc: "Master Node.js (JavaScript/TypeScript), Python (Django/FastAPI), Java (Spring Boot), or Go. Focus on memory management, async loop, OOP principles, and basic syntax.", resources: "Node.js guides, Go Tour, Spring Academy" },
      { num: "02", title: "Web Server & REST API Design", icon: "🔌", level: "beginner", time: "4 weeks", free: true, desc: "HTTP status codes, REST architecture rules, query vs path params, request body, headers, custom middleware, CORS handling, file uploading (Multer), API versioning.", resources: "MDN HTTP, Postman API Design books" },
      { num: "03", title: "Databases (Relational + NoSQL)", icon: "🗄️", level: "intermediate", time: "6 weeks", free: true, desc: "SQL: PostgreSQL/MySQL schema design, joins, index optimizations, ACID principles, transactions. NoSQL: MongoDB collections, document models, aggregations.", resources: "Use The Index Luke, MongoDB University" },
      { num: "04", title: "Caching, Sessions & Redis", icon: "⚡", level: "intermediate", time: "3 weeks", free: true, desc: "Implementing cache-aside pattern with Redis. Memory caching for database queries, session caching, rate limiting, and pub/sub mechanisms.", resources: "Redis University, Redis.io docs" },
      { num: "05", title: "API Security & Authentication", icon: "🔒", level: "intermediate", time: "4 weeks", free: true, desc: "Password hashing using bcrypt, JSON Web Token (JWT) signing & verification, refresh token rotation, OAuth2.0 social logins, Helmet security headers.", resources: "OWASP Cheat Sheet, JWT.io" },
      { num: "06", title: "Message Brokers & System Scaling", icon: "🐰", level: "advanced", time: "5 weeks", free: true, desc: "Event-driven architecture. Message queues like RabbitMQ or Apache Kafka. Microservices design, load balancers, rate limiters, database replication.", resources: "System Design Primer (GitHub), Kafka official guides" },
      { num: "07", title: "Containerization & Production Deployment", icon: "🐳", level: "advanced", time: "4 weeks", free: false, desc: "Dockerizing backend services, setting up Docker Compose, writing PM2 cluster scripts, configuring Nginx reverse proxy, and deploying to AWS EC2 or Heroku.", resources: "Docker guides, Nginx handbook, PM2 docs" },
    ],
  },
  frontend: {
    title: "Frontend UI/UX Architect Roadmap",
    duration: "5-7 months",
    jobRoles: ["Frontend Engineer", "UI Developer", "React Developer", "Client Systems SDE"],
    avgSalary: "5 - 18 LPA",
    steps: [
      { num: "01", title: "HTML5, Semantic Markup & Accessibility", icon: "🌐", level: "beginner", time: "2 weeks", free: true, desc: "Learn semantic tags, page structures, DOM nodes. Focus on accessibility standards (WCAG, ARIA labels, keyboard navigations).", resources: "MDN Web Accessibility, W3C guidelines" },
      { num: "02", title: "CSS3 Grid, Flexbox & Tailwind CSS", icon: "🎨", level: "beginner", time: "4 weeks", free: true, desc: "Box model, positions, transitions, flexbox layouts, grid layouts, responsive queries, and CSS variables. Utility-first styling with Tailwind CSS.", resources: "CSS-Tricks, Tailwind CSS docs, Flexbox Froggy" },
      { num: "03", title: "Advanced JavaScript & DOM API", icon: "⚡", level: "beginner", time: "5 weeks", free: true, desc: "Scope, closures, prototypes, event bubbling/capturing, fetch API, promises, async/await, ES6 modules, JSON structures, local storage, custom events.", resources: "JavaScript.info, Eloquent JavaScript, Frontend Masters" },
      { num: "04", title: "React.js Framework & Hooks", icon: "⚛️", level: "intermediate", time: "6 weeks", free: true, desc: "JSX, virtual DOM, component lifecycles, state and props, hooks (useState, useEffect, useRef, useMemo, useCallback), React Router config.", resources: "React.dev, Scrimba React Course" },
      { num: "05", title: "Global State Management & API Caching", icon: "📦", level: "intermediate", time: "4 weeks", free: true, desc: "Redux Toolkit, Zustand, Context API. Data fetching and automatic cache validation with TanStack Query (React Query) or Axios.", resources: "Redux Toolkit manuals, Zustand documentation, TanStack Query docs" },
      { num: "06", title: "Build Systems, Bundlers & Testing", icon: "🛠️", level: "advanced", time: "3 weeks", free: true, desc: "Vite, Webpack configurations, package.json scripts, linting with ESLint, code formatting with Prettier, unit testing with Jest and Testing Library.", resources: "Vite guides, Jest docs, React Testing Library docs" },
      { num: "07", title: "Performance Optimizations & Live Deploy", icon: "🚀", level: "advanced", time: "3 weeks", free: true, desc: "Code-splitting (React.lazy), lazy loading assets, image optimizations, bundle analyzers, SEO optimization, and deploying to Vercel/Netlify.", resources: "Lighthouse audits, Vercel docs" },
    ],
  },
  devops: {
    title: "DevOps & Cloud Reliability Engineer",
    duration: "8-10 months",
    jobRoles: ["DevOps Engineer", "Site Reliability Engineer (SRE)", "Infrastructure Developer"],
    avgSalary: "8 - 28 LPA",
    steps: [
      { num: "01", title: "Linux SysAdmin & Shell Scripting", icon: "🐧", level: "beginner", time: "4 weeks", free: true, desc: "Unix/Linux filesystems, terminal commands, permissions, package managers, network tools (ssh, curl, netstat), and scripting automated tasks with Bash.", resources: "Linux Journey (free), KodeKloud Linux path" },
      { num: "02", title: "Containerization (Docker Core)", icon: "🐳", level: "beginner", time: "4 weeks", free: true, desc: "Container concepts, writing Dockerfiles, image optimizations, multi-stage builds, container networks, data persistence with volumes, Docker Compose.", resources: "Docker Docs, freeCodeCamp Docker Course" },
      { num: "03", title: "Container Orchestration (Kubernetes)", icon: "☸️", level: "intermediate", time: "8 weeks", free: true, desc: "Kubernetes architecture. Pods, ReplicaSets, Deployments, Services (ClusterIP, NodePort, LoadBalancer), ConfigMaps, Secrets, Ingress, Helm Charts.", resources: "Kubernetes docs, KodeKloud CKA course" },
      { num: "04", title: "CI/CD Automations", icon: "🔄", level: "intermediate", time: "5 weeks", free: true, desc: "Automating builds, testing pipelines, and deployment scripts. Setting up pipelines in GitHub Actions, GitLab CI/CD, or Jenkins.", resources: "GitHub Actions documentation, DevOps Directive (YouTube)" },
      { num: "05", title: "Infrastructure as Code (IaC)", icon: "🏗️", level: "advanced", time: "5 weeks", free: true, desc: "Declarative infrastructure provisioning. Writing Terraform configurations, managing state files, provisioning AWS resources, using Ansible for config management.", resources: "HashiCorp Learn Terraform, Ansible docs" },
      { num: "06", title: "Monitoring, Alerting & Logging", icon: "📊", level: "advanced", time: "4 weeks", free: true, desc: "Monitoring resource metrics with Prometheus and building dashboards with Grafana. Log aggregations with Loki, EFK (Elasticsearch/Fluentd/Kibana).", resources: "Prometheus docs, Grafana tutorials" },
      { num: "07", title: "Cloud Administration (AWS/GCP)", icon: "☁️", level: "advanced", time: "5 weeks", free: false, desc: "Configuring Virtual Private Clouds (VPC), Security Groups, IAM roles, AWS EC2, S3 bucket security, Load balancers, Autoscaling groups, Route53.", resources: "AWS Certified Solutions Architect course" },
    ],
  },
  cybersecurity: {
    title: "Cybersecurity Analyst & Pentester Roadmap",
    duration: "8-12 months",
    jobRoles: ["Security Analyst", "Penetration Tester", "SOC Engineer", "Security Consultant"],
    avgSalary: "7 - 24 LPA",
    steps: [
      { num: "01", title: "Networking & OS Foundations", icon: "🌐", level: "beginner", time: "4 weeks", free: true, desc: "TCP/IP models, OSI layers, DNS, DHCP, subnets, routers, Wireshark packet capture analysis, Windows & Linux system commands, Active Directory.", resources: "CompTIA Network+ guides, Professor Messer (YouTube)" },
      { num: "02", title: "Security Core & Cryptography", icon: "🔒", level: "beginner", time: "4 weeks", free: true, desc: "Hashing (MD5, SHA), symmetric/asymmetric encryption, SSL/TLS handshakes, access control mechanisms (RBAC, ABAC), security governance.", resources: "CompTIA Security+ guides, Cybrary (free)" },
      { num: "03", title: "Vulnerability Scans & Web Security", icon: "🔍", level: "intermediate", time: "6 weeks", free: true, desc: "OWASP Top 10 Web vulnerabilities (SQL injection, XSS, CSRF, IDOR, broken auth). Port scanning with Nmap, scanning networks with Nessus.", resources: "PortSwigger Web Security Academy (free), OWASP resources" },
      { num: "04", title: "Defensive Security & SOC Operations", icon: "🛡️", level: "intermediate", time: "6 weeks", free: true, desc: "Security Operations Center protocols, SIEM tool analysis (Splunk, Wazuh), rule writing, intrusion analysis, incident response frameworks.", resources: "Splunk Free training, SOC Analyst paths on Cybrary" },
      { num: "05", title: "Offensive Security & Pen Testing", icon: "⚔️", level: "advanced", time: "8 weeks", free: true, desc: "Ethical hacking, target reconnaissance, exploitation frameworks (Metasploit, Burp Suite), reverse shells, privilege escalation on Windows/Linux.", resources: "TryHackMe (excellent labs), Hack The Box" },
      { num: "06", title: "Cloud Security & Compliance Frameworks", icon: "☁️", level: "advanced", time: "4 weeks", free: false, desc: "Cloud infrastructure hardening (AWS/Azure policy audits), IAM privilege audits, compliance guidelines: ISO 27001, SOC2, GDPR, HIPAA.", resources: "Cloud Security Alliance (CCSK), AWS Security guides" },
    ],
  },
  dataanalytics: {
    title: "Business Intelligence & Data Analyst",
    duration: "4-6 months",
    jobRoles: ["Data Analyst", "BI Developer", "Business Analyst", "Data Reporter"],
    avgSalary: "5 - 15 LPA",
    steps: [
      { num: "01", title: "Advanced Microsoft Excel Tools", icon: "📊", level: "beginner", time: "3 weeks", free: true, desc: "Pivot tables, conditional formatting, data sorting/filtering, VLOOKUP, XLOOKUP, INDEX/MATCH functions, charts, basic Power Query data cleaning.", resources: "Chandoo.org, ExcelJet, tutorials on YouTube" },
      { num: "02", title: "SQL Queries for Analysis", icon: "🗄️", level: "beginner", time: "4 weeks", free: true, desc: "Writing efficient data extraction queries: SELECT, JOINs, WHERE filters, GROUP BY, aggregations, Subqueries, Common Table Expressions (CTEs), Window functions.", resources: "Mode SQL tutorials, LeetCode SQL exercises" },
      { num: "03", title: "Data Analytics in Python (Pandas)", icon: "🐍", level: "intermediate", time: "4 weeks", free: true, desc: "Reading CSV/JSON files, cleaning data values, handling missing fields, slicing datasets with Pandas, plotting insights using Seaborn and Matplotlib.", resources: "Pandas official getting started, Kaggle Data Cleaning" },
      { num: "04", title: "Power BI or Tableau Dashboards", icon: "📈", level: "intermediate", time: "5 weeks", free: true, desc: "Data modeling, building relationships, writing calculated fields using DAX (Power BI) or Tableau calculations, publishing reports.", resources: "Microsoft Power BI training modules, Maven Analytics" },
      { num: "05", title: "Applied Business Statistics & A/B Tests", icon: "📐", level: "intermediate", time: "3 weeks", free: true, desc: "Probability distributions, correlation matrices, significance testing, z-tests, t-tests, calculating metric changes in A/B business test runs.", resources: "StatQuest statistics courses, Khan Academy Stats" },
      { num: "06", title: "Storytelling & Executive Reports", icon: "📝", level: "advanced", time: "2 weeks", free: true, desc: "Translating data insights into business actions. Communicating metrics, building slide decks, presenting findings to management.", resources: "Storytelling with Data (Cole Knaflic Book)" },
    ],
  },
  cloud: {
    title: "Cloud Infrastructure Architect Roadmap",
    duration: "6-9 months",
    jobRoles: ["Cloud Architect", "Cloud Systems Engineer", "AWS/Azure Developer"],
    avgSalary: "7 - 26 LPA",
    steps: [
      { num: "01", title: "Virtualization & Networking Basics", icon: "🌐", level: "beginner", time: "3 weeks", free: true, desc: "Virtual machines, hypervisors, standard TCP/IP networking, subnets, routing tables, DNS configurations, basic client-server structures.", resources: "CompTIA Network+ materials" },
      { num: "02", title: "Core Cloud Compute & Storage", icon: "☁️", level: "beginner", time: "6 weeks", free: true, desc: "AWS, Azure or GCP core. VM instances (EC2), Object storage (S3/Blob), Virtual Private Networks (VPC), IAM users, access policies, security groups.", resources: "AWS Certified Cloud Practitioner modules" },
      { num: "03", title: "Cloud Database Deployments", icon: "🗄️", level: "intermediate", time: "4 weeks", free: true, desc: "Configuring relational databases in cloud environments (AWS RDS, Aurora, Azure SQL), NoSQL database hosting, configuring connections safely.", resources: "AWS RDS guides, Cloud Academy labs" },
      { num: "04", title: "Cloud Routing, CDNs & Load Balancers", icon: "⚖️", level: "intermediate", time: "5 weeks", free: true, desc: "Elastic Load Balancer setup, Auto Scaling configurations, DNS Routing with Route53, and setting up Content Delivery Networks (CDNs) like CloudFront.", resources: "AWS Solutions Architect training paths" },
      { num: "05", title: "Serverless & Application Integrations", icon: "⚡", level: "advanced", time: "5 weeks", free: true, desc: "FaaS models: AWS Lambda or Azure Functions. API Gateway integration, Event-driven serverless architectures, DynamoDB triggers.", resources: "Serverless framework guides, AWS Lambda docs" },
      { num: "06", title: "Infrastructure as Code (IaC for Cloud)", icon: "🏗️", level: "advanced", time: "4 weeks", free: false, desc: "Provisioning cloud accounts automatically using Terraform or AWS CloudFormation templates, managing configurations via variables.", resources: "Terraform HashiCorp learn paths" },
    ],
  },
  appdev: {
    title: "Mobile Application Developer Roadmap",
    duration: "6-8 months",
    jobRoles: ["React Native Dev", "Flutter Engineer", "Android Dev", "iOS SDE"],
    avgSalary: "6 - 20 LPA",
    steps: [
      { num: "01", title: "Mobile UI Layouts & Components", icon: "📱", level: "beginner", time: "3 weeks", free: true, desc: "Mobile design patterns, device scaling, grid layouts, scroll views, lists, flexbox layout engine, Android Views/XML or Flutter widgets hierarchy.", resources: "React Native getting started guides, Flutter layout codelabs" },
      { num: "02", title: "Core Programming Language", icon: "💻", level: "beginner", time: "5 weeks", free: true, desc: "Master TypeScript/JS (for React Native), Dart (for Flutter), Kotlin (for Android Native), or Swift (for iOS). OOP principles, memory, threads.", resources: "Kotlin Lang tour, Swift Playgrounds, Dart tutorials" },
      { num: "03", title: "State Management & App Routing", icon: "🔄", level: "intermediate", time: "5 weeks", free: true, desc: "Managing global states in mobile applications. Redux Toolkit/Zustand in JS, Bloc/Provider patterns in Dart, React Navigation, GoRouter.", resources: "React Navigation guides, Flutter bloc documentation" },
      { num: "04", title: "Local Storage & API Integrations", icon: "🗄️", level: "intermediate", time: "4 weeks", free: true, desc: "Caching API data, fetch calls, offline databases using SQLite, SQLite wrappers (Room/Hive), encrypting storage keys, AsyncStorage.", resources: "Room Database tutorials, AsyncStorage guides" },
      { num: "05", title: "Native Feature Access & Hardware Keys", icon: "🔌", level: "advanced", time: "5 weeks", free: true, desc: "Accessing camera, geolocation APIs, push notifications, biometric face/touch authentication modules, Bluetooth integrations.", resources: "React Native Expo APIs, Flutter native plugins" },
      { num: "06", title: "App Packaging & Store Releases", icon: "🚀", level: "advanced", time: "4 weeks", free: false, desc: "Creating developer accounts, signing certificates, configuring Gradle/CocoaPods, generating release APKs/bundles, App Store guidelines.", resources: "Google Play Console manuals, Apple Developer portal" },
    ],
  },
  blockchain: {
    title: "Web3 & Blockchain Architect Roadmap",
    duration: "8-12 months",
    jobRoles: ["Blockchain Developer", "Smart Contract Auditor", "Solidity Engineer"],
    avgSalary: "9 - 30 LPA",
    steps: [
      { num: "01", title: "Blockchain Architecture Foundations", icon: "⛓️", level: "beginner", time: "4 weeks", free: true, desc: "Hash functions, public/private keys, P2P networks, blocks, mining, consensus mechanisms (Proof of Work, Proof of Stake).", resources: "Bitcoin Whitepaper, Blockchain Basics courses" },
      { num: "02", title: "Smart Contracts with Solidity", icon: "📜", level: "beginner", time: "6 weeks", free: true, desc: "Solidity programming syntax, state variables, mappings, memory vs storage modifiers, events, inheritance structures, writing token standards (ERC-20, ERC-721).", resources: "CryptoZombies game (free Solidity course), Solidity Docs" },
      { num: "03", title: "Smart Contract Testing Frameworks", icon: "🛠️", level: "intermediate", time: "5 weeks", free: true, desc: "Compiling and testing Solidity code locally using Hardhat or Foundry frameworks, writing unit tests in JavaScript or Solidity.", resources: "Hardhat tutorial, Foundry Book" },
      { num: "04", title: "Web3 Frontend DApp Integrations", icon: "🌐", level: "intermediate", time: "5 weeks", free: true, desc: "Connecting smart contracts to React application. Integrating MetaMask, querying contracts with Ethers.js or Web3.js, handling wallets.", resources: "Ethers.js documentation, Buildspace web3 tracks" },
      { num: "05", title: "Smart Contract Security Auditing", icon: "🔒", level: "advanced", time: "6 weeks", free: true, desc: "Detecting smart contract vulnerabilities (Reentrancy, overflow, front-running, signature replay), gas optimization rules.", resources: "ConsenSys Smart Contract Best Practices" },
      { num: "06", title: "Layer-2 Scaling & Token Ecosystems", icon: "🚀", level: "advanced", time: "6 weeks", free: false, desc: "Decentralized storage (IPFS), DeFi architectures, Layer-2 structures (Optimistic & ZK-Rollups, Arbitrum, Polygon networks).", resources: "Ethereum Developer Portal, IPFS docs" },
    ],
  },
  uiux: {
    title: "UI/UX Product Designer Roadmap",
    duration: "4-6 months",
    jobRoles: ["UI/UX Designer", "Product Designer", "User Researcher", "Interaction Designer"],
    avgSalary: "5 - 16 LPA",
    steps: [
      { num: "01", title: "Visual Design & UI Layout Rules", icon: "🎨", level: "beginner", time: "3 weeks", free: true, desc: "Typography scales, color hierarchy, contrast requirements, spacing grid systems, visual hierarchy, mobile-first guidelines.", resources: "Refactoring UI book, Material Design guides" },
      { num: "02", title: "Figma Tooling & Hi-Fi Prototyping", icon: "✏️", level: "beginner", time: "5 weeks", free: true, desc: "Figma tools: auto layouts, components, variants, interactive prototypes, micro-animations, variables, dev mode inspects.", resources: "Figma design academy (free), YouTube courses" },
      { num: "03", title: "UX Research Methods & User Testing", icon: "🔍", level: "intermediate", time: "4 weeks", free: true, desc: "User interviews, surveys, creating personas, mapping user journeys, empathy mapping, performing usability testing.", resources: "Nielsen Norman Group UX articles, Interaction Design Foundation" },
      { num: "04", title: "Information Architecture & User Flows", icon: "🏗️", level: "intermediate", time: "3 weeks", free: true, desc: "Structuring screen content logically. Sitemaps, user task flows, interactive nav options, search discoverability.", resources: "UX Collective case studies, CareerFoundry UIUX paths" },
      { num: "05", title: "Design Systems & Developer Hand-off", icon: "📦", level: "advanced", time: "3 weeks", free: true, desc: "Building scalable UI design systems. Card components, form inputs, button states, grid systems, exporting assets for frontend teams.", resources: "Design Systems handbook, Figma tutorials" },
    ],
  },
};

const DEFAULT_ROADMAP = {
  title: "Career Path Roadmap",
  duration: "6 months",
  jobRoles: ["Software Engineer", "Developer"],
  avgSalary: "5 - 15 LPA",
  steps: [
    { num: "01", title: "Core Programming Basics", icon: "💻", level: "beginner", time: "4 weeks", free: true, desc: "Learn variables, loops, conditionals, arrays, and functions in a language like Python, Java, or C++.", resources: "freeCodeCamp, W3Schools" },
    { num: "02", title: "Data Structures & OOP",  icon: "📦", level: "beginner", time: "6 weeks", free: true, desc: "Learn Classes, Objects, inheritance, lists, stacks, queues, and simple database keys.", resources: "GeeksforGeeks, LeetCode" },
    { num: "03", title: "REST APIs & Databases",   icon: "🔌", level: "intermediate", time: "4 weeks", free: true, desc: "Understand client-server architecture, JSON format, SQL database queries, and connecting back-end APIs.", resources: "W3Schools SQL, Postman docs" },
    { num: "04", title: "Build & Deploy Projects", icon: "🚀", level: "advanced", time: "4 weeks", free: true, desc: "Create a complete application (frontend + backend + DB) and host it live on Vercel or Render.", resources: "GitHub, Vercel docs" },
  ]
};

export default function Roadmap() {
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState("datascience");
  const [selectedDuration, setSelectedDuration] = useState("4-5");
  const pathData = ROADMAPS[selectedField] || DEFAULT_ROADMAP;

  // Adapt the step duration based on the selected timeline
  const getAdaptedStepTime = (originalTime, durationOption) => {
    const match = originalTime.match(/(\d+)\s*weeks?/);
    if (!match) return originalTime;
    const weeks = parseInt(match[1]);
    
    if (durationOption === "1-2") {
      // Sprint pacing: compress timeline
      const compressedWeeks = Math.max(1, Math.round((weeks / 4) * 10) / 10);
      return compressedWeeks === 1 ? "1 week" : `${compressedWeeks} weeks`;
    } else if (durationOption === "4-5") {
      // Standard/Balanced pacing
      const balancedWeeks = Math.max(1, Math.round((weeks / 1.6) * 10) / 10);
      return balancedWeeks === 1 ? "1 week" : `${balancedWeeks} weeks`;
    } else {
      // Mastery pacing (7-8 months)
      return originalTime;
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex items-start gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="p-3 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition text-gray-600 dark:text-gray-300 cursor-pointer flex-shrink-0 mt-1"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-base" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Career Roadmap</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Personalized week-by-week curriculum maps and learning resources for top career tracks.
            </p>
          </div>
        </div>

        {/* Path Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 bg-white dark:bg-[#111827]/70 p-3 rounded-3xl border border-gray-200 dark:border-gray-800/40 shadow-sm transition-all duration-200">
          {FIELDS.map((f) => {
            const active = selectedField === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedField(f.id)}
                className={`flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-xs font-bold transition justify-center sm:justify-start cursor-pointer ${
                  active
                    ? "bg-emerald-500 text-black shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* Duration Selection Toggle */}
        <div className="mb-10 bg-white dark:bg-[#111827]/70 p-5 rounded-3xl border border-gray-200 dark:border-gray-800/40 shadow-sm transition-all duration-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Learning Pacing Duration</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Adapt the time allocation to suit your availability. All tracks provide full detail and depth.</p>
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200/50 dark:border-gray-700 w-full md:w-auto">
              {[
                { id: "1-2", label: "1-2 Months", badge: "Sprint" },
                { id: "4-5", label: "4-5 Months", badge: "Moderate" },
                { id: "7-8", label: "7-8 Months", badge: "Mastery" }
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDuration(d.id)}
                  className={`flex-1 md:flex-initial text-center px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedDuration === d.id
                      ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Roadmap Statistics */}
        <div className="bg-gradient-to-r from-gray-900 to-green-950 text-white rounded-3xl p-6 md:p-8 flex flex-wrap justify-between gap-6 shadow-md mb-10 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-2">{pathData.title}</h3>
            <div className="flex gap-4 text-xs font-semibold text-gray-300 flex-wrap">
              <span className="flex items-center gap-1.5">
                <BsCalendar4Event /> Duration: {
                  selectedDuration === "1-2"
                    ? "1-2 Months (Sprint)"
                    : selectedDuration === "4-5"
                    ? "4-5 Months (Standard)"
                    : "7-8 Months (Mastery)"
                }
              </span>
              <span className="flex items-center gap-1.5">
                <BsPersonWorkspace /> Weekly Study: {
                  selectedDuration === "1-2"
                    ? "15-20 hours"
                    : selectedDuration === "4-5"
                    ? "8-10 hours"
                    : "4-6 hours"
                }
              </span>
              <span className="flex items-center gap-1.5">
                <BsCurrencyRupee /> Salary: {pathData.avgSalary}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-start sm:items-end">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Job Roles:</span>
            <div className="flex flex-wrap gap-1.5 mt-1 sm:justify-end">
              {pathData.jobRoles.map((role, idx) => (
                <span key={idx} className="bg-white/10 text-white text-[10px] px-2.5 py-1 rounded-md font-semibold">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Roadmap Timeline */}
        <div className="relative border-l-2 border-emerald-500/25 ml-4 sm:ml-8 space-y-12">
          {pathData.steps.map((step, idx) => {
            const adaptedTime = getAdaptedStepTime(step.time, selectedDuration);
            return (
              <div key={idx} className="relative pl-8 sm:pl-12 group">
                {/* Point Indicator */}
                <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-[3px] border-emerald-500 flex items-center justify-center font-bold text-[10px] text-emerald-700 dark:text-emerald-400 shadow-md group-hover:bg-emerald-500 group-hover:text-black transition duration-300">
                  {step.num || idx + 1}
                </div>

                {/* Step Card */}
                <div className="bg-white dark:bg-[#111827]/70 border border-gray-200 dark:border-gray-800/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl p-2 bg-green-50 dark:bg-emerald-950/20 text-green-700 dark:text-emerald-400 rounded-xl">{step.icon}</span>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 text-lg">{step.title}</h4>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 border rounded-full uppercase ${
                        step.level === "beginner"
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30"
                          : step.level === "intermediate"
                          ? "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/30"
                          : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30"
                      }`}>
                        {step.level}
                      </span>
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full uppercase tracking-wider">
                        {adaptedTime}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-4">{step.desc}</p>

                  {/* Pacing Advice Note to keep fully-detailed layout */}
                  <div className="mb-4 bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/40 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-gray-600 dark:text-gray-300">
                    <span className="text-sm">⏱️</span>
                    <div>
                      <p className="font-bold text-gray-700 dark:text-gray-200">Pacing Guide ({selectedDuration === "1-2" ? "Sprint" : selectedDuration === "4-5" ? "Steady" : "Comprehensive"}):</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                        {selectedDuration === "1-2"
                          ? `Complete this detailed module in ${adaptedTime} by studying 15-20 hours/week. Focus heavily on core syntax, cheat sheets, and practical application.`
                          : selectedDuration === "4-5"
                          ? `Complete in ${adaptedTime} by studying 8-10 hours/week. Balance theoretical understanding with building standard projects.`
                          : `Deep-dive for ${adaptedTime} by studying 4-6 hours/week. Read official documentation, explore optimizations, and build custom portfolios.`
                        }
                      </p>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2 justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold flex items-center gap-1.5">
                      <BsLink45Deg /> Top Resources: <strong className="text-gray-700 dark:text-gray-300 font-bold">{step.resources}</strong>
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      step.free ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20"
                    }`}>
                      {step.free ? "Free Source" : "Paid/Mixed"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
