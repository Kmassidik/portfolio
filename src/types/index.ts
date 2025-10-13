export interface Project {
  id: string;
  name: string;
  description: string;
  tech: string[];
  image?: string;
  github?: string;
  demo?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  content: string;
  tags: string[];
  date: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
}
