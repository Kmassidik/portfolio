export interface Project {
  name: string;
  date?: string;
  blurb: string;
  detail?: string;
  points?: string[];
  tech: string[];
  link?: string;
  github?: string;
  status?: "live" | "open-source" | "self-hosted" | "in-production" | "wip";
  /** Drop a screenshot in public/projects/<image> and reference it here. */
  image?: string;
}

/** Lead work — AI platforms + self-hosted engineering, newest first. */
export const featured: Project[] = [
  {
    name: "selfhostgenai",
    date: "2026",
    blurb:
      "MiniMax-H3 (33B) video model and Qwen-Image 2.1 image engine running on three second-hand RTX 3060 Ti (8 GB each) — hardware officially six times too small for it.",
    points: [
      "Built from-scratch inference engines in Rust and Python. Diagnosed the 8 GB wall to bit-level (int8 GEMM working buffers, not weights) and patched it cleanly.",
      "Implemented ring attention and 3-GPU sequence parallelism to render native 720p video. Also built the image engine: int8 + KV cache + RAM offload for reference-quality stills on one card.",
    ],
    tech: ["Rust", "Python", "PyTorch", "CUDA", "Multi-GPU", "Inference Eng."],
    status: "self-hosted",
  },
  {
    name: "Glicc AI",
    date: "Jun 2026",
    blurb:
      "AI-powered education platform that turns a single PDF, DOCX, or PowerPoint into assignments, exams, and learning materials — cutting lesson prep time by up to 90%.",
    points: [
      "Document-understanding pipeline that converts uploaded teaching material into ready-to-use assessments, with generated answer keys, correctness scoring, and customizable question styles.",
      "Integrated classroom management for teachers, students, assignments, and classes — including AI-assisted grading, barcode-based reward redemption, and real-time class group communication.",
    ],
    tech: ["AI/LLM", "Document AI", "Full Stack", "Docker", "Cloudflare"],
    status: "in-production",
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
    status: "in-production",
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
    link: "https://console.sinergiai.co.id",
    status: "live",
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
    status: "live",
  },
  {
    name: "TakumiNet",
    date: "Nov 2026",
    blurb:
      "Free, clean-room network emulator that runs in the browser — no account, no install. Build a topology, configure devices, and inspect real Ethernet/IP packets.",
    points: [
      "Rust simulation engine compiled to WebAssembly; builds and routes real packets through user-defined topologies inside each browser tab.",
      "Zero runtime JS dependencies; TypeScript canvas UI with guided labs for networking education.",
    ],
    tech: ["Rust", "WebAssembly", "TypeScript", "Bun"],
    github: "https://github.com/Kmassidik/TakumiNet",
    status: "open-source",
  },
  {
    name: "Hakobi (運び)",
    date: "Oct 2026",
    blurb:
      "Self-hosted DevOps control plane: interactive first-run setup, automated Cloudflare Tunnel and DNS creation, and an authenticated SSR dashboard — outbound-only, no open inbound ports.",
    points: [
      "Built in Rust (Axum + Askama SSR); Argon2id passwords, opaque sessions, CSRF protection, login throttling.",
      "Non-root Docker deployment, Nix dev shell, loopback-only local mode.",
    ],
    tech: ["Rust", "Axum", "Docker", "Cloudflare Tunnel", "Nix"],
    github: "https://github.com/Kmassidik/Hakobi",
    status: "open-source",
  },
];

/** Earlier and supporting work. */
export const earlier: Project[] = [
  {
    name: "SSH Tray",
    date: "Oct 2026",
    blurb:
      "Native macOS and Linux menu-bar app for one-click SSH connections: host CRUD, network groups, SSH config safe-editing, key generation and management — no config files by hand.",
    tech: ["Rust", "egui", "Nix", "macOS", "Linux"],
    github: "https://github.com/Kmassidik/SSH-Tray",
    status: "open-source",
  },
  {
    name: "Praxis-AI",
    date: "2026",
    blurb:
      "Multi-tenant social-media analytics and reporting SaaS for agencies: live dashboards per client brand and white-label PDF reports, with AI-generated summaries via OpenRouter.",
    tech: ["SvelteKit", "Supabase", "TailwindCSS", "PDFKit", "Bun", "Docker"],
    link: "https://itspraxis.com",
    status: "live",
  },
  {
    name: "Cross-band Radio Bridge",
    date: "Mar 2025",
    blurb:
      "Raspberry Pi middleware that lets HF, VHF, and UHF radios hold a single conversation. Custom interface board (level trim, isolation, BJT PTT keying) with Python RMS voice-activity detection.",
    tech: ["Raspberry Pi", "Python", "numpy", "Electronics"],
  },
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
  },
  {
    name: "Impact Lab",
    blurb:
      "Task management platform for creating, organizing, and tracking to-do lists collaboratively, with CRUD functionality and status updates.",
    tech: ["PHP", "MySQL"],
  },
];
