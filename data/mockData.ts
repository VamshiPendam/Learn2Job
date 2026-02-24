
import { AITool, Job, Roadmap } from '../types';

export const MOCK_TOOLS: AITool[] = [
  { id: '1', name: 'Midjourney', category: 'Image Generation', description: 'Leading text-to-image generative engine.', rating: 4.9, pricing: 'Paid', tags: ['Creative', 'Design'], icon: 'fa-palette', url: 'https://www.midjourney.com' },
  { id: '2', name: 'Pinecone', category: 'Infrastructure', description: 'Vector database for long-term AI memory.', rating: 4.7, pricing: 'Freemium', tags: ['Database', 'Vector'], icon: 'fa-database', url: 'https://www.pinecone.io' },
  { id: '3', name: 'LangChain', category: 'Developer Tools', description: 'Framework for building LLM applications.', rating: 4.8, pricing: 'Free', tags: ['Python', 'LLM'], icon: 'fa-link', url: 'https://www.langchain.com' },
  { id: '4', name: 'CodeWhisperer', category: 'Coding Tools', description: 'Real-time AI code generation for developers.', rating: 4.6, pricing: 'Freemium', tags: ['Dev', 'Assistant'], icon: 'fa-code', url: 'https://aws.amazon.com/codewhisperer' },
  { id: '5', name: 'Claude 3.5', category: 'LLM & Chat', description: 'Advanced reasoning and high-fidelity chat.', rating: 4.9, pricing: 'Freemium', tags: ['Reasoning', 'Chat'], icon: 'fa-message', url: 'https://www.anthropic.com/claude' },
  { id: '6', name: 'ChatGPT', category: 'LLM & Chat', description: 'Conversational AI by OpenAI based on GPT-4 architecture.', rating: 4.8, pricing: 'Freemium', tags: ['Assistant', 'NLP'], icon: 'fa-robot', url: 'https://chat.openai.com' },
  { id: '7', name: 'Stable Diffusion', category: 'Image Generation', description: 'Open-source latent text-to-image diffusion model.', rating: 4.7, pricing: 'Free', tags: ['Graphics', 'AI'], icon: 'fa-image', url: 'https://stability.ai' },
  { id: '8', name: 'DALL-E 3', category: 'Image Generation', description: 'Modern image generation integrated with ChatGPT.', rating: 4.9, pricing: 'Paid', tags: ['Art', 'Design'], icon: 'fa-magic', url: 'https://openai.com/dall-e-3' },
  { id: '9', name: 'GitHub Copilot', category: 'Coding Tools', description: 'AI pair programmer for writing better code.', rating: 4.8, pricing: 'Paid', tags: ['Code', 'Development'], icon: 'fa-terminal', url: 'https://github.com/features/copilot' },
  { id: '10', name: 'Runway Gen-2', category: 'Video Synthesis', description: 'Next-step video generation from text or images.', rating: 4.6, pricing: 'Paid', tags: ['Video', 'Cinema'], icon: 'fa-video', url: 'https://runwayml.com' },
  { id: '11', name: 'ElevenLabs', category: 'Audio & Voice', description: 'High-quality AI speech synthesis and cloning.', rating: 4.9, pricing: 'Freemium', tags: ['Voice', 'Audio'], icon: 'fa-microphone', url: 'https://elevenlabs.io' },
  { id: '12', name: 'Llama 3', category: 'LLM & Chat', description: 'Powerful open-source LLM by Meta AI.', rating: 4.7, pricing: 'Free', tags: ['Open Source', 'LLM'], icon: 'fa-brain', url: 'https://llama.meta.com' },
  { id: '13', name: 'Vercel SDK', category: 'Developer Tools', description: 'Tools for building AI-powered web applications.', rating: 4.8, pricing: 'Free', tags: ['Web', 'SDK'], icon: 'fa-cloud', url: 'https://sdk.vercel.ai' },
  { id: '14', name: 'Weights & Biases', category: 'Data Science', description: 'Developer tools for ML experiment tracking.', rating: 4.7, pricing: 'Freemium', tags: ['MLOps', 'Dashboard'], icon: 'fa-chart-line', url: 'https://wandb.ai' },
  { id: '15', name: 'Hugging Face', category: 'Infrastructure', description: 'The platform where the machine learning community builds models.', rating: 4.9, pricing: 'Free', tags: ['Community', 'Models'], icon: 'fa-smile', url: 'https://huggingface.co' },
  { id: '16', name: 'Sora', category: 'Video Synthesis', description: 'Text-to-video model that creates realistic videos.', rating: 4.9, pricing: 'Paid', tags: ['Video', 'Animation'], icon: 'fa-clapperboard', url: 'https://openai.com/sora' },
  { id: '17', name: 'Perplexity', category: 'LLM & Chat', description: 'AI search engine for conversational answers.', rating: 4.8, pricing: 'Freemium', tags: ['Search', 'Chat'], icon: 'fa-search', url: 'https://www.perplexity.ai' },
  { id: '18', name: 'Cursor', category: 'Coding Tools', description: 'AI-first code editor built for pair programming.', rating: 4.9, pricing: 'Freemium', tags: ['Editor', 'Code'], icon: 'fa-mouse-pointer', url: 'https://www.cursor.com' },
  { id: '19', name: 'Descript', category: 'Audio & Voice', description: 'All-in-one video and podcast editing using AI.', rating: 4.7, pricing: 'Paid', tags: ['Editor', 'Voice'], icon: 'fa-headphones', url: 'https://www.descript.com' },
  { id: '20', name: 'TensorFlow', category: 'Data Science', description: 'End-to-end open source platform for machine learning.', rating: 4.6, pricing: 'Free', tags: ['Library', 'Deep Learning'], icon: 'fa-microchip', url: 'https://www.tensorflow.org' },
  { id: '21', name: 'PyTorch', category: 'Data Science', description: 'Optimized tensor library for deep learning.', rating: 4.9, pricing: 'Free', tags: ['Library', 'Research'], icon: 'fa-fire', url: 'https://pytorch.org' },
  { id: '22', name: 'Mistral 7B', category: 'LLM & Chat', description: 'Highly efficient open-source small language model.', rating: 4.8, pricing: 'Free', tags: ['Efficiency', 'LLM'], icon: 'fa-bolt', url: 'https://mistral.ai' },
  { id: '23', name: 'Anthropic Claude SDK', category: 'Developer Tools', description: 'SDK for integrating Claude LLMs.', rating: 4.7, pricing: 'Free', tags: ['SDK', 'AI'], icon: 'fa-laptop-code', url: 'https://www.anthropic.com/api' },
  { id: '24', name: 'Jasper', category: 'LLM & Chat', description: 'AI content platform for enterprise teams.', rating: 4.5, pricing: 'Paid', tags: ['Marketing', 'Copy'], icon: 'fa-pen-nib', url: 'https://www.jasper.ai' },
  { id: '25', name: 'Firefly', category: 'Image Generation', description: 'A family of creative generative AI models by Adobe.', rating: 4.7, pricing: 'Paid', tags: ['Creative', 'Design'], icon: 'fa-fire-alt', url: 'https://www.adobe.com/products/firefly.html' },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior ML Systems Engineer',
    company: 'Anthropic',
    location: 'San Francisco / Remote',
    salary: '$180k - $250k',
    type: 'Full-time',
    tags: ['NLP', 'Pytorch'],
    description: 'Build core infrastructure for large language models.',
    stack: ['Python', 'PyTorch', 'CUDA', 'Kubernetes', 'Rust'],
    postedAt: '2 days ago',
    logo: 'https://picsum.photos/40/40?random=1'
  },
  {
    id: 'j2',
    title: 'Research Engineer Intern',
    company: 'OpenAI',
    location: 'Remote',
    salary: '$9,000 / mo',
    type: 'Internship',
    tags: ['Alignment', 'LLMs'],
    description: 'Work on cutting-edge alignment research for AGI.',
    stack: ['Python', 'Deep Learning', 'PyTorch'],
    postedAt: '1 week ago',
    logo: 'https://picsum.photos/40/40?random=2'
  },
  {
    id: 'j3',
    title: 'Prompt Architect',
    company: 'Jasper AI',
    location: 'Austin, TX',
    salary: '$120k - $160k',
    type: 'Full-time',
    tags: ['Marketing', 'GenAI'],
    description: 'Optimize generative AI outputs for content marketing.',
    stack: ['GPT-4', 'Prompt Engineering', 'Copywriting'],
    postedAt: '3 days ago',
    logo: 'https://picsum.photos/40/40?random=3'
  }
];

