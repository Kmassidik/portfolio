export interface Project {
  name: string;
  date?: string;
  blurb: string;
  points?: string[];
  tech: string[];
  link?: string;
  github?: string;
}

/** Lead work — the AI platforms, newest first. */
export const featured: Project[] = [
  {
    name: "Glicc AI",
    date: "Jun 2026",
    blurb:
      "AI-powered education platform that turns a single PDF, DOCX, or PowerPoint into assignments, exams, and learning materials — cutting lesson prep time by up to 90%.",
    points: [
      "Document-understanding pipeline that converts uploaded teaching material into ready-to-use assessments, with generated answer keys, correctness scoring, and customizable question styles.",
      "Integrated classroom management for teachers, students, assignments, and classes — including AI-assisted grading, barcode-based reward redemption, and real-time class group communication.",
    ],
    tech: ["AI/LLM", "Document AI", "Full Stack"],
  },
  {
    name: "Mirai AI",
    date: "May 2026",
    blurb:
      "Production BI copilot that converts natural-language questions into audited, read-only SQL, returning generated insights, charts, and tables.",
    points: [
      "Go multi-agent LLM orchestration with text-to-SQL, schema introspection, memory, analytics, and SSE streaming.",
      "PII-safe processing using GLiNER, HMAC tokenization, an AES-256-GCM credential vault, and immutable audit logging for enterprise deployment.",
    ],
    tech: ["Go", "LLM Agents", "Text-to-SQL", "SSE", "PII Detection"],
  },
  {
    name: "Palapa AI",
    date: "Dec 2025",
    blurb:
      "Multi-tenant AI CRM SaaS that lets businesses deploy customer-service agents across WhatsApp, WhatsApp Business, Telegram, and Email, with subscription management and tenant-specific RAG knowledge bases.",
    points: [
      "End-to-end RAG pipeline plus a Go-based AI database middleware with schema introspection, secure tool calling, and MCP integration.",
      "8-service polyglot microservices platform (Go, Python, Node.js, React) with Redis-backed LLM message queuing, human-escalation workflows, automated ticketing, and multi-tenant deployment.",
    ],
    tech: ["Go", "Python", "Node.js", "React", "RAG", "MCP", "Redis"],
    link: "https://palapa.in",
  },
  {
    name: "Socai AI",
    date: "Aug 2025",
    blurb:
      "Production AI digital twin platform for public and commercial interaction, built on a scalable Next.js, Python, and Supabase architecture.",
    points: [
      "AI-powered multimedia generation: image generation (LoRA/OpenAI), video lip-sync, and multiple TTS models.",
      "Secure platform with integrated authentication, media processing pipelines, and active users.",
    ],
    tech: ["Next.js", "Python", "Supabase", "OpenAI", "TTS"],
    link: "https://socai.id",
  },
];

/** Everything before the AI work. */
export const earlier: Project[] = [
  {
    name: "Bus Track Command",
    blurb:
      "Proof-of-concept system automating bus announcements: a React + Zustand dashboard, Golang + PostgreSQL backend, and a Raspberry Pi MQTT client, with ElevenLabs voice generation deployed via Docker.",
    tech: ["React", "Zustand", "Golang", "PostgreSQL", "MQTT", "Docker"],
  },
  {
    name: "Code Scanner",
    blurb:
      "Proof-of-concept security tool providing AI-powered static analysis to detect vulnerabilities in real time and enforce best practices before deployment.",
    tech: ["Next.js", "Zustand"],
    link: "https://code.dalang.io",
  },
  {
    name: "Dalang.io",
    blurb:
      "Full web product showcase — landing and product pages built in Svelte, with Xendit payments and Supabase for data and auth.",
    tech: ["Svelte", "Supabase", "Xendit"],
  },
  {
    name: "Talk To Me",
    blurb:
      "Interactive web app that lets users converse with video content, with forward/rewind controls built in Three.js and conversational AI powered by ElevenLabs.",
    tech: ["React", "Three.js", "ElevenLabs"],
  },
  {
    name: "Sobat Sepadan",
    blurb:
      "Freelance frontend built from Figma designs — CRUD operations and document upload workflows, integrated with a provided API for ID (KTP) verification including invalid-format handling.",
    tech: ["Vue", "Axios", "Pinia"],
  },
  {
    name: "Customer Satisfaction Platform",
    blurb:
      "Mobile app for collecting user feedback plus a REST API for managing, analyzing, and securing the data, with JWT auth and real-time sync.",
    tech: ["Flutter", "Go", "Gin", "PostgreSQL", "MySQL", "JWT"],
  },
  {
    name: "Weborder",
    blurb:
      "Web platform streamlining orders for tax-related training and certification services, with secure authentication and order management.",
    tech: ["React", "Node.js", "Express", "Redux", "PostgreSQL", "JWT"],
  },
  {
    name: "Document Management System",
    blurb:
      "REST API backend for a document management system, including storage setup, VM server management, and deployment supporting a PHP frontend.",
    tech: ["Node.js", "Express", "PostgreSQL", "Sequelize", "JWT"],
  },
  {
    name: "Skuy Kondangan",
    blurb:
      "Digital wedding invitation platform for creating and sharing customizable online invitations, with RSVP tracking, event details, and guest management.",
    tech: ["Vue", "Firebase"],
    github: "https://github.com/Kmassidik/skuy-kondangan",
  },
  {
    name: "Impact Lab",
    blurb:
      "Task management platform for creating, organizing, and tracking to-do lists collaboratively, with CRUD functionality and status updates.",
    tech: ["PHP", "MySQL"],
    github: "https://github.com/Kmassidik/php_impact",
  },
];
