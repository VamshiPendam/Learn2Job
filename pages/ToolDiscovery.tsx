
import React, { useState, useEffect, useMemo } from 'react';
import { useSearch } from '../context/SearchContext';
import { MOCK_TOOLS } from '../data/mockData';
import { fetchLatestAITools } from '../services/geminiService';
import { AITool } from '../types';

const ToolDiscovery: React.FC = () => {
   const [tools, setTools] = useState<AITool[]>(MOCK_TOOLS);
   const [selectedCategory, setSelectedCategory] = useState('All');
   const [selectedPricing, setSelectedPricing] = useState<string[]>([]);
   const [isSyncing, setIsSyncing] = useState(false);
   const [lastSync, setLastSync] = useState<string | null>(null);
   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
   const [sortBy, setSortBy] = useState<'Trending' | 'Top Rated' | 'Newest'>('Trending');
   const [isSortOpen, setIsSortOpen] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [syncError, setSyncError] = useState<string | null>(null);
   const { searchQuery } = useSearch();
   const pageSize = 8;

   const categories = ['All', 'LLM & Chat', 'Image Generation', 'Video Synthesis', 'Audio & Voice', 'Coding Tools', 'Infrastructure', 'Developer Tools', 'Data Science'];
   const pricingOptions = [
      { label: 'Free Tools', value: 'Free' },
      { label: 'Freemium', value: 'Freemium' },
      { label: 'Enterprise / Paid', value: 'Paid' }
   ];

   const handleSync = async () => {
      setIsSyncing(true);
      setSyncError(null);
      try {
         const newTools = await fetchLatestAITools();
         if (newTools && newTools.length > 0) {
            setTools(newTools);
            setLastSync(new Date().toLocaleTimeString());
            setCurrentPage(1);
         } else if (newTools === null) {
            setSyncError("Live market data temporarily unavailable (Quota reached). Showing published database.");
         }
      } catch (err) {
         setSyncError("Failed to sync live data. Please try again later.");
      }
      setIsSyncing(false);
   };

   useEffect(() => {
      // Initial sync
      handleSync();
   }, []);

   const togglePricing = (value: string) => {
      setSelectedPricing(prev =>
         prev.includes(value)
            ? prev.filter(p => p !== value)
            : [...prev, value]
      );
   };

   const sortedAndFilteredTools = useMemo(() => {
      let result = [...tools].filter(tool => {
         const categoryMatch = selectedCategory === 'All' || tool.category === selectedCategory;
         const pricingMatch = selectedPricing.length === 0 || selectedPricing.includes(tool.pricing);

         const searchLower = searchQuery.toLowerCase();
         const searchMatch = searchQuery === '' ||
            tool.name.toLowerCase().includes(searchLower) ||
            tool.description.toLowerCase().includes(searchLower) ||
            tool.tags.some(tag => tag.toLowerCase().includes(searchLower));

         return categoryMatch && pricingMatch && searchMatch;
      });

      if (sortBy === 'Top Rated') {
         result.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'Newest') {
         result.reverse();
      }

      return result;
   }, [tools, selectedCategory, selectedPricing, sortBy, searchQuery]);

   const paginatedTools = useMemo(() => {
      const start = (currentPage - 1) * pageSize;
      return sortedAndFilteredTools.slice(start, start + pageSize);
   }, [sortedAndFilteredTools, currentPage, pageSize]);

   const totalPages = Math.ceil(sortedAndFilteredTools.length / pageSize);

   useEffect(() => {
      setCurrentPage(1);
   }, [selectedCategory, selectedPricing, sortBy, searchQuery]);

   return (
      <div className="flex h-[calc(100vh-80px)]">
         {/* Category Sidebar */}
         <aside className="w-64 bg-[#0a0f12] border-r border-[#1e293b] p-6 space-y-8 overflow-y-auto">
            <div className="space-y-4">
               <p className="text-[10px] text-[#00f2ea] font-black tracking-widest uppercase">Categories</p>
               <div className="space-y-1">
                  {categories.map(c => (
                     <button
                        key={c}
                        onClick={() => setSelectedCategory(c)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedCategory === c ? 'bg-[#131b21] text-[#00f2ea]' : 'text-gray-500 hover:text-white'
                           }`}
                     >
                        {c}
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-4">
               <p className="text-[10px] text-gray-500 font-black tracking-widest uppercase">Pricing</p>
               <div className="space-y-3">
                  {pricingOptions.map(p => (
                     <label
                        key={p.value}
                        className="flex items-center space-x-3 group cursor-pointer"
                        onClick={() => togglePricing(p.value)}
                     >
                        <div className={`w-5 h-5 rounded border transition-colors flex items-center justify-center ${selectedPricing.includes(p.value) ? 'border-[#00f2ea] bg-[#00f2ea]/10' : 'border-[#1e293b] group-hover:border-[#00f2ea]'
                           }`}>
                           <i className={`fas fa-check text-[10px] text-[#00f2ea] transition-opacity ${selectedPricing.includes(p.value) ? 'opacity-100' : 'opacity-0'
                              }`}></i>
                        </div>
                        <span className={`text-sm transition-colors ${selectedPricing.includes(p.value) ? 'text-white font-bold' : 'text-gray-400 group-hover:text-white'
                           }`}>{p.label}</span>
                     </label>
                  ))}
               </div>
            </div>

            <div className="space-y-4 pt-8">
               <div className="p-4 rounded-2xl bg-[#131b21] border border-[#1e293b] space-y-3">
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Auto Update</p>
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-400">Hourly Sync</span>
                     <div className="w-8 h-4 bg-[#00f2ea] rounded-full relative">
                        <div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full"></div>
                     </div>
                  </div>
                  <p className="text-[9px] text-gray-600 italic">Next update in 54 mins</p>
               </div>

               <button
                  onClick={handleSync}
                  disabled={isSyncing}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center space-x-3 ${isSyncing
                     ? 'bg-[#131b21] text-gray-500 cursor-not-allowed border border-[#1e293b]'
                     : 'bg-[#00f2ea] text-[#060a0d] hover:scale-[1.02] shadow-[0_0_20px_rgba(0,242,234,0.2)]'
                     }`}
               >
                  <i className={`fas fa-sync-alt ${isSyncing ? 'fa-spin' : ''}`}></i>
                  <span>{isSyncing ? 'Syncing...' : 'Force Live Sync'}</span>
               </button>
            </div>
         </aside>

         {/* Main Grid */}
         <main className="flex-1 bg-[#060a0d] p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center space-x-4">
                  <h2 className="text-2xl font-black text-white">AI Index</h2>
                  <div className="px-3 py-1 bg-[#131b21] rounded-full border border-[#1e293b] text-[10px] font-bold text-gray-500 uppercase">
                     Showing {sortedAndFilteredTools.length} tools
                  </div>
                  {lastSync && (
                     <span className="text-[10px] text-gray-600 flex items-center space-x-1">
                        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                        <span>Synced: {lastSync}</span>
                     </span>
                  )}
                  {syncError && (
                     <span className="text-[10px] text-amber-500 flex items-center space-x-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        <i className="fas fa-exclamation-triangle text-[8px]"></i>
                        <span>{syncError}</span>
                     </span>
                  )}
               </div>

               <div className="flex-1 max-w-md mx-8">
                  {/* Local search removed in favor of global top search bar */}
               </div>

               <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-[#131b21] p-1.5 rounded-xl border border-[#1e293b]">
                     <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'text-[#00f2ea] bg-[#0a0f12] border border-white/5 shadow-lg' : 'text-gray-500 hover:text-white'}`}
                     >
                        <i className="fas fa-th-large"></i>
                     </button>
                     <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'text-[#00f2ea] bg-[#0a0f12] border border-white/5 shadow-lg' : 'text-gray-500 hover:text-white'}`}
                     >
                        <i className="fas fa-list"></i>
                     </button>
                  </div>
                  {/* Sort Dropdown */}
                  <div className="relative">
                     <div
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="bg-[#131b21] px-4 py-2 rounded-xl border border-[#1e293b] text-sm text-gray-400 flex items-center space-x-2 cursor-pointer hover:border-[#00f2ea]/50 transition-all select-none"
                     >
                        <span>Sort: <span className="text-white font-bold">{sortBy}</span></span>
                        <i className={`fas fa-chevron-down text-[10px] transition-transform ${isSortOpen ? 'rotate-180' : ''}`}></i>
                     </div>

                     {isSortOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#131b21] border border-[#1e293b] rounded-2xl shadow-2xl py-2 z-[100] backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
                           {(['Trending', 'Top Rated', 'Newest'] as const).map((option) => (
                              <button
                                 key={option}
                                 onClick={() => {
                                    setSortBy(option);
                                    setIsSortOpen(false);
                                 }}
                                 className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-all hover:bg-white/5 ${sortBy === option ? 'text-[#00f2ea]' : 'text-gray-400'
                                    }`}
                              >
                                 {option}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </div>

            {viewMode === 'grid' ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedTools.map(tool => (
                     <div key={tool.id} className="bg-[#131b21] border border-[#1e293b] rounded-3xl p-6 group hover:border-[#00f2ea]/40 transition-all flex flex-col h-full relative overflow-hidden">
                        {/* Glass overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00f2ea]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="flex items-start justify-between mb-6 relative z-10">
                           <div className="w-14 h-14 rounded-2xl bg-[#0a0f12] border border-[#1e293b] flex items-center justify-center text-[#00f2ea] text-2xl group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(0,242,234,0.3)] transition-all">
                              <i className={`fas ${tool.icon || 'fa-brain'}`}></i>
                           </div>
                           <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                              <i className="fas fa-star text-yellow-500 text-[10px]"></i>
                              <span className="text-xs font-black text-white">{tool.rating}</span>
                           </div>
                        </div>

                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-[#00f2ea] transition-colors relative z-10">{tool.name}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3 relative z-10">{tool.description}</p>

                        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                           <span className="px-2 py-0.5 bg-[#00f2ea]/10 border border-[#00f2ea]/20 rounded-md text-[9px] font-black text-[#00f2ea] uppercase tracking-tighter">
                              {tool.category}
                           </span>
                           {tool.tags.map(t => (
                              <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                 {t}
                              </span>
                           ))}
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5 relative z-10">
                           <div className="flex flex-col">
                              <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Pricing</span>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${tool.pricing === 'Free' ? 'text-green-500' : tool.pricing === 'Freemium' ? 'text-blue-400' : 'text-purple-400'
                                 }`}>{tool.pricing}</span>
                           </div>
                           <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white text-xs font-bold hover:text-[#00f2ea] flex items-center space-x-2 p-2 hover:bg-white/5 rounded-lg transition-all"
                           >
                              <span>View Tool</span>
                              <i className="fas fa-chevron-right text-[8px]"></i>
                           </a>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="flex flex-col space-y-4">
                  {paginatedTools.map(tool => (
                     <div key={tool.id} className="bg-[#131b21] border border-[#1e293b] rounded-2xl p-4 group hover:border-[#00f2ea]/40 transition-all flex items-center space-x-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00f2ea]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                        <div className="w-16 h-16 rounded-xl bg-[#0a0f12] border border-[#1e293b] flex-shrink-0 flex items-center justify-center text-[#00f2ea] text-2xl group-hover:shadow-[0_0_15px_rgba(0,242,234,0.3)] transition-all">
                           <i className={`fas ${tool.icon || 'fa-brain'}`}></i>
                        </div>

                        <div className="flex-1 min-w-0">
                           <div className="flex items-center space-x-3 mb-1">
                              <h4 className="text-lg font-bold text-white group-hover:text-[#00f2ea] transition-colors truncate">{tool.name}</h4>
                              <div className="flex items-center space-x-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                                 <i className="fas fa-star text-yellow-500 text-[8px]"></i>
                                 <span className="text-[10px] font-black text-white">{tool.rating}</span>
                              </div>
                           </div>
                           <p className="text-gray-400 text-sm line-clamp-1">{tool.description}</p>
                        </div>

                        <div className="hidden lg:flex flex-col items-start w-32 flex-shrink-0">
                           <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Category</span>
                           <span className="px-2 py-0.5 bg-[#00f2ea]/10 border border-[#00f2ea]/20 rounded-md text-[9px] font-black text-[#00f2ea] uppercase truncate max-w-full">
                              {tool.category}
                           </span>
                        </div>

                        <div className="hidden xl:flex flex-wrap gap-2 max-w-xs flex-shrink-0">
                           {tool.tags.slice(0, 3).map(t => (
                              <span key={t} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                 {t}
                              </span>
                           ))}
                        </div>

                        <div className="flex flex-col items-center w-24 flex-shrink-0">
                           <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mb-1">Pricing</span>
                           <span className={`text-[10px] font-black uppercase tracking-widest ${tool.pricing === 'Free' ? 'text-green-500' : tool.pricing === 'Freemium' ? 'text-blue-400' : 'text-purple-400'
                              }`}>{tool.pricing}</span>
                        </div>

                        <a
                           href={tool.url}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="bg-[#1e293b] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#00f2ea] hover:text-[#060a0d] transition-all flex items-center space-x-2"
                        >
                           <span>View</span>
                           <i className="fas fa-external-link-alt text-[10px]"></i>
                        </a>
                     </div>
                  ))}
               </div>
            )}

            {sortedAndFilteredTools.length === 0 && (
               <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#131b21] flex items-center justify-center text-gray-600 text-3xl mb-6 border border-[#1e293b]">
                     <i className="fas fa-search"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No tools found</h3>
                  <p className="text-gray-500 max-w-xs">
                     {searchQuery
                        ? `No tools match "${searchQuery}". Try different keywords or check your filters.`
                        : "Adjust your filters or try syncing latest data from the market."}
                  </p>
                  {searchQuery && (
                     <p className="mt-6 text-[#00f2ea] text-sm font-bold">
                        Use the top search bar to refine keywords
                     </p>
                  )}
               </div>
            )}

            {/* Pagination */}
            {sortedAndFilteredTools.length > pageSize && (
               <div className="flex items-center justify-center space-x-2 mt-12 pb-8">
                  <button
                     onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                     disabled={currentPage === 1}
                     className={`w-10 h-10 rounded-xl bg-[#131b21] flex items-center justify-center transition-colors ${currentPage === 1 ? 'text-gray-700 cursor-not-allowed' : 'text-gray-500 hover:text-white'}`}
                  >
                     <i className="fas fa-chevron-left text-xs"></i>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                     <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                           ? 'bg-[#00f2ea] text-[#060a0d]'
                           : 'bg-[#131b21] text-gray-400 hover:bg-[#1e293b]'
                           }`}
                     >
                        {page}
                     </button>
                  ))}

                  <button
                     onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                     disabled={currentPage === totalPages}
                     className={`w-10 h-10 rounded-xl bg-[#131b21] flex items-center justify-center transition-colors ${currentPage === totalPages ? 'text-gray-700 cursor-not-allowed' : 'text-gray-500 hover:text-white'}`}
                  >
                     <i className="fas fa-chevron-right text-xs"></i>
                  </button>
               </div>
            )}
         </main>
      </div>
   );
};

export default ToolDiscovery;
