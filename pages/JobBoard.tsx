import React, { useState, useMemo, useEffect } from 'react';
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
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  useEffect(() => {
    const saved = localStorage.getItem('saved_jobs');
    if (saved) {
      try {
        setSavedJobIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to parse saved jobs', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('saved_jobs', JSON.stringify(Array.from(savedJobIds)));
  }, [savedJobIds]);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const results = await fetchRealTimeJobs(searchQuery);
        const mappedJobs: Job[] = (results || []).map((j: any) => {
          // Normalize type casing
          let type = j.type || 'Full-time';
          if (type.toLowerCase().includes('intern')) type = 'Internship';
          else if (type.toLowerCase().includes('contract')) type = 'Contract';
          else type = 'Full-time';

          return {
            ...j,
            stack: j.stack || [],
            tags: j.tags || [],
            type: type
          };
        });

        setJobs(mappedJobs);
        setSelectedJob(mappedJobs.length > 0 ? mappedJobs[0] : null);
      } catch (err) {
        console.error('Failed to load jobs', err);
        setJobs([]);
        setSelectedJob(null);
      } finally {
        setLoading(false);
      }
    };

    const id = setTimeout(loadJobs, 500);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const toggleSave = (jobId: string) => {
    setSavedJobIds(prev => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        triggerToast('Job removed from saved');
      } else {
        next.add(jobId);
        triggerToast('Job saved successfully!');
      }
      return next;
    });
  };

  const filteredJobs = useMemo(() => {
    const sorted = [...jobs].sort((a, b) => {
      if (a.type === 'Internship' && b.type !== 'Internship') return 1;
      if (a.type !== 'Internship' && b.type === 'Internship') return -1;
      return (b.rating || 0) - (a.rating || 0);
    });

    return sorted.filter(job => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Jobs') return job.type === 'Full-time';
      if (activeFilter === 'Internships') return job.type === 'Internship';
      if (activeFilter === 'Saved') return savedJobIds.has(job.id);
      return true;
    });
  }, [jobs, activeFilter, savedJobIds]);

  const handleApply = () => {
    if (!selectedJob) return;
    if (selectedJob.applyUrl && selectedJob.applyUrl !== '#') {
      window.open(selectedJob.applyUrl, '_blank', 'noopener,noreferrer');
    } else {
      const q = encodeURIComponent(`${selectedJob.title} jobs at ${selectedJob.company}`);
      window.open(`https://www.linkedin.com/jobs/search/?keywords=${q}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-[calc(100vh-64px)]">
      <aside className="w-full md:w-[380px] lg:w-[450px] bg-[#0a0f12] border-b md:border-b-0 md:border-r border-[#1e293b] flex flex-col">
        <div className="p-4 md:p-6 border-b border-[#1e293b] space-y-3">
          <div className="flex items-center space-x-2">
            {['All', 'Jobs', 'Internships', 'Saved'].map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeFilter === f ? 'bg-primary text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => {
                const loadJobs = async () => {
                   setLoading(true);
                   try {
                     const results = await fetchRealTimeJobs(searchQuery);
                     const mappedJobs: Job[] = (results || []).map((j: any) => ({
                       ...j,
                       stack: j.stack || [],
                       tags: j.tags || [],
                       type: j.type || 'Full-time'
                     }));
                     setJobs(mappedJobs);
                     setSelectedJob(mappedJobs.length > 0 ? mappedJobs[0] : null);
                   } catch (err) {
                     setJobs([]);
                   } finally {
                     setLoading(false);
                   }
                };
                loadJobs();
              }}
              disabled={loading}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[#131b21] border border-[#1e293b] rounded-lg text-[10px] font-bold text-primary hover:border-primary/50 transition-all disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              {loading ? 'SYNCING...' : 'SYNC LIVE'}
            </button>
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
          ) : (
            filteredJobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedJob?.id === job.id ? 'bg-[#131b21] border-primary' : 'bg-[#0a0f12] border-[#1e293b] hover:border-gray-600'}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <img src={job.logo || 'https://via.placeholder.com/40'} alt={job.company} className="w-10 h-10 rounded-lg object-contain bg-white/5 p-1" />
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleSave(job.id); }}
                      className={`p-2 rounded-xl transition-all ${savedJobIds.has(job.id) ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10'}`}
                    >
                      <span className="material-symbols-outlined text-sm">{savedJobIds.has(job.id) ? 'bookmark' : 'bookmark_border'}</span>
                    </button>
                    {job.type === 'Internship' && (
                      <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-black rounded uppercase border border-green-500/20">Internship</span>
                    )}
                    {(job.id.includes('new') || Math.random() > 0.7) && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-black rounded uppercase border border-primary/20">New</span>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-white text-lg leading-tight mb-1">{job.title}</h4>
                <p className="text-sm text-gray-400 mb-4">{job.company}</p>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">{job.type === 'Internship' ? 'school' : 'location_on'}</span>
                    {job.location}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold">{job.salary}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleApply(); }}
                      className="bg-primary text-white px-6 py-2 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-lg"
                    >
                      Apply
                    </button>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5">
                    <span className="material-symbols-outlined text-primary text-[10px] fill-1">star</span>
                    <span className="text-[10px] font-black text-white">{job.rating || '4.5'}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{job.postedAt || '2d ago'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">
        {selectedJob ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-white">{selectedJob.title}</h2>
              <div className="flex gap-4">
                <button
                  onClick={() => toggleSave(selectedJob.id)}
                  className={`px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all ${savedJobIds.has(selectedJob.id) ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-[#131b21] text-gray-400 border border-[#1e293b] hover:text-white hover:border-gray-600'}`}
                >
                  <span className="material-symbols-outlined text-lg">{savedJobIds.has(selectedJob.id) ? 'bookmark' : 'bookmark_border'}</span>
                  {savedJobIds.has(selectedJob.id) ? 'Saved' : 'Save Job'}
                </button>
                <button
                  onClick={handleApply}
                  className="bg-primary text-white px-8 py-2.5 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                >
                  Apply Now
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
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
                <p className="text-gray-400 leading-relaxed text-lg">{selectedJob.description}</p>
              </section>

              <section className="space-y-4">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <span className="material-symbols-outlined text-primary mr-3">bolt</span> Required Stack
                </h4>
                <div className="flex flex-wrap gap-3">
                  {selectedJob.stack.map(s => (
                    <span key={s} className="px-5 py-2 bg-[#131b21] border border-[#1e293b] rounded-xl text-sm font-bold text-gray-300 hover:border-primary transition-all">{s}</span>
                  ))}
                </div>
              </section>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <span className="material-symbols-outlined text-5xl mb-4 opacity-50">work_outline</span>
            <p className="text-lg font-medium">Select a job or search to view details</p>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-300 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
        <div className="bg-[#131b21] border border-primary/30 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">check_circle</span>
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      </div>
    </div>
  );
};

export default JobBoard;