export const DEFAULT_ROADMAP: Roadmap = {
  id: 'mlops',
  title: 'Machine Learning Operations',
  subtitle: 'MLOPS SPECIALIST',
  description: 'Master the lifecycle of machine learning models from data prep to production deployment.',
  keyTopics: ['Infrastructure', 'Automation', 'Containers', 'Monitoring', 'CI/CD', 'Security', 'Scalability'],
  phases: [
    {
      title: 'Phase 1: System Fundamentals',
      description: 'Core infrastructure skills for automation.',
      skills: [
        { name: 'Linux & Bash', status: 'completed', icon: 'fa-terminal' },
        { name: 'Python Advanced', status: 'completed', icon: 'fa-code' },
        { name: 'Version Control', status: 'completed', icon: 'fa-code-branch' }
      ]
    },
    {
      title: 'Phase 2: Containerization & Orchestration',
      description: 'Scaling and managing workloads.',
      skills: [
        { name: 'Docker Hub', status: 'in_progress', icon: 'fa-cube' },
        { name: 'Kubernetes (K8s)', status: 'next', icon: 'fa-cubes' }
      ]
    },
    {
      title: 'Phase 3: Production Deployment',
      description: 'Serving models at scale.',
      skills: [
        { name: 'FastAPI', status: 'next', icon: 'fa-bolt' },
        { name: 'Grafana/Prometheus', status: 'next', icon: 'fa-chart-area' }
      ]
    }
  ]
};

