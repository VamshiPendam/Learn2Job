import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Target,
  TrendingUp,
  ShieldAlert,
  Layout,
  Cpu,
  DollarSign,
  BarChart3,
  ChevronRight,
  Loader2,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Code2,
  Clock,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import Markdown from 'react-markdown';
import {
  generateProductStrategy,
  ProductStrategy,
  generateLearningRoadmap,
  LearningRoadmap
} from '../services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AppMode = 'product' | 'learning';

const Roadmaps: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('product');
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<ProductStrategy | null>(null);
  const [learningRoadmap, setLearningRoadmap] = useState<LearningRoadmap | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName || !description) return;

    setLoading(true);
    try {
      if (mode === 'product') {
        const result = await generateProductStrategy(productName, description);
        if (!result || !result.roadmap) {
          throw new Error("Invalid response structure from AI. Please try a more specific prompt.");
        }
        setStrategy(result);
      } else {
        const result = await generateLearningRoadmap(productName, description);
        if (!result || !result.phases) {
          throw new Error("Invalid response structure from AI. Please try a more specific technology name.");
        }
        setLearningRoadmap(result);
      }
    } catch (error: any) {
      console.error('Failed to generate:', error);
      alert(error.message || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStrategy(null);
    setLearningRoadmap(null);
    setProductName('');
    setDescription('');
  };

  const renderLearningRoadmap = (data: LearningRoadmap) => (
    <motion.div
      key="learning-dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-24 w-full"
    >
      <header className="sticky top-0 z-50 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={reset} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-medium tracking-tight text-white">{data.techName}</h2>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Learning Roadmap</p>
            </div>
          </div>
          <button onClick={reset} className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-colors shadow-lg shadow-primary/20">
            New Roadmap
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        {/* Objective Section */}
        <section className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-xl shadow-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">Learning Objective</h3>
          </div>
          <p className="text-xl text-slate-300 leading-relaxed font-medium italic">
            "{data.objective}"
          </p>
        </section>

        {/* Phases Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-medium tracking-tight text-white">Mastery Path</h3>
            <div className="h-px flex-1 bg-primary/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { phase: data.phases.foundations, icon: BookOpen, color: 'bg-blue-500/10 text-blue-400', label: 'Phase 01' },
              { phase: data.phases.intermediate, icon: Code2, color: 'bg-purple-500/10 text-purple-400', label: 'Phase 02' },
              { phase: data.phases.advanced, icon: Sparkles, color: 'bg-emerald-500/10 text-emerald-400', label: 'Phase 03' }
            ].map(({ phase, icon: Icon, color, label }, idx) => (
              <div key={idx} className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-lg shadow-primary/5 flex flex-col relative overflow-hidden group hover:border-primary/50 transition-all">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Icon className="w-24 h-24" />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-3 rounded-2xl", color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{label}</span>
                </div>
                <h4 className="text-xl font-medium mb-2 text-white">{phase.title}</h4>
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Clock className="w-3 h-3" />
                  {phase.estimatedTime}
                </div>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  {phase.description}
                </p>
                <div className="space-y-3 mt-auto">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(17,82,212,0.5)]" />
                    Essential Modules
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {phase.keyTopics.map((topic, i) => (
                      <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:border-primary/50 transition-colors">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects & Careers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section className="bg-primary/5 p-8 rounded-[32px] border border-primary/20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">Portfolio Projects</h3>
            </div>
            <div className="space-y-6">
              {data.projects.map((project, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{project.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                      {project.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-br from-[#0d1627] to-[#1152d4]/20 text-white p-8 rounded-[32px] border border-primary/20 shadow-2xl relative overflow-hidden">
            <div className="absolute -bottom-8 -right-8 opacity-[0.03] rotate-12">
              <Briefcase className="w-48 h-48" />
            </div>
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Career Opportunities</h3>
            </div>
            <div className="space-y-8 relative z-10">
              {data.careerPaths.map((path, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-white">{path.role}</h4>
                    <span className="text-emerald-400 font-mono text-sm font-bold">{path.salaryRange}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {path.requiredSkills.map((skill, si) => (
                      <span key={si} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/10 border border-white/5 text-slate-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {i < data.careerPaths.length - 1 && <div className="h-px bg-white/5" />}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Resources Section */}
        <section className="bg-primary/5 p-8 rounded-[32px] border border-primary/20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">Recommended Resources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-primary transition-all flex items-center justify-between hover:border-primary shadow-lg shadow-black/20"
              >
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-white">{res.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 group-hover:text-white/70">{res.type}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white font-sans selection:bg-primary selection:text-white">
      <AnimatePresence mode="wait">
        {!strategy && !learningRoadmap ? (
          <motion.main
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto px-6 py-24 relative"
          >
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/10 blur-[120px] rounded-full -z-10 pointer-events-none" />

            <div className="space-y-12 text-center">
              <div className="flex flex-col items-center gap-8">
                <div className="flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-sm shadow-xl shadow-black/20">
                  <button
                    onClick={() => setMode('product')}
                    className={cn(
                      "px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all",
                      mode === 'product' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Product Strategy
                  </button>
                  <button
                    onClick={() => setMode('learning')}
                    className={cn(
                      "px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all",
                      mode === 'learning' ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Learning Blueprint
                  </button>
                </div>
              </div>
              <h1 className="text-7xl font-medium tracking-tighter leading-[0.95] serif text-white">
                {mode === 'product' ? (
                  <>Strategic <br /><span className="italic text-primary/80">Product Roadmap</span></>
                ) : (
                  <>Adaptive <br /><span className="italic text-primary/80">Learning Blueprint</span></>
                )}
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                {mode === 'product'
                  ? "Architect a comprehensive technical strategy for your next product innovation."
                  : "Generate a hyper-personalized technical curriculum to master any modern skill."
                }
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6 bg-white/5 p-8 rounded-[32px] shadow-2xl border border-white/10 backdrop-blur-md">
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  {mode === 'product' ? 'Product Name' : 'Technology Name'}
                </label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={mode === 'product' ? "e.g. Nexus Flow" : "e.g. Rust, Kubernetes, React"}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg bg-[#0d1627] text-white placeholder:text-slate-600 shadow-inner"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  {mode === 'product' ? 'Product Description & Goals' : 'Your Learning Goal'}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={mode === 'product'
                    ? "Describe what the tool does, its target audience, and what you hope to achieve..."
                    : "e.g. I want to become a Senior DevOps Engineer and build scalable infrastructure..."
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-h-[150px] text-lg bg-[#0d1627] text-white placeholder:text-slate-600 shadow-inner"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Synthesizing Path...
                  </>
                ) : (
                  <>
                    {mode === 'product' ? 'Generate Roadmap' : 'Create Learning Path'}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.main>
        ) : strategy ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-24 w-full"
          >
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a0f1a]/80 backdrop-blur-md border-b border-white/10">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={reset}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-medium tracking-tight text-white">{strategy.productName}</h2>
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Strategic Roadmap</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-full border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors text-slate-300"
                  >
                    Export PDF
                  </button>
                  <button
                    onClick={reset}
                    className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-colors shadow-lg shadow-primary/20"
                  >
                    New Analysis
                  </button>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
              {/* Top Section: Analysis & Market */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <section className="lg:col-span-2 space-y-6">
                  <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-xl shadow-primary/5">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Target className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">Current State Analysis</h3>
                    </div>
                    <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed">
                      <Markdown>{strategy.currentState.analysis}</Markdown>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-white/10">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-4">Core Strengths</h4>
                        <ul className="space-y-2">
                          {strategy.currentState.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-500 mb-4">Current Gaps</h4>
                        <ul className="space-y-2">
                          {strategy.currentState.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="bg-gradient-to-br from-[#0d1627] to-[#1152d4]/20 text-white p-8 rounded-[32px] shadow-2xl border border-primary/20">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Market Position</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Key Competitors</h4>
                        <div className="flex flex-wrap gap-2">
                          {strategy.marketAnalysis.competitors.map((c, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/10 text-slate-300">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Industry Trends</h4>
                        <ul className="space-y-2">
                          {strategy.marketAnalysis.trends.map((t, i) => (
                            <li key={i} className="text-sm text-slate-300 flex gap-2 italic">
                              <span className="text-primary/50">—</span> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-white/5">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Differentiation Strategy</h4>
                        <p className="text-sm text-slate-200 leading-relaxed font-medium">
                          {strategy.marketAnalysis.differentiation}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Roadmap Phase Section */}
              <section className="space-y-8">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-medium tracking-tight text-white">Phased Roadmap</h3>
                  <div className="h-px flex-1 bg-primary/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { phase: strategy.roadmap.shortTerm, icon: Rocket, color: 'bg-blue-500/10 text-blue-400' },
                    { phase: strategy.roadmap.midTerm, icon: Layout, color: 'bg-purple-500/10 text-purple-400' },
                    { phase: strategy.roadmap.longTerm, icon: Sparkles, color: 'bg-emerald-500/10 text-emerald-400' }
                  ].map(({ phase, icon: Icon, color }, idx) => (
                    <div key={idx} className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-lg shadow-primary/5 hover:border-primary/50 transition-all group flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn("p-3 rounded-2xl", color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{phase.timeline}</span>
                      </div>
                      <h4 className="text-xl font-medium mb-2 text-white">{phase.title}</h4>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {phase.focus.map((f, i) => (
                          <span key={i} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400">
                            {f}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed flex-1">
                        {phase.details}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technical & UX Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-xl shadow-primary/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">Technical Deep Dive</h3>
                      <p className="text-[9px] text-primary font-bold uppercase tracking-tighter">High-Priority Upgrades</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {strategy.technicalUpgrades.map((upgrade, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-primary/20">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium text-slate-200">{upgrade}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-xl shadow-primary/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Layout className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">UI/UX Transformation</h3>
                  </div>
                  <div className="prose prose-sm prose-invert text-slate-300 italic leading-relaxed">
                    <Markdown>{strategy.uxStrategy}</Markdown>
                  </div>
                  <div className="mt-8 pt-8 border-t border-white/10 text-center lg:text-left">
                    <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                      <DollarSign className="w-5 h-5 text-primary/70" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Monetization Approach</h4>
                    </div>
                    <p className="text-sm font-medium text-white bg-primary/10 inline-block px-4 py-2 rounded-xl border border-primary/20">{strategy.monetization}</p>
                  </div>
                </div>
              </div>

              {/* Risks & KPIs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-xl shadow-primary/5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
                  <div className="flex items-center gap-3 mb-8 relative z-10">
                    <div className="p-2 bg-rose-500/10 text-rose-500 rounded-lg">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">Risk Assessment</h3>
                  </div>
                  <div className="space-y-6 relative z-10">
                    {strategy.risks.map((r, i) => (
                      <div key={i} className="space-y-2 group">
                        <h4 className="text-sm font-bold flex items-center gap-2 text-white group-hover:text-rose-400 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                          {r.risk}
                        </h4>
                        <p className="text-xs text-slate-400 ml-4 border-l border-white/10 pl-4">{r.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/20 shadow-xl shadow-primary/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px] text-white">Success Metrics (KPIs)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {strategy.kpis.map((kpi, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 transition-all group">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1 group-hover:text-primary transition-colors">{kpi.metric}</p>
                        <p className="text-lg font-semibold tracking-tight text-white">{kpi.target}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </motion.div>
        ) : (
          renderLearningRoadmap(learningRoadmap!)
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&display=swap');
        
        .serif {
          font-family: 'Cormorant Garamond', serif;
        }

        @media print {
          .no-print { display: none; }
          body { background: white; }
          .sticky { position: static; }
        }
      `}</style>
    </div >
  );
};

export default Roadmaps;
