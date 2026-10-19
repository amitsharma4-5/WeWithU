import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "motion/react";
import { BsLayers, BsCheckCircleFill, BsBuilding, BsCashStack, BsGeoAlt, BsSearch } from "react-icons/bs";

const CATEGORIES = [
  { id: "product", name: "Product-Based 🚀" },
  { id: "hardware", name: "Semiconductor & Hardware 💻" },
  { id: "service", name: "Consulting & Service-Based 🏢" },
  { id: "fintech", name: "FinTech Companies 💰" },
  { id: "ecommerce", name: "E-Commerce & Internet 🛒" },
  { id: "startup", name: "Startups & Unicorns 🦄" },
  { id: "cloud", name: "Data, AI & Cloud ☁️" },
  { id: "other", name: "Other Top Recruiters 🎯" },
];

const COMPANY_REGISTRY = {
  // Product-Based
  google: { name: "Google", fullName: "Google India", difficulty: "hard", package: "35 - 80 LPA", locations: ["Bangalore", "Hyderabad", "Mumbai"], type: "Product Based", techStack: ["DSA", "System Design", "Go/C++/Java", "Algorithms"], category: "product" },
  microsoft: { name: "Microsoft", fullName: "Microsoft India", difficulty: "hard", package: "25 - 60 LPA", locations: ["Hyderabad", "Bangalore", "Noida"], type: "Product Based", techStack: ["DSA", "OOP", "System Design", "C#/.NET"], category: "product" },
  amazon: { name: "Amazon", fullName: "Amazon Development Center", difficulty: "hard", package: "20 - 45 LPA", locations: ["Bangalore", "Hyderabad", "Chennai", "Pune"], type: "Product Based", techStack: ["DSA", "System Design", "Java/Python/C++", "Leadership Principles"], category: "product" },
  apple: { name: "Apple", fullName: "Apple India", difficulty: "hard", package: "30 - 70 LPA", locations: ["Bangalore", "Hyderabad"], type: "Product Based", techStack: ["C++", "OS Internals", "Data Structures", "Swift"], category: "product" },
  meta: { name: "Meta", fullName: "Meta Platforms Inc.", difficulty: "hard", package: "40 - 90 LPA", locations: ["Bangalore", "Gurugram"], type: "Product Based", techStack: ["Algorithms", "Scale System Design", "Python/C++", "Product Architecture"], category: "product" },
  netflix: { name: "Netflix", fullName: "Netflix India", difficulty: "hard", package: "50 - 100 LPA", locations: ["Mumbai", "Remote"], type: "Product Based", techStack: ["Java/Go", "Distributed Caching", "System Architecture", "Concurrency"], category: "product" },
  adobe: { name: "Adobe", fullName: "Adobe India", difficulty: "hard", package: "22 - 48 LPA", locations: ["Noida", "Bangalore"], type: "Product Based", techStack: ["C++", "Java", "DSA", "System Design", "Algorithms"], category: "product" },
  salesforce: { name: "Salesforce", fullName: "Salesforce India", difficulty: "hard", package: "20 - 42 LPA", locations: ["Hyderabad", "Bangalore"], type: "Product Based", techStack: ["Java", "Cloud Architecture", "Apex", "System Design"], category: "product" },
  oracle: { name: "Oracle", fullName: "Oracle India", difficulty: "medium", package: "12 - 28 LPA", locations: ["Bangalore", "Hyderabad", "Noida"], type: "Product Based", techStack: ["Java", "SQL", "Database Systems", "Cloud Infrastructure"], category: "product" },
  sap: { name: "SAP", fullName: "SAP Labs India", difficulty: "medium", package: "10 - 24 LPA", locations: ["Bangalore", "Pune", "Mumbai"], type: "Product Based", techStack: ["ABAP", "Java", "SQL", "ERP Architecture"], category: "product" },
  atlassian: { name: "Atlassian", fullName: "Atlassian India", difficulty: "hard", package: "25 - 55 LPA", locations: ["Bangalore", "Remote"], type: "Product Based", techStack: ["Java", "DSA", "System Design", "React", "Distributed Systems"], category: "product" },
  servicenow: { name: "ServiceNow", fullName: "ServiceNow India", difficulty: "hard", package: "18 - 38 LPA", locations: ["Hyderabad", "Bangalore"], type: "Product Based", techStack: ["JavaScript", "React", "Java", "System Design", "Cloud API"], category: "product" },
  intuit: { name: "Intuit", fullName: "Intuit India", difficulty: "hard", package: "22 - 45 LPA", locations: ["Bangalore"], type: "Product Based", techStack: ["Java", "DSA", "AWS", "Microservices", "System Design"], category: "product" },
  paypal: { name: "PayPal", fullName: "PayPal India", difficulty: "hard", package: "18 - 36 LPA", locations: ["Chennai", "Bangalore"], type: "Product Based", techStack: ["Java", "Node.js", "System Design", "Security Protocols"], category: "product" },
  uber: { name: "Uber", fullName: "Uber Technologies India", difficulty: "hard", package: "30 - 65 LPA", locations: ["Bangalore", "Hyderabad"], type: "Product Based", techStack: ["DSA", "Concurrency", "Kafka", "Distributed Systems", "Geohashing"], category: "product" },
  airbnb: { name: "Airbnb", fullName: "Airbnb India", difficulty: "hard", package: "28 - 60 LPA", locations: ["Bangalore", "Remote"], type: "Product Based", techStack: ["React", "Ruby on Rails", "Java", "System Design", "GraphQL"], category: "product" },
  linkedin: { name: "LinkedIn", fullName: "LinkedIn India", difficulty: "hard", package: "30 - 65 LPA", locations: ["Bangalore"], type: "Product Based", techStack: ["Java", "DSA", "System Design", "Kafka", "Data Pipelines"], category: "product" },
  dropbox: { name: "Dropbox", fullName: "Dropbox India", difficulty: "hard", package: "24 - 50 LPA", locations: ["Remote"], type: "Product Based", techStack: ["Go/Python", "DSA", "Distributed Systems", "Storage Architecture"], category: "product" },
  spotify: { name: "Spotify", fullName: "Spotify India", difficulty: "hard", package: "25 - 55 LPA", locations: ["Remote", "Mumbai"], type: "Product Based", techStack: ["Java/Python", "DSA", "System Design", "Audio Streaming Protocols"], category: "product" },
  cisco: { name: "Cisco", fullName: "Cisco Systems India", difficulty: "medium", package: "12 - 26 LPA", locations: ["Bangalore", "Pune"], type: "Product Based", techStack: ["Networking", "C/C++", "Python", "Operating Systems"], category: "product" },

  // Semiconductor
  nvidia: { name: "NVIDIA", fullName: "NVIDIA India", difficulty: "hard", package: "25 - 60 LPA", locations: ["Bangalore", "Pune", "Hyderabad"], type: "Semiconductor & Hardware", techStack: ["C/C++", "CUDA", "GPU Architecture", "OS Internals"], category: "hardware" },
  intel: { name: "Intel", fullName: "Intel India", difficulty: "medium", package: "12 - 28 LPA", locations: ["Bangalore", "Hyderabad"], type: "Semiconductor & Hardware", techStack: ["C/C++", "Verilog", "Embedded Systems", "Computer Architecture"], category: "hardware" },
  amd: { name: "AMD", fullName: "Advanced Micro Devices", difficulty: "medium", package: "14 - 30 LPA", locations: ["Bangalore", "Hyderabad"], type: "Semiconductor & Hardware", techStack: ["C/C++", "SystemVerilog", "ASIC Design", "Processor Core logic"], category: "hardware" },
  qualcomm: { name: "Qualcomm", fullName: "Qualcomm India", difficulty: "hard", package: "16 - 36 LPA", locations: ["Hyderabad", "Bangalore"], type: "Semiconductor & Hardware", techStack: ["C/C++", "RTOS", "LTE/5G stack", "Embedded Systems"], category: "hardware" },
  ti: { name: "Texas Instruments", fullName: "Texas Instruments India", difficulty: "hard", package: "15 - 32 LPA", locations: ["Bangalore"], type: "Semiconductor & Hardware", techStack: ["Analog Circuits", "C/C++", "Embedded C", "DSP Algorithms"], category: "hardware" },
  broadcom: { name: "Broadcom", fullName: "Broadcom India", difficulty: "hard", package: "20 - 45 LPA", locations: ["Bangalore"], type: "Semiconductor & Hardware", techStack: ["C/C++", "Networking Protocols", "ASIC", "Linux Kernels"], category: "hardware" },
  samsung: { name: "Samsung Electronics", fullName: "Samsung Electronics R&D", difficulty: "medium", package: "12 - 25 LPA", locations: ["Bangalore", "Noida"], type: "Semiconductor & Hardware", techStack: ["C/C++", "Java", "Data Structures", "Camera Algorithms"], category: "hardware" },
  micron: { name: "Micron Technology", fullName: "Micron Technology India", difficulty: "medium", package: "10 - 22 LPA", locations: ["Hyderabad", "Bangalore"], type: "Semiconductor & Hardware", techStack: ["Verilog", "C++", "Flash Memory Controller", "Firmware"], category: "hardware" },
  wd: { name: "Western Digital", fullName: "Western Digital India", difficulty: "medium", package: "11 - 24 LPA", locations: ["Bangalore"], type: "Semiconductor & Hardware", techStack: ["Embedded C", "Firmware", "Storage Drivers", "C++"], category: "hardware" },
  arm: { name: "Arm", fullName: "Arm India", difficulty: "hard", package: "18 - 40 LPA", locations: ["Bangalore", "Noida"], type: "Semiconductor & Hardware", techStack: ["Assembly Language", "C++", "RISC-V/Arm architecture", "Compilers"], category: "hardware" },

  // Consulting & Service-Based
  tcs: { name: "TCS", fullName: "Tata Consultancy Services", difficulty: "easy", package: "3.5 - 7 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", "Python", "SQL", "C++", "Data Structures"], category: "service" },
  infosys: { name: "Infosys", fullName: "Infosys Limited", difficulty: "easy", package: "3.6 - 8 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", "Python", "SQL", "Agile", "SDLC"], category: "service" },
  wipro: { name: "Wipro", fullName: "Wipro Limited", difficulty: "easy", package: "3.5 - 6.5 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", "Python", "C", "SQL", "Testing"], category: "service" },
  hcl: { name: "HCLTech", fullName: "HCL Technologies", difficulty: "easy", package: "3.5 - 7 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", ".NET", "C++", "IT Services"], category: "service" },
  techm: { name: "Tech Mahindra", fullName: "Tech Mahindra Limited", difficulty: "easy", package: "3.2 - 6.5 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Telecom", "Java", "SQL", "Testing"], category: "service" },
  accenture: { name: "Accenture", fullName: "Accenture India", difficulty: "easy", package: "4 - 8.5 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", ".NET", "Cloud Basics", "SQL", "Communication"], category: "service" },
  capgemini: { name: "Capgemini", fullName: "Capgemini India", difficulty: "easy", package: "3.8 - 7.5 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", "SQL", "Python", "Testing Services"], category: "service" },
  cognizant: { name: "Cognizant", fullName: "Cognizant Technology Solutions", difficulty: "easy", package: "4 - 8 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["SQL", "Python", "Java", "CS Fundamentals", "Automation"], category: "service" },
  ltimindtree: { name: "LTIMindtree", fullName: "LTI Mindtree Limited", difficulty: "easy", package: "4 - 8 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", "SQL", "HTML/CSS", "Python"], category: "service" },
  mphasis: { name: "Mphasis", fullName: "Mphasis Limited", difficulty: "easy", package: "3.2 - 6 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", "SQL", "Mainframe", "Cloud Support"], category: "service" },
  persistent: { name: "Persistent Systems", fullName: "Persistent Systems Limited", difficulty: "medium", package: "4.5 - 9 LPA", locations: ["Pune", "Bangalore", "Nagpur"], type: "Service Based", techStack: ["Java", "API Development", "React", "SQL"], category: "service" },
  hexaware: { name: "Hexaware", fullName: "Hexaware Technologies", difficulty: "easy", package: "3.5 - 6.5 LPA", locations: ["Mumbai", "Chennai", "Pune"], type: "Service Based", techStack: ["Java", "Python", "Automation Testing", "SQL"], category: "service" },
  birlasoft: { name: "Birlasoft", fullName: "Birlasoft Limited", difficulty: "easy", package: "3.5 - 6 LPA", locations: ["Noida", "Pune", "Bangalore"], type: "Service Based", techStack: ["SAP", "Java", "SQL", "ERP Integration"], category: "service" },
  zensar: { name: "Zensar", fullName: "Zensar Technologies", difficulty: "easy", package: "3.5 - 6 LPA", locations: ["Pune", "Hyderabad"], type: "Service Based", techStack: ["Java", "SQL", "Application Support", "HTML"], category: "service" },
  kpit: { name: "KPIT Technologies", fullName: "KPIT Technologies", difficulty: "medium", package: "4 - 8 LPA", locations: ["Pune", "Bangalore"], type: "Service Based", techStack: ["Automotive software", "Embedded C", "C++", "MATLAB"], category: "service" },

  // FinTech
  jpmorgan: { name: "JPMorgan Chase", fullName: "JPMorgan Chase & Co.", difficulty: "medium", package: "12 - 22 LPA", locations: ["Mumbai", "Bangalore", "Hyderabad"], type: "FinTech", techStack: ["Java", "Spring Boot", "SQL", "DSA", "Financial APIs"], category: "fintech" },
  goldman: { name: "Goldman Sachs", fullName: "Goldman Sachs India", difficulty: "hard", package: "22 - 45 LPA", locations: ["Bangalore", "Hyderabad"], type: "FinTech", techStack: ["DSA (Advanced)", "Java/C++", "Systems Architecture", "Math & Logic"], category: "fintech" },
  morganstanley: { name: "Morgan Stanley", fullName: "Morgan Stanley India", difficulty: "hard", package: "16 - 32 LPA", locations: ["Mumbai", "Bangalore"], type: "FinTech", techStack: ["Java/C++", "DSA", "Design Patterns", "SQL"], category: "fintech" },
  amex: { name: "American Express", fullName: "American Express India", difficulty: "medium", package: "12 - 25 LPA", locations: ["Gurugram", "Bangalore"], type: "FinTech", techStack: ["Java", "Python", "SQL", "Data Pipelines"], category: "fintech" },
  visa: { name: "Visa", fullName: "Visa India", difficulty: "hard", package: "18 - 38 LPA", locations: ["Bangalore"], type: "FinTech", techStack: ["Java", "Distributed Systems", "Cryptography", "API Gateway"], category: "fintech" },
  mastercard: { name: "Mastercard", fullName: "Mastercard India", difficulty: "hard", package: "16 - 35 LPA", locations: ["Pune", "Gurugram"], type: "FinTech", techStack: ["Java", "REST APIs", "System Design", "Payment Gateways"], category: "fintech" },
  paytm: { name: "Paytm", fullName: "One97 Communications", difficulty: "medium", package: "8 - 20 LPA", locations: ["Noida", "Bangalore"], type: "FinTech", techStack: ["Java/Node.js", "React", "Redis", "Kafka", "SQL"], category: "fintech" },
  phonepe: { name: "PhonePe", fullName: "PhonePe Private Limited", difficulty: "hard", package: "18 - 38 LPA", locations: ["Bangalore"], type: "FinTech", techStack: ["Java", "Distributed Systems", "Kafka", "MySQL", "Scalability"], category: "fintech" },
  razorpay: { name: "Razorpay", fullName: "Razorpay Software", difficulty: "hard", package: "15 - 32 LPA", locations: ["Bangalore"], type: "FinTech", techStack: ["PHP/Go", "React", "MySQL", "API Architecture"], category: "fintech" },
  groww: { name: "Groww", fullName: "Groww India", difficulty: "medium", package: "10 - 24 LPA", locations: ["Bangalore"], type: "FinTech", techStack: ["Java", "Spring Boot", "React Native", "PostgreSQL"], category: "fintech" },

  // E-Commerce
  flipkart: { name: "Flipkart", fullName: "Flipkart Internet", difficulty: "hard", package: "18 - 36 LPA", locations: ["Bangalore"], type: "E-Commerce", techStack: ["Java", "System Design", "DSA", "Distributed Systems", "Caching"], category: "ecommerce" },
  myntra: { name: "Myntra", fullName: "Myntra Designs", difficulty: "medium", package: "14 - 30 LPA", locations: ["Bangalore"], type: "E-Commerce", techStack: ["React", "Java", "Node.js", "Mobile Apps"], category: "ecommerce" },
  meesho: { name: "Meesho", fullName: "Meesho India", difficulty: "medium", package: "12 - 28 LPA", locations: ["Bangalore"], type: "E-Commerce", techStack: ["Java", "Go", "React", "Kafka", "Distributed Databases"], category: "ecommerce" },
  snapdeal: { name: "Snapdeal", fullName: "Snapdeal Limited", difficulty: "medium", package: "8 - 18 LPA", locations: ["Gurugram"], type: "E-Commerce", techStack: ["Java", "MySQL", "PHP", "Web optimization"], category: "ecommerce" },
  ebay: { name: "eBay", fullName: "eBay India R&D", difficulty: "hard", package: "18 - 35 LPA", locations: ["Bangalore"], type: "E-Commerce", techStack: ["Java", "Distributed Systems", "DSA", "Database scaling"], category: "ecommerce" },
  walmart: { name: "Walmart Global Tech", fullName: "Walmart Global Tech India", difficulty: "hard", package: "18 - 36 LPA", locations: ["Bangalore", "Chennai"], type: "E-Commerce", techStack: ["Java", "DSA", "System Design", "Cloud Architectures", "Kafka"], category: "ecommerce" },
  target: { name: "Target India", fullName: "Target Corporation India", difficulty: "medium", package: "11 - 24 LPA", locations: ["Bangalore"], type: "E-Commerce", techStack: ["Java", "Python", "SQL", "Supply Chain tech"], category: "ecommerce" },
  coupang: { name: "Coupang", fullName: "Coupang India", difficulty: "hard", package: "25 - 55 LPA", locations: ["Bangalore"], type: "E-Commerce", techStack: ["Java/Go", "Distributed Systems", "Hadoop", "Real-time pricing algorithms"], category: "ecommerce" },
  alibaba: { name: "Alibaba", fullName: "Alibaba Group India", difficulty: "hard", package: "25 - 50 LPA", locations: ["Mumbai", "Remote"], type: "E-Commerce", techStack: ["Java/Python", "DSA", "Cloud storage", "System Design"], category: "ecommerce" },
  booking: { name: "Booking.com", fullName: "Booking.com India", difficulty: "hard", package: "24 - 50 LPA", locations: ["Bangalore", "Remote"], type: "E-Commerce", techStack: ["Java/Perl/Python", "React", "MySQL", "High-concurrency APIs"], category: "ecommerce" },

  // Startups & Unicorns
  swiggy: { name: "Swiggy", fullName: "Bundl Technologies", difficulty: "hard", package: "16 - 36 LPA", locations: ["Bangalore"], type: "Startup", techStack: ["Go", "Java", "React", "Kafka", "Redis", "Geo-indexing"], category: "startup" },
  zomato: { name: "Zomato", fullName: "Zomato Limited", difficulty: "hard", package: "16 - 36 LPA", locations: ["Gurugram"], type: "Startup", techStack: ["Go", "Node.js", "React", "PHP", "MySQL", "Caching"], category: "startup" },
  zepto: { name: "Zepto", fullName: "KiranaKart Technologies", difficulty: "hard", package: "15 - 32 LPA", locations: ["Mumbai", "Bangalore"], type: "Startup", techStack: ["Node.js", "Go", "React Native", "PostgreSQL", "Location routing"], category: "startup" },
  cred: { name: "CRED", fullName: "Dreamplug Technologies", difficulty: "hard", package: "18 - 38 LPA", locations: ["Bangalore"], type: "Startup", techStack: ["Go", "React Native", "Distributed Systems", "PostgreSQL"], category: "startup" },
  coindcx: { name: "CoinDCX", fullName: "Neblio Technologies", difficulty: "medium", package: "10 - 24 LPA", locations: ["Mumbai"], type: "Startup", techStack: ["Node.js", "React", "Solidity", "Cryptography", "SQL"], category: "startup" },
  freshworks: { name: "Freshworks", fullName: "Freshworks India", difficulty: "medium", package: "10 - 25 LPA", locations: ["Chennai", "Bangalore"], type: "Startup", techStack: ["Ruby on Rails", "Java", "React", "AWS", "MySQL"], category: "startup" },
  browserstack: { name: "BrowserStack", fullName: "BrowserStack Labs", difficulty: "hard", package: "15 - 32 LPA", locations: ["Mumbai", "Remote"], type: "Startup", techStack: ["Ruby", "Node.js", "React", "Docker", "Puppeteer/Selenium"], category: "startup" },
  postman: { name: "Postman", fullName: "Postman India", difficulty: "hard", package: "18 - 40 LPA", locations: ["Bangalore", "Remote"], type: "Startup", techStack: ["Node.js", "React", "DSA", "API Design", "Docker"], category: "startup" },
  inmobi: { name: "InMobi", fullName: "InMobi Technology", difficulty: "hard", package: "16 - 35 LPA", locations: ["Bangalore"], type: "Startup", techStack: ["Java", "Spark", "Hadoop", "Ad-tech Algorithms"], category: "startup" },
  sharechat: { name: "ShareChat", fullName: "Mohalla Tech", difficulty: "hard", package: "18 - 42 LPA", locations: ["Bangalore"], type: "Startup", techStack: ["Go", "Node.js", "NoSQL", "Video Streaming architecture", "Redis"], category: "startup" },

  // Data & Cloud
  snowflake: { name: "Snowflake", fullName: "Snowflake India", difficulty: "hard", package: "25 - 60 LPA", locations: ["Pune", "Bangalore"], type: "Data & Cloud", techStack: ["C++", "Java", "Distributed Systems", "SQL compiler internals"], category: "cloud" },
  databricks: { name: "Databricks", fullName: "Databricks India", difficulty: "hard", package: "30 - 70 LPA", locations: ["Bangalore"], type: "Data & Cloud", techStack: ["Scala/Java", "C++", "Apache Spark", "Query optimization", "DSA"], category: "cloud" },
  openai: { name: "OpenAI", fullName: "OpenAI Inc.", difficulty: "hard", package: "80 - 200 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["Python", "PyTorch", "CUDA", "C++", "Large Language Models"], category: "cloud" },
  palantir: { name: "Palantir", fullName: "Palantir Technologies", difficulty: "hard", package: "30 - 75 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["Java", "TypeScript", "Distributed Systems", "Data analytics pipelines"], category: "cloud" },
  cloudflare: { name: "Cloudflare", fullName: "Cloudflare India", difficulty: "hard", package: "25 - 60 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["Rust/Go", "Linux kernel", "Networking (TCP/IP)", "DNS security"], category: "cloud" },
  elastic: { name: "Elastic", fullName: "Elastic NV", difficulty: "hard", package: "18 - 40 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["Java", "Lucene", "Elasticsearch", "Distributed search logic"], category: "cloud" },
  mongodb: { name: "MongoDB Inc.", fullName: "MongoDB India", difficulty: "hard", package: "20 - 45 LPA", locations: ["Gurugram", "Bangalore"], type: "Data & Cloud", techStack: ["C++", "Go", "Distributed consensus (Raft)", "Database engines"], category: "cloud" },
  redis: { name: "Redis", fullName: "Redis Labs India", difficulty: "hard", package: "20 - 45 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["C", "In-memory caching", "Distributed databases", "DSA"], category: "cloud" },
  hashicorp: { name: "HashiCorp", fullName: "HashiCorp India", difficulty: "hard", package: "22 - 50 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["Go", "Terraform/Vault", "Raft consensus", "Cloud deployments"], category: "cloud" },
  confluent: { name: "Confluent", fullName: "Confluent India", difficulty: "hard", package: "20 - 45 LPA", locations: ["Bangalore"], type: "Data & Cloud", techStack: ["Java/Scala", "Apache Kafka", "Stream Processing", "Distributed Systems"], category: "cloud" },

  // Other Top
  dell: { name: "Dell Technologies", fullName: "Dell India", difficulty: "medium", package: "8 - 18 LPA", locations: ["Bangalore"], type: "Other Top", techStack: ["C++", "Java", "Hardware firmware", "Linux"], category: "other" },
  hp: { name: "HP Inc.", fullName: "HP India", difficulty: "medium", package: "8 - 17 LPA", locations: ["Bangalore"], type: "Other Top", techStack: ["C++", "C#", "Embedded software", "Firmware"], category: "other" },
  ibm: { name: "IBM", fullName: "IBM India", difficulty: "medium", package: "7 - 16 LPA", locations: ["Bangalore", "Hyderabad", "Pune"], type: "Other Top", techStack: ["Java", "Python", "Cloud basics", "Cognitive computing"], category: "other" },
  siemens: { name: "Siemens", fullName: "Siemens Healthineers / Industry", difficulty: "medium", package: "6 - 15 LPA", locations: ["Bangalore", "Pune"], type: "Other Top", techStack: ["C++", "C#", "Embedded C", "IoT Systems"], category: "other" },
  bosch: { name: "Bosch", fullName: "Robert Bosch India", difficulty: "medium", package: "5 - 12 LPA", locations: ["Bangalore", "Coimbatore"], type: "Other Top", techStack: ["Automotive microcontrollers", "Embedded C", "MATLAB", "C++"], category: "other" },
  honeywell: { name: "Honeywell", fullName: "Honeywell India R&D", difficulty: "medium", package: "6 - 15 LPA", locations: ["Bangalore", "Hyderabad"], type: "Other Top", techStack: ["Embedded systems", "C++", "IoT API development", "Java"], category: "other" },
  ge: { name: "GE Aerospace", fullName: "GE Aerospace India R&D", difficulty: "medium", package: "8 - 18 LPA", locations: ["Bangalore"], type: "Other Top", techStack: ["Embedded Software", "C/C++", "Aerospace protocols", "Python"], category: "other" },
  zoho: { name: "Zoho Corporation", fullName: "Zoho Corporation Private Limited", difficulty: "medium", package: "6 - 15 LPA", locations: ["Chennai", "Tenkasi"], type: "Other Top", techStack: ["Java", "JavaScript", "SQL", "Application frameworks"], category: "other" },
  naukri: { name: "Naukri.com", fullName: "Info Edge India Limited", difficulty: "medium", package: "8 - 18 LPA", locations: ["Noida"], type: "Other Top", techStack: ["Java/Node.js", "React", "MongoDB/MySQL", "System caching"], category: "other" },
  yatra: { name: "Yatra.com", fullName: "Yatra Online Limited", difficulty: "medium", package: "6 - 14 LPA", locations: ["Gurugram"], type: "Other Top", techStack: ["Java", "MySQL", "Spring MVC", "Web performance"], category: "other" },
  makemytrip: { name: "MakeMyTrip", fullName: "MakeMyTrip India", difficulty: "medium", package: "10 - 24 LPA", locations: ["Gurugram", "Bangalore"], type: "Other Top", techStack: ["Java", "MySQL", "React", "Kafka", "Distributed transactions"], category: "other" },
  ola: { name: "Ola", fullName: "ANI Technologies", difficulty: "medium", package: "10 - 25 LPA", locations: ["Bangalore"], type: "Other Top", techStack: ["Java", "Node.js", "MySQL", "Map APIs", "Real-time dispatch logic"], category: "other" },
  redhat: { name: "Red Hat", fullName: "Red Hat India", difficulty: "hard", package: "14 - 32 LPA", locations: ["Bangalore", "Pune"], type: "Other Top", techStack: ["Go/Python", "Linux Kernel", "Kubernetes", "Ansible"], category: "other" },
  vmware: { name: "VMware", fullName: "VMware India", difficulty: "hard", package: "18 - 38 LPA", locations: ["Bangalore", "Pune"], type: "Other Top", techStack: ["Java/C++", "Virtualization layer", "Networking", "Distributed consensus"], category: "other" },
  github: { name: "GitHub", fullName: "GitHub India", difficulty: "hard", package: "25 - 60 LPA", locations: ["Remote"], type: "Other Top", techStack: ["Ruby on Rails", "Go", "React", "Git internals", "SQL"], category: "other" },
  twitter: { name: "Twitter (X)", fullName: "X Corp. / Twitter", difficulty: "hard", package: "25 - 60 LPA", locations: ["Bangalore", "Remote"], type: "Product Based", techStack: ["Scala", "Java", "System Design", "Distributed Systems", "React"], category: "product" },
  zoom: { name: "Zoom", fullName: "Zoom Video Communications", difficulty: "hard", package: "22 - 48 LPA", locations: ["Bangalore", "Remote"], type: "Product Based", techStack: ["C++", "WebRTC", "Video Streaming Protocols", "Java"], category: "product" },
  slack: { name: "Slack", fullName: "Slack Technologies", difficulty: "hard", package: "24 - 55 LPA", locations: ["Bangalore", "Remote"], type: "Product Based", techStack: ["Java/Go", "React", "System Design", "Electron"], category: "product" },
  dxc: { name: "DXC Technology", fullName: "DXC Technology India", difficulty: "easy", package: "3.4 - 6 LPA", locations: ["Pan India"], type: "Service Based", techStack: ["Java", "SQL", "Testing", "Cloud Fundamentals"], category: "service" },
  ltts: { name: "LTTS", fullName: "L&T Technology Services", difficulty: "medium", package: "4.5 - 9 LPA", locations: ["Bangalore", "Mumbai", "Pune"], type: "Service Based", techStack: ["Embedded C", "C++", "MATLAB", "IoT"], category: "service" },
  stripe: { name: "Stripe", fullName: "Stripe India", difficulty: "hard", package: "30 - 70 LPA", locations: ["Bangalore", "Remote"], type: "FinTech", techStack: ["Ruby", "Go", "Java", "System Design", "Payment APIs"], category: "fintech" },
  bharatpe: { name: "BharatPe", fullName: "Resilient Innovations (BharatPe)", difficulty: "medium", package: "10 - 22 LPA", locations: ["Delhi", "Bangalore"], type: "FinTech", techStack: ["Node.js", "React", "MySQL", "Fintech API"], category: "fintech" },
  nykaa: { name: "Nykaa", fullName: "FSN E-Commerce Ventures (Nykaa)", difficulty: "medium", package: "8 - 18 LPA", locations: ["Mumbai", "Bangalore"], type: "E-Commerce", techStack: ["React Native", "Node.js", "PHP", "MySQL"], category: "ecommerce" },
  oyo: { name: "Oyo Rooms", fullName: "Oyo Rooms (Oravel Stays)", difficulty: "medium", package: "10 - 22 LPA", locations: ["Gurugram", "Bangalore"], type: "Startup", techStack: ["Java", "Node.js", "React", "Microservices"], category: "startup" },
  blinkit: { name: "Blinkit", fullName: "Blink Commerce Private Limited", difficulty: "hard", package: "14 - 30 LPA", locations: ["Gurugram"], type: "Startup", techStack: ["Go", "Node.js", "React", "PostgreSQL", "GIS / Routing"], category: "startup" },
  urbancompany: { name: "Urban Company", fullName: "UrbanClap Technologies", difficulty: "medium", package: "12 - 26 LPA", locations: ["Gurugram", "Bangalore"], type: "Startup", techStack: ["Node.js", "React Native", "MongoDB", "Redis"], category: "startup" },
  huggingface: { name: "Hugging Face", fullName: "Hugging Face Inc.", difficulty: "hard", package: "40 - 120 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["Python", "PyTorch", "Transformers", "Rust", "Model Inference"], category: "cloud" },
  anthropic: { name: "Anthropic", fullName: "Anthropic PBC", difficulty: "hard", package: "70 - 180 LPA", locations: ["Remote"], type: "Data & Cloud", techStack: ["Python", "PyTorch", "LLM alignment", "Distributed systems"], category: "cloud" },
};

const CUSTOM_DETAILS = {
  tcs: {
    rounds: ["Aptitude Test (TCS NQT)", "Technical Interview", "HR Interview"],
    pattern: `TCS NQT has 4 sections:
1. Verbal Ability (24 questions, 30 mins)
2. Reasoning Ability (30 questions, 50 mins)
3. Numerical Ability (26 questions, 40 mins)
4. Programming Logic (10 questions, 20 mins)

Cutoff: Around 70-75% overall. No negative marking.
Coding section: 1-2 problems, easy to medium level.`,
    tips: [
      "Practice TCS NQT previous papers on PrepInsta",
      "Focus on time management — all sections are timed separately",
      "Coding questions are easy — even pseudocode logic helps",
      "HR round is mostly a formality — be confident and positive",
    ],
    interviewExperience: `"The technical round was mostly theory — OOP concepts, DBMS basics, OS concepts. They asked me to explain my final year project in detail. HR round was about why TCS, future goals, and relocation. The whole process took about 3 weeks."
— TCS Digital Trainee, 2024`,
    hiddenTips: ["TCS Digital pays better than TCS Ninja — apply for Digital if your NQT score is 80%+"]
  },
  infosys: {
    rounds: ["Online Assessment", "Technical Interview", "HR Interview"],
    pattern: `Infosys hiring process:
1. Online Test: Aptitude + Logical + Verbal (90 mins)
2. Pseudocode / Programming questions (30 mins)
3. Technical interview: CS fundamentals, project discussion
4. HR interview: behavioral questions, career goals`,
    tips: [
      "Infosys focuses heavily on aptitude — practice InfyTQ platform",
      "Complete InfyTQ certification — it directly affects your package",
      "Know OOPS, DBMS, OS concepts thoroughly",
      "They love asking about sorting algorithms and time complexity",
    ],
    interviewExperience: `"The online test was straightforward — mostly aptitude. Technical interview had questions on OOP, DBMS (normalization, joins), and my project. Got offer in 2 weeks."
— Infosys Systems Engineer, 2024`,
    hiddenTips: ["InfyTQ certified candidates get Systems Engineer role (better pay) vs Trainee"]
  },
  wipro: {
    rounds: ["AMCAT / Cocubes Test", "Technical Interview", "HR Interview"],
    pattern: `Wipro Elite / Turbo hiring:
1. Online Aptitude Test (AMCAT platform)
   - Quantitative, Logical, Verbal reasoning sections
   - Essay Writing (1 topic, 20 mins)
2. Wipro Coding Test (2 problems, 60 mins)
3. Technical + HR Interview (combined)`,
    tips: [
      "Essay writing is unique to Wipro — practice writing 200-250 word essays",
      "AMCAT test — focus on speed, not just accuracy",
      "Wipro Turbo requires medium level coding — practice LeetCode easy/medium",
    ],
    interviewExperience: `"AMCAT was time-pressured. Coding test had 2 easy problems. Technical interview was about Java OOP concepts. The interviewer asked to write a bubble sort program."
— Wipro Project Engineer, 2024`
  },
  amazon: {
    rounds: ["Online Assessment", "Technical Phone Screen", "4-5 Loop Interviews"],
    pattern: `Amazon SDE-1 Process:
1. Online Assessment (90 mins)
   - 2 Coding problems (Medium-Hard LeetCode)
   - Work Style Assessment + Work Simulation
2. Technical Phone Screen (1 hour)
3. Loop Interviews (4-5 rounds, same day)
   - Each round: 1 coding + behavioral (Leadership Principles)
   - Bar Raiser round included`,
    tips: [
      "Master Amazon Leadership Principles — all 16 of them, with STAR examples",
      "LeetCode: solve 150+ problems, focus on Medium/Hard difficulty",
      "Most asked patterns: two pointers, sliding window, trees, graphs, DP",
    ],
    interviewExperience: `"OA had 2 medium coding problems. Loop had 5 rounds — each started with a behavioral LP question then coding. The bar raiser round was tough. Connect your answers to Leadership Principles."
— Amazon SDE-1, Bangalore 2024`
  },
  google: {
    rounds: ["Resume Screen", "Online Assessment", "Phone Screen", "4-5 Onsite Interviews"],
    pattern: `Google SWE New Grad Process:
1. Resume Screen (very competitive — projects matter)
2. Online Coding Assessment (90 mins, 2 hard problems)
3. Technical Phone Screen (45-60 mins, 1-2 coding problems)
4. Onsite / Virtual Onsite (4-5 rounds)
   - Each round: 2 coding problems or 1 hard problem
   - 1 System Design round + 1 Behavioral round (Googleyness)`,
    tips: [
      "LeetCode Hard is the minimum bar — solve 300+ problems",
      "Google focuses on algorithms — dynamic programming, graphs, trees",
      "Practice explaining your thought process while coding",
    ],
    interviewExperience: `"Onsite had 4 rounds. The interviewers were very collaborative — they give hints if you're stuck. System design was for a distributed cache."
— Google SWE L3, Bangalore 2024`
  },
  microsoft: {
    rounds: ["Online Assessment", "Technical Interviews (3-4)", "HR Interview"],
    pattern: `Microsoft SDE-1 Process:
1. Online Assessment (HackerRank, 90 mins)
   - 2-3 coding problems (Medium level)
2. Technical Interviews (3-4 rounds)
   - Round 1-2: DSA problems (arrays, trees, graphs, DP)
   - Round 3: Design / OOP design problem
   - Round 4: Senior interviewer / AA round
3. HR Interview: Cultural fit, career goals`,
    tips: [
      "Microsoft OOP questions are important — design patterns, SOLID principles",
      "LeetCode Medium is the sweet spot — solve 200+ problems",
      "They love tree and graph problems — master BFS, DFS, Dijkstra",
    ],
    interviewExperience: `"OA had 3 medium problems. Technical rounds were 4 — first two DSA, third was design (design a URL shortener class structure), fourth was with a principal engineer."
— Microsoft SDE-1, Hyderabad 2024`
  }
};

const DIFFICULTY_CONFIG = {
  easy: { label: "Easy", color: "text-green-600 bg-green-50 border-green-200" },
  medium: { label: "Medium", color: "text-amber-600 bg-amber-50 border-amber-200" },
  hard: { label: "Hard", color: "text-red-600 bg-red-50 border-red-200" },
};

const COMPANY_DOMAINS = {
  google: "google.com",
  microsoft: "microsoft.com",
  amazon: "amazon.com",
  apple: "apple.com",
  meta: "meta.com",
  netflix: "netflix.com",
  adobe: "adobe.com",
  salesforce: "salesforce.com",
  oracle: "oracle.com",
  sap: "sap.com",
  atlassian: "atlassian.com",
  servicenow: "servicenow.com",
  intuit: "intuit.com",
  paypal: "paypal.com",
  uber: "uber.com",
  airbnb: "airbnb.com",
  linkedin: "linkedin.com",
  dropbox: "dropbox.com",
  spotify: "spotify.com",
  cisco: "cisco.com",
  nvidia: "nvidia.com",
  intel: "intel.com",
  amd: "amd.com",
  qualcomm: "qualcomm.com",
  ti: "ti.com",
  broadcom: "broadcom.com",
  samsung: "samsung.com",
  micron: "micron.com",
  wd: "westerndigital.com",
  arm: "arm.com",
  tcs: "tcs.com",
  infosys: "infosys.com",
  wipro: "wipro.com",
  hcl: "hcltech.com",
  techm: "techmahindra.com",
  accenture: "accenture.com",
  capgemini: "capgemini.com",
  cognizant: "cognizant.com",
  ltimindtree: "ltimindtree.com",
  mphasis: "mphasis.com",
  persistent: "persistent.com",
  hexaware: "hexaware.com",
  birlasoft: "birlasoft.com",
  zensar: "zensar.com",
  kpit: "kpit.com",
  jpmorgan: "jpmorganchase.com",
  goldman: "goldmansachs.com",
  morganstanley: "morganstanley.com",
  amex: "americanexpress.com",
  visa: "visa.com",
  mastercard: "mastercard.com",
  paytm: "paytm.com",
  phonepe: "phonepe.com",
  razorpay: "razorpay.com",
  groww: "groww.in",
  flipkart: "flipkart.com",
  myntra: "myntra.com",
  meesho: "meesho.com",
  snapdeal: "snapdeal.com",
  ebay: "ebay.com",
  walmart: "walmart.com",
  target: "target.com",
  coupang: "coupang.com",
  alibaba: "alibaba.com",
  booking: "booking.com",
  swiggy: "swiggy.in",
  zomato: "zomato.com",
  zepto: "zepto.cash",
  cred: "cred.club",
  coindcx: "coindcx.com",
  freshworks: "freshworks.com",
  browserstack: "browserstack.com",
  postman: "postman.com",
  inmobi: "inmobi.com",
  sharechat: "sharechat.com",
  snowflake: "snowflake.com",
  databricks: "databricks.com",
  openai: "openai.com",
  palantir: "palantir.com",
  cloudflare: "cloudflare.com",
  elastic: "elastic.co",
  mongodb: "mongodb.com",
  redis: "redis.com",
  hashicorp: "hashicorp.com",
  confluent: "confluent.io",
  dell: "dell.com",
  hp: "hp.com",
  ibm: "ibm.com",
  siemens: "siemens.com",
  bosch: "bosch.com",
  honeywell: "honeywell.com",
  ge: "ge.com",
  zoho: "zoho.com",
  naukri: "naukri.com",
  yatra: "yatra.com",
  makemytrip: "makemytrip.com",
  ola: "olacabs.com",
  redhat: "redhat.com",
  vmware: "vmware.com",
  github: "github.com",
  twitter: "twitter.com",
  zoom: "zoom.us",
  slack: "slack.com",
  dxc: "dxc.com",
  ltts: "ltts.com",
  stripe: "stripe.com",
  bharatpe: "bharatpe.com",
  nykaa: "nykaa.com",
  oyo: "oyorooms.com",
  blinkit: "blinkit.com",
  urbancompany: "urbancompany.com",
  huggingface: "huggingface.co",
  anthropic: "anthropic.com",
};

const LOGO_SLUGS = {
  google: "google",
  microsoft: "microsoft",
  amazon: "amazon",
  apple: "apple",
  meta: "meta",
  netflix: "netflix",
  adobe: "adobe",
  salesforce: "salesforce",
  oracle: "oracle",
  sap: "sap",
  atlassian: "atlassian",
  servicenow: "servicenow",
  intuit: "intuit",
  paypal: "paypal",
  uber: "uber",
  airbnb: "airbnb",
  linkedin: "linkedin",
  dropbox: "dropbox",
  spotify: "spotify",
  cisco: "cisco",
  nvidia: "nvidia",
  intel: "intel",
  amd: "amd",
  qualcomm: "qualcomm",
  ti: "texasinstruments",
  broadcom: "broadcom",
  samsung: "samsung",
  micron: "microntechnology",
  wd: "westerndigital",
  arm: "arm",
  tcs: "tataconsultancyservices",
  infosys: "infosys",
  wipro: "wipro",
  hcl: "hcl",
  techm: "techmahindra",
  accenture: "accenture",
  capgemini: "capgemini",
  cognizant: "cognizant",
  ltimindtree: "ltimindtree",
  mphasis: "mphasis",
  persistent: "persistentsystems",
  hexaware: "hexaware",
  birlasoft: "birlasoft",
  zensar: "zensartechnologies",
  kpit: "kpit",
  jpmorgan: "jpmorganchase",
  goldman: "goldmansachs",
  morganstanley: "morganstanley",
  amex: "americanexpress",
  visa: "visa",
  mastercard: "mastercard",
  paytm: "paytm",
  phonepe: "phonepe",
  razorpay: "razorpay",
  groww: "groww",
  flipkart: "flipkart",
  myntra: "myntra",
  meesho: "meesho",
  snapdeal: "snapdeal",
  ebay: "ebay",
  walmart: "walmart",
  target: "target",
  coupang: "coupang",
  alibaba: "alibaba",
  booking: "bookingdotcom",
  swiggy: "swiggy",
  zomato: "zomato",
  zepto: "zepto",
  cred: "cred",
  coindcx: "coindcx",
  freshworks: "freshworks",
  browserstack: "browserstack",
  postman: "postman",
  inmobi: "inmobi",
  sharechat: "sharechat",
  snowflake: "snowflake",
  databricks: "databricks",
  openai: "openai",
  palantir: "palantir",
  cloudflare: "cloudflare",
  elastic: "elastic",
  mongodb: "mongodb",
  redis: "redis",
  hashicorp: "hashicorp",
  confluent: "confluent",
  dell: "dell",
  hp: "hp",
  ibm: "ibm",
  siemens: "siemens",
  bosch: "bosch",
  honeywell: "honeywell",
  ge: "generalelectric",
  zoho: "zoho",
  naukri: "naukri",
  yatra: "yatra",
  makemytrip: "makemytrip",
  ola: "olacabs",
  redhat: "redhat",
  vmware: "vmware",
  github: "github",
  twitter: "x",
  zoom: "zoom",
  slack: "slack",
  dxc: "dxctechnology",
  ltts: "ltts",
  stripe: "stripe",
  bharatpe: "bharatpe",
  nykaa: "nykaa",
  oyo: "oyo",
  blinkit: "blinkit",
  urbancompany: "urbancompany",
  huggingface: "huggingface",
  anthropic: "anthropic"
};

function CompanyLogo({ id, size = 24 }) {
  const domain = COMPANY_DOMAINS[id] || `${id}.com`;
  const slug = LOGO_SLUGS[id];

  const isIndianOrOther = [
    "swiggy", "zomato", "zepto", "cred", "coindcx", "phonepe", "paytm", 
    "sharechat", "groww", "meesho", "myntra", "yatra", "makemytrip", 
    "ola", "ltimindtree", "birlasoft", "mphasis", "bharatpe", "nykaa", 
    "oyo", "blinkit", "urbancompany"
  ].includes(id);

  let initialSrc = `https://cdn.simpleicons.org/${slug || id}`;
  if (isIndianOrOther) {
    initialSrc = `https://logos.hunter.io/${domain}`;
  }

  const [imgSrc, setImgSrc] = useState(initialSrc);
  const [fallbackLevel, setFallbackLevel] = useState(0);

  useEffect(() => {
    let src = `https://cdn.simpleicons.org/${slug || id}`;
    if (isIndianOrOther) {
      src = `https://logos.hunter.io/${domain}`;
    }
    setImgSrc(src);
    setFallbackLevel(0);
  }, [id, domain, slug, isIndianOrOther]);

  const handleImageError = () => {
    if (fallbackLevel === 0) {
      if (isIndianOrOther) {
        setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
        setFallbackLevel(2);
      } else {
        setImgSrc(`https://logos.hunter.io/${domain}`);
        setFallbackLevel(1);
      }
    } else if (fallbackLevel === 1) {
      setImgSrc(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      setFallbackLevel(2);
    } else {
      setFallbackLevel(3);
    }
  };

  const colors = {
    google: "#4285F4", microsoft: "#00A4EF", amazon: "#FF9900", apple: "#555555", meta: "#0668E1", 
    netflix: "#E50914", adobe: "#FF0000", salesforce: "#00A1E0", oracle: "#F80000", sap: "#008FD3", 
    atlassian: "#0052CC", servicenow: "#293E40", intuit: "#0077C5", paypal: "#003087", uber: "#000000", 
    airbnb: "#FF5A5F", linkedin: "#0077B5", dropbox: "#007EE5", spotify: "#1ED760", cisco: "#1BA0D7",
    nvidia: "#76B900", intel: "#0071C5", amd: "#ED1C24", qualcomm: "#3253DC", ti: "#D00000", 
    broadcom: "#CC092F", samsung: "#0A47A9", micron: "#006699", wd: "#00529B", arm: "#0091BD",
    tcs: "#004B87", infosys: "#007CC2", wipro: "#7A3DA8", hcl: "#002F6C", techm: "#E41B13", 
    accenture: "#000000", capgemini: "#0070AD", cognizant: "#0033A0", ltimindtree: "#0F4C81", mphasis: "#F15A24", 
    persistent: "#EC1C24", hexaware: "#002D62", birlasoft: "#005596", zensar: "#E31E24", kpit: "#005F9E",
    jpmorgan: "#1C1714", goldman: "#7399C6", morganstanley: "#002F6C", amex: "#0070CD", visa: "#1A1F71", 
    mastercard: "#EB001B", paytm: "#002E6E", phonepe: "#5F259F", razorpay: "#0E6FFF", groww: "#00D09C",
    flipkart: "#2874F0", myntra: "#FF3F6C", meesho: "#F43397", snapdeal: "#E40046", ebay: "#E53238", 
    walmart: "#0071CE", target: "#CC0000", coupang: "#0076C2", alibaba: "#FF6600", booking: "#003580",
    swiggy: "#FC8019", zomato: "#CB202D", zepto: "#5C134F", cred: "#000000", coindcx: "#0D2E5C", 
    freshworks: "#0072C6", browserstack: "#2C3E50", postman: "#FF6C37", inmobi: "#4B0082", sharechat: "#FF4500",
    snowflake: "#29B6F6", databricks: "#FF3621", openai: "#000000", palantir: "#101112", cloudflare: "#F38020", 
    elastic: "#005571", mongodb: "#47A248", redis: "#D82C20", hashicorp: "#607D8B", confluent: "#00A6CA",
    dell: "#0076C2", hp: "#0096D6", ibm: "#006699", siemens: "#009999", bosch: "#E2001A", 
    honeywell: "#DE1E25", ge: "#005CA9", zoho: "#E31B23", naukri: "#2F5597", yatra: "#D00E17", 
    makemytrip: "#0066CC", ola: "#000000", redhat: "#EE0000", vmware: "#0095D3", github: "#181717"
  };

  const brandColor = colors[id] || "#3b82f6";
  const initials = id.slice(0, 2).toUpperCase();

  if (fallbackLevel < 3) {
    return (
      <div 
        className="rounded-xl flex items-center justify-center bg-white shadow-sm flex-shrink-0 border border-gray-100 p-1 overflow-hidden"
        style={{
          width: size * 1.5,
          height: size * 1.5,
          minWidth: size * 1.5
        }}
      >
        <img
          src={imgSrc}
          alt={`${id} logo`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
          }}
          onError={handleImageError}
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl flex items-center justify-center font-extrabold text-white tracking-tight shadow-md flex-shrink-0"
      style={{
        width: size * 1.5,
        height: size * 1.5,
        backgroundColor: brandColor,
        fontSize: size * 0.55,
        minWidth: size * 1.5
      }}
    >
      {initials}
    </div>
  );
}


function generateDynamicDetails(id, base) {
  const isProduct = base.type.includes("Product") || base.type.includes("Cloud") || base.type.includes("AI");
  const isService = base.type.includes("Service") || base.type.includes("Consulting");
  
  let rounds = [];
  let pattern = "";
  let tips = [];
  let interviewExperience = "";
  let hiddenTips = [];

  if (base.difficulty === "hard") {
    rounds = ["Online Assessment (120 mins)", "Technical Phone Screen", "System Design Round", "DSA Algorithm Loop (2-3 rounds)", "Managerial & Culture Fit"];
    pattern = `${base.name} recruitment pattern for Engineering roles:\n1. Online Coding Assessment (2-3 medium/hard problems on HackerRank/Codility)\n2. Technical Screen: deep dive into data structures and algorithm optimization\n3. System Design: scalability, database architecture, and caching strategies\n4. Behavioral interview focusing on cultural values and leadership principles.`;
    tips = [
      `Focus heavily on Leetcode Medium & Hard questions. Solve at least 150+ problems before the interview.`,
      `Practice explaining your thoughts and complexities while coding.`,
      `Be prepared for core system design concepts like load balancing, sharding, and latency optimization.`,
      `Demonstrate alignment with the company's core cultural guidelines in behavioral rounds.`
    ];
    interviewExperience = `"The coding assessment had 3 problems on graphs and dynamic programming. Technical rounds focused heavily on optimize solutions from O(N^2) to O(N log N). The System Design round asked me to scale a real-time messaging pipeline."\n— Software Engineer, ${base.locations[0] || "Bangalore"}`;
    hiddenTips = [`They prioritize candidates who write clean, modular code with appropriate exception handling.`];
  } else if (base.difficulty === "medium") {
    rounds = ["Aptitude & Technical OA", "DSA Live Coding (1-2 rounds)", "Project walkthrough & OOP Design", "HR Round"];
    pattern = `${base.name} recruitment pattern:\n1. Online Test: Aptitude, English, and basic SQL/Coding MCQs\n2. Coding Assessment: 2 programming questions (easy/medium level)\n3. Technical Interview: OOP concepts, database normalization, and project code reviews\n4. HR Discussion: behavioral questions, relocation, and salary expectations.`;
    tips = [
      `Practice standard DSA questions on arrays, strings, hash maps, and sorting algorithms.`,
      `Be ready to write clean SQL queries (especially Joins and Group By queries).`,
      `Know every line of code in your resume projects, including why you chose the tech stack.`,
      `Maintain clear communication and explain your approach before typing.`
    ];
    interviewExperience = `"The OA was balanced with aptitude and coding. Technical round asked me to implement string reversal and explain inheritance vs polymorphism. They reviewed my Github projects carefully."\n— SDE-1, ${base.locations[0] || "Bangalore"}`;
    hiddenTips = [`Showing strong problem-solving logic is valued more than getting the exact code syntax 100% correct.`];
  } else {
    // Easy
    rounds = ["Aptitude Assessment", "Technical Interview (CS fundamentals)", "HR Round"];
    pattern = `${base.name} recruitment pattern:\n1. Online Test: Verbal, Analytical Reasoning, and basic Pseudocode\n2. Technical Round: OOPS, DBMS, Operating Systems concepts, and resume walkthrough\n3. HR Round: General check on communication skills and adaptability.`;
    tips = [
      `Revise core computer science topics (OOPs, Normalization, Process scheduling, ACID properties).`,
      `Practice aptitude speed runs — time management is the main challenge.`,
      `Be confident, dress professionally, and communicate clearly.`,
      `Prepare a solid explanation for your projects.`
    ];
    interviewExperience = `"The process was highly organized. The written test had aptitude and logic questions. The interview was conversational, checking my basics of Java and SQL. HR round was very friendly."\n— Associate Developer, 2025`;
    hiddenTips = [`A high aptitude score in the initial test is key to securing an interview.`];
  }

  return {
    ...base,
    rounds,
    pattern,
    tips,
    interviewExperience,
    hiddenTips
  };
}

export default function CompanyPrep() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("product");
  const [selectedCompany, setSelectedCompany] = useState("tcs");
  const [activeTab, setActiveTab] = useState("overview");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    setSearchQuery("");
    // Auto-select first company in this category
    const firstCompany = Object.keys(COMPANY_REGISTRY).find(
      (key) => COMPANY_REGISTRY[key].category === catId
    );
    if (firstCompany) {
      setSelectedCompany(firstCompany);
    }
  };

  const getCompanyData = (id) => {
    const base = COMPANY_REGISTRY[id];
    if (!base) return null;
    if (CUSTOM_DETAILS[id]) {
      return { ...base, ...CUSTOM_DETAILS[id] };
    }
    return generateDynamicDetails(id, base);
  };

  const company = getCompanyData(selectedCompany);
  const diff = DIFFICULTY_CONFIG[company?.difficulty] || DIFFICULTY_CONFIG.easy;

  // Filter registry by category, difficulty and search query
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const filteredCompanyKeys = Object.keys(COMPANY_REGISTRY).filter((key) => {
    const item = COMPANY_REGISTRY[key];
    // Global search across all categories & difficulties if search query is active
    const matchesCategory = trimmedSearch ? true : item.category === selectedCategory;
    const matchesDifficulty = (trimmedSearch || filterDifficulty === "all") ? true : item.difficulty === filterDifficulty;
    const matchesSearch = !trimmedSearch || 
                          item.name.toLowerCase().includes(trimmedSearch) || 
                          item.fullName.toLowerCase().includes(trimmedSearch);
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const tabs = [
    { id: "overview",    label: "Overview",        icon: <BsLayers size={14} /> },
    { id: "pattern",     label: "Interview Pattern",icon: <BsLayers size={14} /> },
    { id: "tips",        label: "Tips & Strategy",  icon: <BsLayers size={14} /> },
    { id: "experience",  label: "Experience",       icon: <BsLayers size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f3f3f3] dark:bg-[#090d16] flex flex-col font-sans transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <button 
            onClick={() => navigate("/")} 
            className="p-3 rounded-full bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition text-gray-600 dark:text-gray-300 cursor-pointer flex-shrink-0 mt-1"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-base" />
          </button>
          <div>
            <span className="bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border dark:border-emerald-900/30">
              Preparation Guide
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Company Interview Manuals</h1>
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg mt-1">
              Official interview grids, tech stack listings, and expert preparation sheets for top recruiters.
            </p>
          </div>
        </div>

        {/* DSA Preparation Callout Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-green-600/10 to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/30 rounded-3xl p-5 md:p-6 mb-10 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <span className="text-3xl animate-bounce">🎯</span>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-base">Looking for Company-Specific DSA Coding Questions?</h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Practice exact coding problems asked in Google, Amazon, TCS, Microsoft, and more on CodeJeet.</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap justify-center flex-shrink-0">
            <a
              href="https://codejeet.com/companies"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white hover:text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-0.5 text-center whitespace-nowrap"
            >
              Solve DSA Questions ↗
            </a>
            <a
              href="https://dsa.apnacollege.in/google"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold py-2.5 px-6 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-md hover:-translate-y-0.5 text-center whitespace-nowrap"
            >
              Explore More ↗
            </a>
          </div>
        </div>

        {/* Curated DSA Preparation Sheets */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Curated DSA Preparation Sheets</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">Handpicked resources recommended by industry experts to master coding interviews.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Striver */}
            <div className="bg-white dark:bg-[#111827]/50 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
              <div>
                <span className="bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border dark:border-orange-900/20">
                  Top Recommended
                </span>
                <h4 className="font-extrabold text-gray-900 dark:text-white text-lg mt-3">Striver SDE Sheet</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 leading-relaxed">
                  A comprehensive selection of 180+ coding problems asked in top product companies. Master core DSA concepts systematically.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">180+ Problems</span>
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">SDE Roadmaps</span>
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">Video Solutions</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">takeuforward.org</span>
                <a
                  href="https://takeuforward.org/interviews/strivers-sde-sheet-top-coding-interview-problems/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white hover:text-white font-bold py-2 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center gap-1 hover:-translate-y-0.5 animate-pulse"
                >
                  Start Sheet ↗
                </a>
              </div>
            </div>

            {/* Card 2: NeetCode */}
            <div className="bg-white dark:bg-[#111827]/50 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
              <div>
                <span className="bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border dark:border-blue-900/20">
                  Highly Structured
                </span>
                <h4 className="font-extrabold text-gray-900 dark:text-white text-lg mt-3">NeetCode 150 Sheet</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 leading-relaxed">
                  A carefully organized list of 150 essential LeetCode questions categorized by pattern. Ideal for learning structural patterns.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">150 Questions</span>
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">Pattern-Based</span>
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">LeetCode Patterns</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">neetcode.io</span>
                <a
                  href="https://neetcode.io/practice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white hover:text-white font-bold py-2 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center gap-1 hover:-translate-y-0.5"
                >
                  Start Sheet ↗
                </a>
              </div>
            </div>

            {/* Card 3: Apna College */}
            <div className="bg-white dark:bg-[#111827]/50 border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
              <div>
                <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border dark:border-emerald-900/20">
                  Beginner Friendly
                </span>
                <h4 className="font-extrabold text-gray-900 dark:text-white text-lg mt-3">Apna College DSA Sheet</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 leading-relaxed">
                  Curated topic-wise questions built to lay a solid foundation in DSA. Perfect for college placements and service/product prep.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">Topic-wise Roadmap</span>
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">Placement Guided</span>
                  <span className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 text-[10px] px-2.5 py-0.5 rounded-md font-medium">Video Theory</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">dsa.apnacollege.in</span>
                <a
                  href="https://dsa.apnacollege.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white hover:text-white font-bold py-2 px-4 rounded-xl text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow flex items-center gap-1 hover:-translate-y-0.5"
                >
                  Start Sheet ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Category horizontal scroll switcher */}
        <div className="mb-8 space-y-2">
          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Browse by Sectors</h4>
          <div className="flex gap-2 bg-white dark:bg-slate-900/50 p-2 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-x-auto select-none no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`py-2.5 px-5 rounded-xl text-xs md:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-black dark:bg-emerald-600 text-white"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Difficulty Filter */}
          <div className="flex gap-2 flex-wrap">
            {["all", "easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setFilterDifficulty(d)}
                className={`px-4 py-2 rounded-full text-xs font-bold capitalize border transition cursor-pointer ${
                  filterDifficulty === d
                    ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {d === "all" ? "All Difficulties" : d}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <BsSearch className="absolute left-3 top-3.5 text-gray-400 text-xs" />
          </div>
        </div>

        {filteredCompanyKeys.length === 0 ? (
          <div className="bg-white dark:bg-[#111827]/50 border border-gray-200 dark:border-gray-800 rounded-3xl p-12 text-center text-gray-500 dark:text-gray-400 mb-10">
            No matching companies found. Try adjusting your search query or difficulty filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {filteredCompanyKeys.map((key) => {
              const item = COMPANY_REGISTRY[key];
              const d = DIFFICULTY_CONFIG[item.difficulty];
              const active = selectedCompany === key;

              return (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedCompany(key);
                    setSelectedCategory(item.category);
                    setSearchQuery("");
                    setActiveTab("overview");
                  }}
                  className={`bg-white dark:bg-[#111827]/50 border rounded-3xl p-6 cursor-pointer hover:-translate-y-1 hover:shadow-md transition duration-300 ${
                    active ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-gray-200 dark:border-gray-800 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <CompanyLogo id={key} size={24} />
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{item.name}</h4>
                      <p className="text-gray-400 dark:text-gray-500 text-[10px] font-semibold uppercase">{item.type}</p>
                    </div>
                  </div>

                  <div className={`text-[9px] font-bold px-2.5 py-1 rounded-full border inline-block mb-3 ${d.color}`}>
                    {item.difficulty.toUpperCase()} DIFFICULTY
                  </div>

                  <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-gray-400 border-t border-gray-50 dark:border-gray-800 pt-3">
                    <span className="flex items-center gap-1"><BsCashStack /> {item.package}</span>
                    {active && <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><BsCheckCircleFill /> Active</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Company Details Card */}
        {company && (
          <div className="bg-white dark:bg-[#111827]/50 border border-gray-200 dark:border-gray-800 rounded-3xl shadow-sm overflow-hidden">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-gray-900 to-green-950 text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <CompanyLogo id={selectedCompany} size={32} />
                <div>
                  <h3 className="text-2xl font-bold">{company.fullName}</h3>
                  <div className="flex gap-4 text-xs font-semibold text-gray-300 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1"><BsCashStack /> {company.package}</span>
                    <span className="flex items-center gap-1"><BsGeoAlt /> {company.locations.join(", ")}</span>
                    <span className="flex items-center gap-1"><BsBuilding /> {company.type}</span>
                  </div>
                </div>
              </div>

              <div className={`text-xs font-bold px-3 py-1.5 border rounded-full self-start md:self-center capitalize ${diff.color}`}>
                {company.difficulty} Difficulty
              </div>
            </div>

            {/* Inner tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-900/30 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-bold border-b-2 transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "border-emerald-500 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#111827]"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-8">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Tech stack */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5">
                      Target Tech Stack & Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {company.techStack.map((tech, i) => (
                        <span key={i} className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 text-xs px-3 py-1.5 rounded-lg font-semibold border border-gray-200 dark:border-gray-750">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
 
                  {/* Rounds */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                      Interview Rounds Hierarchy
                    </h4>
                    <div className="relative border-l border-gray-200 dark:border-gray-800 ml-4 space-y-6">
                      {company.rounds.map((round, i) => (
                        <div key={i} className="relative pl-6">
                          <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-green-50 dark:bg-emerald-950/20 border-2 border-green-500 text-green-700 dark:text-green-400 font-bold text-xs flex items-center justify-center">
                            {i + 1}
                          </span>
                          <h5 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{round}</h5>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pattern" && (
                <div className="bg-gray-50 dark:bg-slate-900/30 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 md:p-6">
                  <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                    📋 Exam Pattern Description
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                    {company.pattern}
                  </p>
                </div>
              )}

              {activeTab === "tips" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                      Actionable Strategies
                    </h4>
                    <ul className="space-y-3">
                      {company.tips.map((tip, i) => (
                        <li key={i} className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          <span className="text-green-500 font-bold">✓</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {company.hiddenTips && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-5">
                      <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-2 flex items-center gap-2">
                        <span>💡</span> Pro tip / Insider details
                      </h4>
                      <ul className="list-disc list-inside text-xs text-amber-900/80 dark:text-amber-300/80 space-y-2">
                        {company.hiddenTips.map((ht, i) => <li key={i}>{ht}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "experience" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3.5">
                      Student Interview Archive
                    </h4>
                    <blockquote className="bg-gray-50 dark:bg-slate-900/30 border-l-4 border-green-500 text-gray-600 dark:text-gray-300 italic text-sm p-4 rounded-r-xl leading-relaxed whitespace-pre-line">
                      {company.interviewExperience}
                    </blockquote>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
