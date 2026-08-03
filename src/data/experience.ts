export interface Role {
  company: string;
  location: string;
  title: string;
  period: string;
  current?: boolean;
  points?: string[];
}

export const roles: Role[] = [
  {
    company: "Soember Djaya",
    location: "Jakarta, Indonesia",
    title: "Full Stack AI Engineer",
    period: "Dec 2025 — Present",
    current: true,
  },
  {
    company: "Dalang Pte. Ltd.",
    location: "Pandeglang, Indonesia",
    title: "Software Engineer",
    period: "Dec 2024 — Feb 2025",
  },
  {
    company: "PT Sarana Teknologi Utama",
    location: "Pamulang, Indonesia",
    title: "Application Architect",
    period: "Dec 2023 — Nov 2024",
  },
  {
    company: "Hitachi Omron Technical Solution",
    location: "Jakarta, Indonesia",
    title: "Customer Engineer",
    period: "Sep 2018 — Jun 2023",
  },
];

export const education = {
  school: "Telkom University",
  location: "Jakarta, Indonesia",
  degree: "Bachelor of Electrical Engineering",
  period: "Aug 2013 — Aug 2017",
};

export const certifications = [
  {
    name: "Full Stack JavaScript Immersive Program",
    org: "Hacktiv8",
    period: "Jul 2023 — Oct 2023",
    score: "95.2 / 100 (A+)",
  },
  {
    name: "Full Stack JavaScript Immersive Program",
    org: "Binar Academy",
    period: "Jul 2022 — Feb 2023",
    score: "4.8 / 5.0",
  },
];
