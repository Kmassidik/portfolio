import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "1",
    name: "Social Ai",
    description: `
![Social Ai](https://picsum.photos/seed/social-ai/600/300)

Launched **SocialAi**, a digital twin AI platform for public and commercial interaction, designed to be secure, reliable, and scalable. Implemented advanced media features: AI-based image generation (LoRA, OpenAI), video lip-sync, and multiple TTS models to enable seamless multimedia content creation. Built with Next.js frontend, Python services, and Supabase for data/authentication, delivering a production-ready platform now live with users.

## Features:
- Secure and scalable AI interactions
- Advanced multimedia content creation (image gen, lip-sync, TTS)
- User authentication and data management
- Production-ready deployment with active users

## Tech Stack
Next.js, Python, Supabase, LoRA, OpenAI API, TTS

### Why this project?
This project showcases expertise in AI-driven platforms, integrating cutting-edge models for multimedia and ensuring scalability in a live environment.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Next.js", "Python", "Supabase", "LoRA", "OpenAI API", "TTS"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "2",
    name: "Bus Track Command",
    description: `
![Bus Track Command](https://picsum.photos/seed/bus-track/600/300)

Developed a **proof-of-concept system** to automate bus announcements, including a React + Zustand dashboard, Golang + PostgreSQL backend, and Raspberry Pi MQTT client. Integrated ElevenLabs voice generation and deployed services with Docker to ensure scalable, reliable operation.

## Features:
- Automated announcements via voice generation
- Real-time dashboard for monitoring
- IoT integration with Raspberry Pi and MQTT
- Scalable deployment with containers

## Tech Stack
React, Zustand, Golang, PostgreSQL, Raspberry Pi, MQTT, Docker, ElevenLabs API

### Why this project?
Demonstrates skills in full-stack development for IoT applications, combining web dashboards, backend services, and hardware integration for real-world automation.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: [
      "React",
      "Zustand",
      "Golang",
      "PostgreSQL",
      "Raspberry Pi",
      "MQTT",
      "Docker",
      "ElevenLabs API",
    ],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "3",
    name: "Sopan Sepadan",
    description: `
![Sopan Sepadan](https://picsum.photos/seed/sopan-sepadan/600/300)

Built the **frontend** of a freelance project based on Figma designs, focusing on CRUD operations and document upload workflows. Integrated with a provided backend API to handle ID verification (KTP and related documents), including error handling for invalid formats. The project was successfully deployed and used by end-users.

## Features:
- CRUD operations for data management
- Document upload and verification workflows
- Error handling for formats and integrations
- Design-to-code implementation from Figma

## Tech Stack
Vue, Firebase

### Why this project?
Highlights proficiency in frontend development, API integrations, and delivering client-ready freelance solutions with a focus on user workflows.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Vue", "Firebase"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "4",
    name: "Talk To Me",
    description: `
![Talk To Me](https://picsum.photos/seed/talk-to-me/600/300)

Developed an **interactive web application** that allows users to converse with video content, featuring forward/rewind controls built with Three.js and conversational AI powered by ElevenLabs. Implemented the frontend in React.js, delivering a seamless and engaging user experience for proof-of-concept demonstration.

## Features:
- Conversation with video content via AI
- Video controls with 3D rendering (Three.js)
- Integration with voice AI for responses
- Engaging PoC for interactive media

## Tech Stack
React.js, Three.js, ElevenLabs API

### Why this project?
Showcases innovative use of 3D web tech and AI for interactive experiences, proving skills in modern frontend and multimedia integrations.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["React.js", "Three.js", "ElevenLabs API"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "5",
    name: "Code Scanner",
    description: `
![Code Scanner](https://picsum.photos/seed/code-scanner/600/300)

Built a **proof-of-concept security tool** that provides AI-powered static code analysis to detect vulnerabilities in real time and enforce best practices before deployment. Developed the frontend with Next.js + Zustand, integrating with backend APIs to deliver secure and reliable workflows.

## Features:
- AI-driven vulnerability detection
- Real-time code analysis
- Best practices enforcement
- Secure integration workflows

## Tech Stack
Next.js, Zustand

### Why this project?
Illustrates expertise in security tools and AI applications in dev ops, focusing on proactive code quality and safety.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Next.js", "Zustand"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "6",
    name: "Dalang.io",
    description: `
![Dalang.io](https://picsum.photos/seed/dalang-io/600/300)

Developed the **full web product showcase** (landing / product pages) for Dalang.io, implementing designs with Svelte and integrating payments via Xendit, data & auth via Supabase. Deployed the site successfully and ensured responsive performance for prospective customers.

## Features:
- Responsive landing and product pages
- Payment integration (Xendit)
- Authentication and data management
- High-performance deployment

## Tech Stack
Svelte, Supabase, Xendit

### Why this project?
Demonstrates end-to-end web development for product showcases, including e-commerce elements and modern frameworks.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Svelte", "Supabase", "Xendit"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "7",
    name: "Skuy-Kondangan",
    description: `
![Skuy-Kondangan](https://picsum.photos/seed/skuy-kondangan/600/300)

Developed a **digital wedding invitation platform** that allows users to create and share customizable online invitations with features like RSVP tracking, event details, and guest management. Built the frontend with Vue and integrated with Firebase for authentication, database, and hosting.

## Features:
- Customizable invitation creation
- RSVP and guest management
- Event details sharing
- Full Firebase backend integration

## Tech Stack
Vue, Firebase

### Why this project?
Shows ability to build user-friendly event platforms with real-time features and cloud services for quick deployment.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Vue", "Firebase"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "8",
    name: "IMPACT LAB",
    description: `
![IMPACT LAB](https://picsum.photos/seed/impact-lab/600/300)

Built a **task management platform** to help users create, organize, and track to-do lists collaboratively. Implemented CRUD functionality, task status updates, and user-friendly UI to streamline personal and team productivity.

## Features:
- Collaborative to-do lists
- CRUD operations for tasks
- Status tracking and updates
- Intuitive UI for productivity

## Tech Stack
PHP, MySQL

### Why this project?
Highlights backend-driven development for productivity tools, emphasizing collaboration and data management.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["PHP", "MySQL"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "9",
    name: "Mobile Apps Customer Satisfaction",
    description: `
![Mobile Apps Customer Satisfaction](https://picsum.photos/seed/mobile-customer-sat/600/300)

Developed a **mobile application** for collecting customer satisfaction feedback. The app allows users to submit reviews, track feedback, and analyze satisfaction.

## Features:
- Feedback submission and reviews
- Tracking and analysis tools
- User-friendly mobile interface
- Data synchronization

## Tech Stack
Flutter, Flutter Provider, Flutter HTTP

### Why this project?
Demonstrates cross-platform mobile development focused on user feedback collection and analysis.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Flutter", "Flutter Provider", "Flutter HTTP"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "10",
    name: "Server Customer Satisfaction",
    description: `
![Server Customer Satisfaction](https://picsum.photos/seed/server-customer-sat/600/300)

Built the **backend REST API** for a customer satisfaction platform, handling secure data storage, user authentication, and feedback analysis.

## Features:
- Secure authentication (JWT)
- Data storage and management
- Feedback analysis endpoints
- RESTful API design

## Tech Stack
Go, Gin, MySQL, Postgres, JWT

### Security
- JWT for authentication
- Secure data handling
- Scalable backend architecture

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Go", "Gin", "MySQL", "Postgres", "JWT"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "11",
    name: "DMS Indo Arsip",
    description: `
![DMS Indo Arsip](https://picsum.photos/seed/dms-indo-arsip/600/300)

Developed a **REST API backend** for Indo Arsip's Document Management System (DMS). The project included setting up storage, managing VM servers, and deploying backend services to support a PHP-based frontend.

## Features:
- Document storage and retrieval
- API integrations for frontend
- Server management and deployment
- Secure operations with JWT

## Tech Stack
Node.js, Express.js, PHP, PostgreSQL, Sequelize, JWT

### Why this project?
Showcases backend development for enterprise DMS, including infrastructure setup and integrations.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Node.js", "Express.js", "PHP", "PostgreSQL", "Sequelize", "JWT"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "12",
    name: "Weborder Mitrapajak",
    description: `
![Weborder Mitrapajak](https://picsum.photos/seed/weborder-mitrapajak/600/300)

Developed a **web platform** for Mitrapajak to streamline ordering of tax-related training and certification services. Delivered secure user authentication, order management, and efficient workflows, improving client accessibility to professional services.

## Features:
- Order management for services
- Secure authentication (JWT)
- Workflow optimizations
- State management with Redux

## Tech Stack
React.js, Node.js, Express.js, Redux, PostgreSQL, JWT

### Why this project?
Illustrates full-stack e-commerce-like development for professional services, enhancing business operations.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["React.js", "Node.js", "Express.js", "Redux", "PostgreSQL", "JWT"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "13",
    name: "Luminova",
    description: `
![Luminova](https://picsum.photos/seed/luminova/600/300)

Built a **company profile website** for Luminova, enabling the organization to present its services and brand presence online with a professional, responsive design.

## Features:
- Responsive company showcase
- Service presentations
- Brand-focused design
- Easy content management

## Tech Stack
WordPress

### Why this project?
Demonstrates quick deployment of professional sites using CMS for business needs.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["WordPress"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "14",
    name: "Study Buddy",
    description: `
![Study Buddy](https://picsum.photos/seed/study-buddy/600/300)

This app is a **platform for connecting students and teachers**, serving a variety of educational needs.

## Features:
- Student-teacher matching
- Educational resource handling
- File uploads (Multer)
- Testing with Jest and Supertest

## Tech Stack
React-Native, React-redux, MongoDB, OpenAI, Multer, Jest, Supertest

### Why this project?
Showcases mobile edtech development with AI integrations and robust testing.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: [
      "React-Native",
      "React-redux",
      "MongoDB",
      "OpenAI",
      "Multer",
      "Jest",
      "Supertest",
    ],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "15",
    name: "JECO-Mobile",
    description: `
![JECO-Mobile](https://picsum.photos/seed/jeco-mobile/600/300)

A **mobile platform** for viewing menus and checking details.

## Features:
- Menu browsing and details
- Secure auth with JWT and bcrypt
- GraphQL data fetching
- Containerized with Docker

## Tech Stack
React-Native, React-redux, MongoDB, axios, Postgres, jsonwebtoken, bcrypt, sequelize, express, graphql, apollo-client, docker

### Why this project?
Highlights complex mobile app development with modern data layers and security.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: [
      "React-Native",
      "React-redux",
      "MongoDB",
      "axios",
      "Postgres",
      "jsonwebtoken",
      "bcrypt",
      "sequelize",
      "express",
      "graphql",
      "apollo-client",
      "docker",
    ],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "16",
    name: "JECO-Web",
    description: `
![JECO-Web](https://picsum.photos/seed/jeco-web/600/300)

A **web-based platform** for creating menus, categories, and ingredients.

## Features:
- Menu and category management
- Secure backend integrations
- Animations with GSAP
- User alerts with SweetAlert

## Tech Stack
axios, Postgres, jsonwebtoken, bcrypt, sequelize-cli, express, reactJs, react-redux, gsap, sweetalert

### Performance
Efficient data handling and smooth UI interactions.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: [
      "axios",
      "Postgres",
      "jsonwebtoken",
      "bcrypt",
      "sequelize-cli",
      "express",
      "reactJs",
      "react-redux",
      "gsap",
      "sweetalert",
    ],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "17",
    name: "Restaurant",
    description: `
![Restaurant](https://picsum.photos/seed/restaurant-app/600/300)

A **web-based platform** for ordering from a menu, creating wishlists, and sharing via QR codes.

## Features:
- Menu ordering and wishlists
- QR code sharing
- Google auth integration
- State management with Pinia

## Tech Stack
google-auth, axios, Postgres, jsonwebtoken, sequelize-cli, express, pinia, vue, firebase

### Why this project?
Demonstrates e-commerce features in a restaurant context with social sharing.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: [
      "google-auth",
      "axios",
      "Postgres",
      "jsonwebtoken",
      "sequelize-cli",
      "express",
      "pinia",
      "vue",
      "firebase",
    ],
    github: "https://github.com",
    demo: "https://demo.com",
  },
];