export const AI_ENGINEER_ROADMAP: Roadmap = {
  id: 'ai-engineer',
  title: 'AI Engineering',
  subtitle: 'AI ENGINEER',
  description: 'Build and deploy AI systems with expertise in machine learning, deep learning, and AI infrastructure.',
  keyTopics: ['Machine Learning', 'Deep Learning', 'Neural Networks', 'Deployment', 'Optimization', 'Mathematics', 'Cloud AI'],
  phases: [
    {
      title: 'Phase 1: Programming & Math Foundations',
      description: 'Essential programming and mathematical skills.',
      skills: [
        { name: 'Python', status: 'completed', icon: 'fa-code' },
        { name: 'Linear Algebra', status: 'completed', icon: 'fa-calculator' },
        { name: 'Statistics', status: 'completed', icon: 'fa-chart-bar' }
      ]
    },
    {
      title: 'Phase 2: Machine Learning Core',
      description: 'Core ML algorithms and frameworks.',
      skills: [
        { name: 'Scikit-learn', status: 'in_progress', icon: 'fa-brain' },
        { name: 'TensorFlow/PyTorch', status: 'next', icon: 'fa-microchip' }
      ]
    },
    {
      title: 'Phase 3: Advanced AI & Deployment',
      description: 'Advanced techniques and production deployment.',
      skills: [
        { name: 'Deep Learning', status: 'next', icon: 'fa-network-wired' },
        { name: 'Model Deployment', status: 'next', icon: 'fa-rocket' }
      ]
    }
  ]
};

