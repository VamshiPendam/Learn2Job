/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
} from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AppMode = 'product' | 'learning';

export default function App() {
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
        setStrategy(result);
      } else {
        const result = await generateLearningRoadmap(productName, description);
        setLearningRoadmap(result);
      }
    } catch (error) {
      console.error('Failed to generate:', error);
      alert('Failed to generate content. Please check your API key and try again.');
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
      className="pb-24"
    >
      <header className="sticky top-0 z-50 bg-[#F5F5F0]/80 backdrop-blur-md border-bottom border-[#141414]/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={reset} className="p-2 hover:bg-white rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-xl font-medium tracking-tight">{data.techName}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Learning Roadmap</p>
            </div>
          </div>
          <button onClick={reset} className="px-4 py-2 rounded-full bg-[#141414] text-white text-sm font-medium hover:opacity-90 transition-colors">
            New Roadmap
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12 space-y-12">
        {/* Objective Section */}
        <section className="bg-white p-8 rounded-[32px] border border-[#141414]/5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Learning Objective</h3>
          </div>
          <p className="text-xl text-[#141414]/80 leading-relaxed font-medium italic">
            "{data.objective}"
          </p>
        </section>

        {/* Phases Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-medium tracking-tight">Mastery Path</h3>
            <div className="h-px flex-1 bg-[#141414]/5" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { phase: data.phases.foundations, icon: BookOpen, color: 'bg-blue-50 text-blue-600', label: 'Phase 01' },
              { phase: data.phases.intermediate, icon: Code2, color: 'bg-purple-50 text-purple-600', label: 'Phase 02' },
              { phase: data.phases.advanced, icon: Sparkles, color: 'bg-emerald-50 text-emerald-600', label: 'Phase 03' }
            ].map(({ phase, icon: Icon, color, label }, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[32px] border border-[#141414]/5 shadow-sm flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Icon className="w-24 h-24" />
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div className={cn("p-3 rounded-2xl", color)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{label}</span>
                </div>
                <h4 className="text-xl font-medium mb-2">{phase.title}</h4>
                <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest opacity-50">
                  <Clock className="w-3 h-3" />
                  {phase.estimatedTime}
                </div>
                <p className="text-sm text-[#141414]/70 mb-6 leading-relaxed">
                  {phase.description}
                </p>
                <div className="space-y-2 mt-auto">
                  <h5 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Key Topics</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {phase.keyTopics.map((topic, i) => (
                      <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#141414]/5">
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
          <section className="bg-white p-8 rounded-[32px] border border-[#141414]/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Rocket className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Portfolio Projects</h3>
            </div>
            <div className="space-y-6">
              {data.projects.map((project, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[#F5F5F0]/50 border border-[#141414]/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{project.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-white border border-[#141414]/5">
                      {project.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-[#141414]/60 leading-relaxed">{project.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-[#141414] text-[#F5F5F0] p-8 rounded-[32px]">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="w-5 h-5 text-white/60" />
              <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Career Opportunities</h3>
            </div>
            <div className="space-y-8">
              {data.careerPaths.map((path, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">{path.role}</h4>
                    <span className="text-emerald-400 font-mono text-sm">{path.salaryRange}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {path.requiredSkills.map((skill, si) => (
                      <span key={si} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded bg-white/10 border border-white/5">
                        {skill}
                      </span>
                    ))}
                  </div>
                  {i < data.careerPaths.length - 1 && <div className="h-px bg-white/10" />}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Resources Section */}
        <section className="bg-white p-8 rounded-[32px] border border-[#141414]/5">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Recommended Resources</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.resources.map((res, i) => (
              <a 
                key={i} 
                href={res.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-4 rounded-2xl border border-[#141414]/5 hover:bg-[#141414] hover:text-white transition-all flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{res.name}</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-70">{res.type}</p>
                </div>
                <ExternalLink className="w-4 h-4 opacity-30 group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#F5F5F0]">
      <AnimatePresence mode="wait">
        {!strategy && !learningRoadmap ? (
          <motion.main
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto px-6 py-24"
          >
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#141414]/10 bg-white/50 text-[11px] font-medium uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    Visionary AI
                  </div>
                  <div className="flex bg-white/50 p-1 rounded-full border border-[#141414]/5">
                    <button 
                      onClick={() => setMode('product')}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all",
                        mode === 'product' ? "bg-[#141414] text-white shadow-sm" : "text-[#141414]/40 hover:text-[#141414]"
                      )}
                    >
                      Product
                    </button>
                    <button 
                      onClick={() => setMode('learning')}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all",
                        mode === 'learning' ? "bg-[#141414] text-white shadow-sm" : "text-[#141414]/40 hover:text-[#141414]"
                      )}
                    >
                      Learning
                    </button>
                  </div>
                </div>
                <h1 className="text-6xl font-medium tracking-tight leading-[0.9] serif">
                  {mode === 'product' ? (
                    <>Visionary <br /><span className="italic opacity-50">Roadmap Generator</span></>
                  ) : (
                    <>Mastery <br /><span className="italic opacity-50">Learning Path</span></>
                  )}
                </h1>
                <p className="text-lg text-[#141414]/60 max-w-xl">
                  {mode === 'product' 
                    ? "Transform your product concept into a comprehensive, forward-looking strategy."
                    : "Map out your journey to mastering any technology. From foundations to high-paying careers."
                  }
                </p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-6 bg-white p-8 rounded-[32px] shadow-sm border border-[#141414]/5">
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-widest opacity-50">
                    {mode === 'product' ? 'Product Name' : 'Technology Name'}
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder={mode === 'product' ? "e.g. Nexus Flow" : "e.g. Rust, Kubernetes, React"}
                    className="w-full px-4 py-3 rounded-xl border border-[#141414]/10 focus:outline-none focus:ring-2 focus:ring-[#141414]/5 transition-all text-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-semibold uppercase tracking-widest opacity-50">
                    {mode === 'product' ? 'Product Description & Goals' : 'Your Learning Goal'}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={mode === 'product' 
                      ? "Describe what the tool does, its target audience, and what you hope to achieve..."
                      : "e.g. I want to become a Senior DevOps Engineer and build scalable infrastructure..."
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#141414]/10 focus:outline-none focus:ring-2 focus:ring-[#141414]/5 transition-all min-h-[150px] text-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#141414] text-[#F5F5F0] py-4 rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            </div>
          </motion.main>
        ) : strategy ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-24"
          >
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#F5F5F0]/80 backdrop-blur-md border-bottom border-[#141414]/5">
              <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={reset}
                    className="p-2 hover:bg-white rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h2 className="text-xl font-medium tracking-tight">{strategy.productName}</h2>
                    <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">Strategic Roadmap</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-full border border-[#141414]/10 text-sm font-medium hover:bg-white transition-colors"
                  >
                    Export PDF
                  </button>
                  <button 
                    onClick={reset}
                    className="px-4 py-2 rounded-full bg-[#141414] text-white text-sm font-medium hover:opacity-90 transition-colors"
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
                  <div className="bg-white p-8 rounded-[32px] border border-[#141414]/5 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-[#141414]/5 rounded-lg">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Current State Analysis</h3>
                    </div>
                    <div className="prose prose-sm max-w-none text-[#141414]/80 leading-relaxed">
                      <Markdown>{strategy.currentState.analysis}</Markdown>
                    </div>
                    <div className="grid grid-cols-2 gap-8 mt-8 pt-8 border-t border-[#141414]/5">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-4">Core Strengths</h4>
                        <ul className="space-y-2">
                          {strategy.currentState.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-500 shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-4">Current Gaps</h4>
                        <ul className="space-y-2">
                          {strategy.currentState.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
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
                  <div className="bg-[#141414] text-[#F5F5F0] p-8 rounded-[32px] shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="w-5 h-5 text-white/60" />
                      <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Market Position</h3>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Key Competitors</h4>
                        <div className="flex flex-wrap gap-2">
                          {strategy.marketAnalysis.competitors.map((c, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-xs border border-white/5">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Industry Trends</h4>
                        <ul className="space-y-2">
                          {strategy.marketAnalysis.trends.map((t, i) => (
                            <li key={i} className="text-sm text-white/80 flex gap-2 italic">
                              <span className="text-white/30">—</span> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-white/10">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Differentiation Strategy</h4>
                        <p className="text-sm text-white/90 leading-relaxed">
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
                  <h3 className="text-2xl font-medium tracking-tight">Phased Roadmap</h3>
                  <div className="h-px flex-1 bg-[#141414]/5" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { phase: strategy.roadmap.shortTerm, icon: Rocket, color: 'bg-blue-50 text-blue-600' },
                    { phase: strategy.roadmap.midTerm, icon: Layout, color: 'bg-purple-50 text-purple-600' },
                    { phase: strategy.roadmap.longTerm, icon: Sparkles, color: 'bg-emerald-50 text-emerald-600' }
                  ].map(({ phase, icon: Icon, color }, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[32px] border border-[#141414]/5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <div className={cn("p-3 rounded-2xl", color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{phase.timeline}</span>
                      </div>
                      <h4 className="text-xl font-medium mb-2">{phase.title}</h4>
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {phase.focus.map((f, i) => (
                          <span key={i} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#141414]/5 opacity-60">
                            {f}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-[#141414]/70 leading-relaxed flex-1">
                        {phase.details}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Technical & UX Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-[#141414]/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-[#141414]/5 rounded-lg">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Technical Evolution</h3>
                  </div>
                  <div className="space-y-4">
                    {strategy.technicalUpgrades.map((upgrade, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-[#F5F5F0]/50 border border-[#141414]/5">
                        <div className="w-8 h-8 rounded-full bg-[#141414] text-white flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium">{upgrade}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-[#141414]/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-[#141414]/5 rounded-lg">
                      <Layout className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">UI/UX Transformation</h3>
                  </div>
                  <div className="prose prose-sm text-[#141414]/80 italic leading-relaxed">
                    <Markdown>{strategy.uxStrategy}</Markdown>
                  </div>
                  <div className="mt-8 pt-8 border-t border-[#141414]/5">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="w-5 h-5 opacity-40" />
                      <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50">Monetization Approach</h4>
                    </div>
                    <p className="text-sm font-medium">{strategy.monetization}</p>
                  </div>
                </div>
              </div>

              {/* Risks & KPIs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-[#141414]/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Risk Assessment</h3>
                  </div>
                  <div className="space-y-6">
                    {strategy.risks.map((r, i) => (
                      <div key={i} className="space-y-2">
                        <h4 className="text-sm font-bold flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-rose-500" />
                          {r.risk}
                        </h4>
                        <p className="text-xs text-[#141414]/60 ml-3">{r.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-[#141414]/5">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider text-[12px]">Success Metrics (KPIs)</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {strategy.kpis.map((kpi, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600/60 mb-1">{kpi.metric}</p>
                        <p className="text-lg font-semibold tracking-tight">{kpi.target}</p>
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
    </div>
  );
}
