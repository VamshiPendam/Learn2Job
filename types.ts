
export enum View {
  DASHBOARD = 'dashboard',
  AI_TOOLS = 'ai_tools',
  JOB_BOARD = 'job_board',
  INSIGHTS = 'insights',
  ROADMAPS = 'roadmaps',
  PROFILE = 'profile'
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  pricing: 'Free' | 'Freemium' | 'Paid';
  tags: string[];
  icon: string;
  url: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Internship' | 'Contract';
  tags: string[];
  description: string;
  stack: string[];
  postedAt: string;
  logo: string;
  applyUrl?: string;
}

export interface RoadmapPhase {
  title: string;
  period?: string;
  description: string;
  skills: {
    name: string;
    status: 'completed' | 'in_progress' | 'next';
    icon: string;
    details?: string;
    criticalSteps?: string[];
    masteryContent?: string[];
  }[];
}

export interface Roadmap {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  keyTopics: string[];
  phases: RoadmapPhase[];
}