export const DATA_SCIENTIST_ROADMAP: Roadmap = {
  id: 'data-scientist',
  title: 'Data Science',
  subtitle: 'DATA SCIENTIST',
  description: 'Extract insights from data using statistical analysis, machine learning, and visualization techniques.',
  keyTopics: ['Statistics', 'Data Wrangling', 'ML Modeling', 'Visualization', 'SQL', 'Big Data', 'Storytelling'],
  phases: [
    {
      title: 'Phase 1: Data Fundamentals',
      description: 'Data handling and basic analysis.',
      skills: [
        { name: 'Python/R', status: 'completed', icon: 'fa-code' },
        { name: 'SQL', status: 'completed', icon: 'fa-database' },
        { name: 'Excel', status: 'completed', icon: 'fa-table' }
      ]
    },
    {
      title: 'Phase 2: Analysis & Modeling',
      description: 'Advanced analysis and predictive modeling.',
      skills: [
        { name: 'Pandas/NumPy', status: 'in_progress', icon: 'fa-chart-line' },
        { name: 'Machine Learning', status: 'next', icon: 'fa-brain' }
      ]
    },
    {
      title: 'Phase 3: Advanced Analytics',
      description: 'Big data and advanced techniques.',
      skills: [
        { name: 'Big Data Tools', status: 'next', icon: 'fa-server' },
        { name: 'Deep Learning', status: 'next', icon: 'fa-network-wired' }
      ]
    }
  ]
};

export const PROMPT_ARCHITECT_ROADMAP: Roadmap = {
  id: 'prompt-architect',
  title: 'Prompt Engineering',
  subtitle: 'PROMPT ARCHITECT',
  description: 'Master the art of crafting effective prompts for AI models to achieve desired outputs.',
  keyTopics: ['LLM Context', 'Zero-shot', 'Few-shot', 'Chain of Thought', 'Iterative Refinement', 'System Instructions', 'Ethics'],
  phases: [
    {
      title: 'Phase 1: AI Fundamentals',
      description: 'Understanding AI and language models.',
      skills: [
        { name: 'AI Basics', status: 'completed', icon: 'fa-robot' },
        { name: 'LLM Knowledge', status: 'completed', icon: 'fa-brain' },
        { name: 'Natural Language Processing', status: 'completed', icon: 'fa-language' }
      ]
    },
    {
      title: 'Phase 2: Prompt Techniques',
      description: 'Learning various prompting strategies.',
      skills: [
        { name: 'Basic Prompting', status: 'in_progress', icon: 'fa-pen' },
        { name: 'Advanced Techniques', status: 'next', icon: 'fa-magic' }
      ]
    },
    {
      title: 'Phase 3: Specialization',
      description: 'Specialized prompting for different domains.',
      skills: [
        { name: 'Domain-Specific Prompts', status: 'next', icon: 'fa-industry' },
        { name: 'Prompt Optimization', status: 'next', icon: 'fa-tachometer-alt' }
      ]
    }
  ]
};

export const RESEARCH_SCIENTIST_ROADMAP: Roadmap = {
  id: 'research-scientist',
  title: 'AI Research',
  subtitle: 'RESEARCH SCIENTIST',
  description: 'Conduct cutting-edge research in artificial intelligence and machine learning.',
  keyTopics: ['Theoretical ML', 'Optimization Theory', 'Literature Review', 'Experiment Design', 'Grant Writing', 'Ethics', 'Publication'],
  phases: [
    {
      title: 'Phase 1: Academic Foundations',
      description: 'Strong mathematical and theoretical background.',
      skills: [
        { name: 'Advanced Mathematics', status: 'completed', icon: 'fa-calculator' },
        { name: 'Research Methodology', status: 'completed', icon: 'fa-microscope' },
        { name: 'Academic Writing', status: 'completed', icon: 'fa-book' }
      ]
    },
    {
      title: 'Phase 2: Technical Skills',
      description: 'Advanced technical competencies.',
      skills: [
        { name: 'Deep Learning', status: 'in_progress', icon: 'fa-network-wired' },
        { name: 'Research Tools', status: 'next', icon: 'fa-tools' }
      ]
    },
    {
      title: 'Phase 3: Research & Publication',
      description: 'Conducting research and publishing findings.',
      skills: [
        { name: 'Paper Writing', status: 'next', icon: 'fa-file-alt' },
        { name: 'Conference Presentations', status: 'next', icon: 'fa-presentation' }
      ]
    }
  ]
};
