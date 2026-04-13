// knowledge/rutvik.ts — Updated with full resume data from both documents

export interface KnowledgeChunk {
  id: string;
  category: string;
  text: string;
}

export const knowledgeChunks: KnowledgeChunk[] = [
  {
    id: 'identity',
    category: 'personal',
    text: `Rutvik Jani is a skilled Full-Stack Software Developer and MSc Artificial Intelligence candidate at Heriot-Watt University, Edinburgh, UK. He has 3+ years of professional experience building scalable web applications and AI-powered systems. He is based in Ahmedabad, India and open to relocation anywhere in the UK and internationally. Contact: rutvikjani22@gmail.com | +91 7046339385 | +44 7352 697022. LinkedIn: linkedin.com/in/rutvik-jani-042956227. GitHub: github.com/rutvikjani.`,
  },
  {
    id: 'summary',
    category: 'professional_summary',
    text: `Rutvik Jani is a skilled web developer with a passion for designing and building scalable, high-performance, user-friendly web applications. Adept at developing robust backend systems and RESTful APIs using Node.js, Nest.js, and Express.js. Experienced in API testing and debugging using Postman. Also an MSc AI candidate with hands-on experience in LLM integration, RAG pipelines, ML model development, and feature engineering.`,
  },
  {
    id: 'education_msc',
    category: 'education',
    text: `Rutvik Jani is currently pursuing an MSc in Artificial Intelligence at Heriot-Watt University in Edinburgh, UK, starting January 2026. His MSc focuses on Big Data, Semantic Web, and Knowledge Graphs.`,
  },
  {
    id: 'education_bsc',
    category: 'education',
    text: `Rutvik Jani completed his Bachelor of Computer Science and Engineering from Vidush Somany Institute of Technology and Research in Gandhinagar, India, from September 2020 to June 2023.`,
  },
  {
    id: 'education_diploma',
    category: 'education',
    text: `Rutvik Jani completed a Diploma in Computer Science and Engineering from Mewad University in Chittorgarh, India, from July 2016 to July 2019. This was the foundation of his computing education.`,
  },
  {
    id: 'skills_frontend',
    category: 'skills',
    text: `Rutvik Jani's frontend skills: React.js, JavaScript, TypeScript, HTML5, CSS3. He built production UIs for ERP, CRM, and asset management platforms at VMukti Solutions as part of full MERN stack development.`,
  },
  {
    id: 'skills_backend',
    category: 'skills',
    text: `Rutvik Jani's backend skills: Node.js, Nest.js, Express.js, FastAPI, RESTful API design. Deep experience in server-side architecture, middleware, routing, and nodemedia-server integration for video streaming. He built scalable backend services at both VMukti Solutions and Adiance Technologies.`,
  },
  {
    id: 'skills_database',
    category: 'skills',
    text: `Rutvik Jani's database skills: MongoDB, PostgreSQL, SQL Server (MS SQL), Redis, data modelling. He holds an MS SQL Developer Certification from Intellipaat (September 2024). He has optimised database schemas and queries in production systems.`,
  },
  {
    id: 'skills_ai_llm',
    category: 'skills',
    text: `Rutvik Jani's AI and LLM skills: RAG (Retrieval-Augmented Generation), FAISS Vector Search, GPT integration, Llama integration, NLP. He built a production RAG pipeline for an AI Voice Support System and integrated GPT-based AI features into a Video Management System (VMS) at Adiance Technologies.`,
  },
  {
    id: 'skills_ml',
    category: 'skills',
    text: `Rutvik Jani's machine learning skills: Regression, Classification, Clustering, Hidden Markov Models, model evaluation, Python, Pandas, NumPy, Matplotlib, Seaborn, feature engineering. He holds an Executive PG Certification in Data Science and AI from Intellipaat (April 2025).`,
  },
  {
    id: 'skills_tools',
    category: 'skills',
    text: `Rutvik Jani's tools: Git, GitHub, Postman (API testing), Docker, WebRTC, nodemedia-server. He is comfortable with best practices including modular coding, version control, and performance optimisation.`,
  },
  {
    id: 'experience_vmukti',
    category: 'experience',
    text: `Rutvik Jani works as a Software Developer at VMukti Solutions in Ahmedabad, India from May 2025 to present. He does full-stack MERN development. Key projects: (1) Designed and delivered a comprehensive ERP platform to streamline internal business processes. (2) Built and integrated a CRM module for the marketing team — improving lead tracking, campaign management, and customer engagement. (3) Developed an IT Asset Management module to track hardware and software resources. (4) Implemented a Role-Based Access Control (RBAC) system for secure, granular user access. (5) Managed both React.js frontend and Node.js/Nest.js backend with seamless integration.`,
  },
  {
    id: 'experience_adiance',
    category: 'experience',
    text: `Rutvik Jani worked as a Junior Software Developer at Adiance Technologies in Ahmedabad, India from November 2023 to April 2025. Key work: (1) Diagnosed and resolved critical bugs in media server systems, improving streaming reliability. (2) Integrated AI-powered architecture (GPT-based models) into a Video Management System (VMS) for video analytics, intelligent search, and anomaly detection. (3) Modernised legacy workflows and software. (4) Managed full-stack responsibilities including nodemedia-server integration and database operations.`,
  },
  {
    id: 'experience_thirdrock',
    category: 'experience',
    text: `Rutvik Jani completed an internship at Third Rock Techkno LLP in Ahmedabad, India from January 2023 to June 2023. He deepened his understanding of the MERN stack, worked on an e-commerce website, a To-Do List app, and RESTful APIs, and learned HTML, CSS, JavaScript, and modern web development practices.`,
  },
  {
    id: 'project_erp_crm',
    category: 'projects',
    text: `Rutvik Jani built an Enterprise ERP and CRM platform at VMukti Solutions using React.js, Node.js, Nest.js, and PostgreSQL. The ERP streamlined internal business processes; the CRM module improved marketing lead tracking and campaign management. He managed full-stack frontend and backend development.`,
  },
  {
    id: 'project_asset_rbac',
    category: 'projects',
    text: `Rutvik Jani developed an IT Asset Management System at VMukti Solutions using React.js, Node.js, and MongoDB with Role-Based Access Control (RBAC). The system tracks, monitors, and maintains organisational hardware and software resources with secure, granular role-based access.`,
  },
  {
    id: 'project_ai_vms',
    category: 'projects',
    text: `Rutvik Jani integrated GPT-based AI into a Video Management System (VMS) at Adiance Technologies using Node.js, GPT API, and nodemedia-server. Enabled advanced video analytics, intelligent search, and automated anomaly detection. Also modernised legacy streaming infrastructure significantly improving reliability.`,
  },
  {
    id: 'project_voice',
    category: 'projects',
    text: `Rutvik Jani developed an AI Voice Support System using Python, Llama, RAG, and WebRTC. Real-time voice transcription with LLM-based responses. Designed a RAG pipeline to improve accuracy and contextual understanding by grounding responses in a structured knowledge base.`,
  },
  {
    id: 'project_financial',
    category: 'projects',
    text: `Rutvik Jani built a Financial Regime Detection model using Python, hmmlearn, and yfinance. Used Hidden Markov Models (HMMs) to classify financial market states from price and sentiment time-series features. Evaluated performance using log-likelihood scoring and state-transition analysis.`,
  },
  {
    id: 'project_face',
    category: 'projects',
    text: `Rutvik Jani built a One-Shot Face Recognition System using Python and FAISS for vector similarity search on face embeddings. Reduced inference latency by up to 15 seconds through edge-based processing optimisations.`,
  },
  {
    id: 'certifications',
    category: 'certifications',
    text: `Rutvik Jani holds three certifications: (1) Executive PG Certification in Data Science & AI — Intellipaat, April 2025. (2) MS SQL Developer Course — Intellipaat, September 2024. (3) Python for Data Science, AI & Development — Coursera, March 2023.`,
  },
  {
    id: 'availability',
    category: 'availability',
    text: `Rutvik Jani is open to opportunities — full-time software engineering roles, AI engineering positions, full-stack MERN development, research collaborations, and freelance projects. He is open to relocation anywhere in the UK and internationally. Contact: rutvikjani22@gmail.com | +91 7046339385.`,
  },
  {
    id: 'why_hire',
    category: 'value_proposition',
    text: `Rutvik Jani is a strong hire: 3+ years of production software engineering, strong full-stack MERN skills, proven AI integration experience (GPT into VMS, RAG pipelines, face recognition), an MSc AI from Heriot-Watt University, and three professional certifications. He bridges web development and AI — practical, pragmatic, and comfortable across React, Node.js, Nest.js, databases, and Python ML pipelines.`,
  },
];
