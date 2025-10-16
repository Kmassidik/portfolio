import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: "1",
    name: "Distributed Task Scheduler",
    description: `
![Distributed Task Scheduler](https://picsum.photos/seed/task-scheduler/600/300)

A high-performance **distributed task scheduling system** built with microservices architecture.

## Features:
- Efficient task distribution across multiple nodes
- Fault-tolerant and reliable
- Scalable to thousands of concurrent tasks

## Tech Stack
Go, Redis, PostgreSQL, Docker, Kubernetes

### Why this project?
This project demonstrates expertise in building scalable distributed systems that can handle real-world production workloads.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Go", "Redis", "PostgreSQL", "Docker", "Kubernetes"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "2",
    name: "Real-Time Chat App",
    description: `
![Real-Time Chat App](https://picsum.photos/seed/chat-app/600/300)

A **real-time messaging platform** with support for rooms, emojis, and notifications.

## Features:
- Live messaging with WebSockets
- User authentication and profile management
- Rich media support (images, GIFs, emojis)
- End-to-end encryption for privacy

## Tech Stack
Node.js, Socket.io, MongoDB, React

### Performance
Handles 10,000+ concurrent connections with \`<100ms\` latency.

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Node.js", "Socket.io", "MongoDB", "React"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    id: "3",
    name: "Personal Finance Tracker",
    description: `
![Personal Finance Tracker](https://picsum.photos/seed/finance-tracker/600/300)

A **web app for tracking personal finances** with analytics and reporting.

## Features:
- Track income and expenses
- Visualize spending trends with charts
- Set budgets and receive alerts
- Export data to CSV/PDF

## Tech Stack
Python, Django, PostgreSQL, Chart.js

### Security
- AES-256 encryption for sensitive data
- Two-factor authentication
- Regular security audits

**Demo:** [Try it here](https://demo.com)  
**GitHub:** [View Source](https://github.com)
    `,
    tech: ["Python", "Django", "PostgreSQL", "Chart.js"],
    github: "https://github.com",
    demo: "https://demo.com",
  },
];
