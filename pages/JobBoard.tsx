
import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { fetchRealTimeJobs } from '../services/geminiService';
import { useSearch } from '../context/SearchContext';

const JobBoard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const { searchQuery } = useSearch();

  // Load saved jobs from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('saved_jobs');
    if (saved) {
      try {
        setSavedJobIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error("Failed to parse saved jobs", e);
      }
    }
  }, []);

  // Save jobs to localStorage when changed
  React.useEffect(() => {
    localStorage.setItem('saved_jobs', JSON.stringify(Array.from(savedJobIds)));
  }, [savedJobIds]);

  // Fetch initial/search jobs
  React.useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const results = await fetchRealTimeJobs(searchQuery);
      // Map inconsistent types if any, ensuring type matching
      const mappedJobs: Job[] = results.map((j: any) => ({
        ...j,
        stack: j.stack || [],
        tags: j.tags || [],
        type: j.type || 'Full-time'
      }));

      setJobs(mappedJobs);
      if (mappedJobs.length > 0) {
        setSelectedJob(mappedJobs[0]);
      } else {
        setSelectedJob(null);
      }
      setLoading(false);
    };

    const timeoutId = setTimeout(loadJobs, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const toggleSave = (jobId: string) => {
    setSavedJobIds(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const filterMatch = activeFilter === 'All' ||
        (activeFilter === 'Jobs' && job.type === 'Full-time') ||
        (activeFilter === 'Internships' && job.type === 'Internship') ||
        (activeFilter === 'Saved' && savedJobIds.has(job.id));
      return filterMatch;
    });
  }, [jobs, activeFilter, savedJobIds]);

  const handleApply = () => {
    if (selectedJob?.applyUrl && selectedJob.applyUrl !== '#') {
      window.open(selectedJob.applyUrl, '_blank', 'noopener,noreferrer');
    } else if (selectedJob) {
      // High-quality fallback redirect
      const searchQuery = encodeURIComponent(`${selectedJob.title} jobs at ${selectedJob.company}`);
      window.open(`https://www.linkedin.com/jobs/search/?keywords=${searchQuery}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-64px)] md:md:h-[calc(100vh-80px)]">
      {/* Job List */}
      <aside className="w-full md:w-[380px] lg:w-[450px] bg-[#0a0f12] border-b md:border-b-0 md:border-r border-[#1e293b] flex flex-col max-h-[50vh] md:max-h-none">
        <div className="p-4 md:p-6 border-b border-[#1e293b] space-y-3 md:space-y-4">
          <div className="flex items-center space-x-2">
            {['All', 'Jobs', 'Internships', 'Saved'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === f ? 'bg-primary text-white shadow-[0_0_15px_rgba(17,82,212,0.3)]' : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            <span>{loading ? 'Scanning market...' : `Showing ${filteredJobs.length} opportunities`}</span>
            <span className="material-symbols-outlined text-gray-500 cursor-pointer hover:text-white text-sm">tune</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-3 text-gray-500">
              <span className="material-symbols-outlined text-3xl text-primary animate-spin">sync</span>
              <p className="text-xs">Finding best roles for you...</p>
            </div>
          ) : filteredJobs.map(job => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedJob?.id === job.id
                ? 'bg-[#131b21] border-primary shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                : 'bg-[#0a0f12] border-[#1e293b] hover:border-gray-600'
                }`}
            >
              <div className="flex items-start justify-between mb-3">
                <img src={job.logo || 'https://via.placeholder.com/40'} alt={job.company} className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1" />
                <div className="flex items-center gap-2">
                  {savedJobIds.has(job.id) && (
                    <span className="material-symbols-outlined text-primary text-sm fill-1">bookmark</span>
                  )}
                  {job.id.includes('new') && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">New</span>
                  )}
                </div>
              </div>
              <h4 className="font-bold text-white text-lg leading-tight mb-1">{job.title}</h4>
              <p className="text-sm text-gray-400 mb-4">{job.company}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">location_on</span> {job.location}
                </span>
                <span className="text-primary font-bold">{job.salary}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Job Details */}
      <main className="flex-1 overflow-y-auto bg-[#060a0d] p-4 md:p-8 lg:p-12">
        {selectedJob ? (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center space-x-4 md:space-x-6">
                <img src={selectedJob.logo || 'https://via.placeholder.com/80'} alt={selectedJob.company} className="w-20 h-20 rounded-3xl border border-[#1e293b] object-contain bg-white/5 p-2" />
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2">{selectedJob.title}</h2>
                  <p className="text-base md:text-xl text-primary font-bold">{selectedJob.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => toggleSave(selectedJob.id)}
                  className={`w-12 h-12 rounded-2xl border transition-all flex items-center justify-center ${savedJobIds.has(selectedJob.id)
                    ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(17,82,212,0.4)]'
                    : 'bg-[#131b21] border-[#1e293b] text-gray-400 hover:text-primary hover:border-primary/50'
                    }`}
                >
                  <span className={`material-symbols-outlined ${savedJobIds.has(selectedJob.id) ? 'fill-1' : ''}`}>
                    bookmark
                  </span>
                </button>
                <button className="w-12 h-12 bg-[#131b21] rounded-2xl border border-[#1e293b] text-gray-400 hover:text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">share</span>
                </button>
                <button
                  onClick={handleApply}
                  className="bg-primary text-white px-8 py-3 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              {[
                { label: 'Location', value: selectedJob.location, icon: 'location_on' },
                { label: 'Type', value: selectedJob.type, icon: 'schedule' },
                { label: 'Salary Range', value: selectedJob.salary, icon: 'payments' },
                { label: 'Posted', value: selectedJob.postedAt || 'Recently', icon: 'calendar_today' },
              ].map(item => (
                <div key={item.label} className="bg-[#131b21] p-6 rounded-2xl border border-[#1e293b] group hover:border-primary/50 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary text-sm">{item.icon}</span>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{item.label}</p>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <span className="material-symbols-outlined text-primary mr-3">subject</span> Role Overview
                </h4>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {selectedJob.description}
                </p>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <span className="material-symbols-outlined text-primary mr-3">bolt</span> Required Stack
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedJob.stack.map(s => (
                    <span key={s} className="px-5 py-2 bg-[#131b21] border border-[#1e293b] rounded-xl text-sm font-bold text-gray-300 hover:border-primary transition-all">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <span className="material-symbols-outlined text-5xl mb-4 opacity-50">work_outline</span>
            <p className="text-lg font-medium">Select a job or search to view details</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobBoard;
