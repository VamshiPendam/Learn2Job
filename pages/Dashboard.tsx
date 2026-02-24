
import React, { useState, useEffect } from 'react';
import { MOCK_TOOLS, MOCK_JOBS } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { synthesizeMarketPulse } from '../services/geminiService';

const Dashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<any>({
    tools: MOCK_TOOLS.slice(0, 4),
    jobs: MOCK_JOBS.slice(0, 2),
    chartData: [
      { name: '10am', 'Image Generation': 45, 'Infrastructure': 32, 'Developer Tools': 55, 'Coding Tools': 40 },
      { name: '11am', 'Image Generation': 52, 'Infrastructure': 38, 'Developer Tools': 62, 'Coding Tools': 48 },
      { name: '12pm', 'Image Generation': 48, 'Infrastructure': 45, 'Developer Tools': 58, 'Coding Tools': 52 },
      { name: '1pm', 'Image Generation': 65, 'Infrastructure': 42, 'Developer Tools': 75, 'Coding Tools': 60 },
      { name: '2pm', 'Image Generation': 82, 'Infrastructure': 55, 'Developer Tools': 88, 'Coding Tools': 72 },
    ],
    lastSync: new Date().toLocaleTimeString()
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [liveMeta, setLiveMeta] = useState({
    activeAgents: 1284,
    computeLoad: 64,
    sentiment: 88,
    marketVolume: 14.2
  });

  // Per-second Live Meta pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMeta(prev => ({
        activeAgents: prev.activeAgents + (Math.random() > 0.5 ? 1 : -1),
        computeLoad: Math.max(10, Math.min(99, prev.computeLoad + (Math.random() - 0.5) * 4)),
        sentiment: Math.max(1, Math.min(100, prev.sentiment + (Math.random() - 0.5) * 2)),
        marketVolume: Math.max(0, prev.marketVolume + (Math.random() - 0.5) * 0.1)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await synthesizeMarketPulse();
    if (result) {
      // Transform chartData to use category names as keys
      const categories = result.tools.map((t: any) => t.category);
      const transformedChartData = result.chartData.map((point: any) => {
        const newPoint: any = { name: point.time };
        point.values.forEach((val: number, idx: number) => {
          if (categories[idx]) {
            newPoint[categories[idx]] = val;
          }
        });
        return newPoint;
      });

      setMarketData({
        tools: result.tools,
        jobs: result.jobs,
        chartData: transformedChartData,
        lastSync: new Date().toLocaleTimeString()
      });
    }
    setIsSyncing(false);
  };

  return (
    <div className="p-8 space-y-10">
      {/* Dynamic Header with Sync Action */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Market Dashboard</h2>
          <p className="text-gray-500 text-sm flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-primary'}`}></span>
            <span>Last synchronized: {marketData.lastSync}</span>
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center space-x-3 px-6 py-3 rounded-2xl font-bold transition-all ${isSyncing
            ? 'bg-[#1e293b] text-gray-500 cursor-not-allowed'
            : 'bg-primary text-white hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
            }`}
        >
          <i className={`fas fa-sync-alt ${isSyncing ? 'fa-spin' : ''}`}></i>
          <span>{isSyncing ? 'Synthesizing...' : 'Live Sync'}</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0d151c] to-[#131b21] p-12 border border-[#1e293b] shadow-2xl">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00f2ea] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-block px-3 py-1 rounded-full bg-[#00f2ea]/10 border border-[#00f2ea]/20 text-[#00f2ea] text-xs font-bold mb-6 tracking-widest uppercase">
            {isSyncing ? 'Synthesizing Market Pulse...' : 'Market Pulse Active'}
          </div>
          <h2 className="text-6xl font-extrabold text-white mb-6 leading-tight">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">AI Careers</span>
          </h2>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Real-time data synchronization with global AI trends. Discover tools and opportunities before they saturate the market.
          </p>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Trend Summary */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold flex items-center space-x-3">
              <i className="fas fa-bolt text-primary"></i>
              <span>{isSyncing ? 'Detecting Trends...' : 'Market Trend Summary'}</span>
            </h3>
          </div>

          <div className="bg-[#131b21] p-8 rounded-3xl border border-[#1e293b] relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {marketData.tools.slice(0, 4).map((tool: any, idx: number) => (
                <div key={tool.id} className="flex items-start space-x-4 group">
                  <div className="text-primary text-xl font-black opacity-20 group-hover:opacity-100 transition-opacity">0{idx + 1}</div>
                  <div>
                    <h4 className="text-white font-bold mb-1 flex items-center space-x-2">
                      <span>{tool.name}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <span className="text-[10px] text-primary uppercase tracking-widest">{tool.category}</span>
                    </h4>
                    <p className="text-gray-400 text-xs leading-relaxed mb-2">{tool.description}</p>
                    <div className="flex items-center space-x-2 text-[9px]">
                      <span className="text-gray-600 uppercase font-black">Resonance:</span>
                      <span className="text-gray-400 italic">"High adoption in {tool.tags?.[0] || 'Enterprise'} workflows"</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span>Sync Validated</span>
                </span>
                <span className="flex items-center space-x-1">
                  <i className="fas fa-brain text-[#a855f7]"></i>
                  <span>AI Synthesized</span>
                </span>
              </div>
              <p>Top {marketData.tools.length} Trends Detected</p>
            </div>
          </div>
        </div>

        {/* Market Growth Chart */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <i className="fas fa-chart-area text-primary"></i>
            <span>Demand Sync</span>
          </h3>
          <div className="bg-[#131b21] rounded-2xl border border-[#1e293b] p-6 h-[420px] relative">
            <div className="mb-6">
              <p className="text-4xl font-black text-white flex items-center space-x-3">
                <span>Live Meta</span>
                <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
              </p>
              <p className="text-sm text-gray-400 uppercase tracking-tighter">Real-Time Market Activity</p>
            </div>

            {/* Real-time stats cards */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-[#0a0f12] p-3 rounded-xl border border-[#1e293b]">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Active Agents</p>
                <p className="text-xl font-black text-white">{liveMeta.activeAgents.toLocaleString()}</p>
              </div>
              <div className="bg-[#0a0f12] p-3 rounded-xl border border-[#1e293b]">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Compute Load</p>
                <div className="flex items-end space-x-2">
                  <p className="text-xl font-black text-white">{Math.round(liveMeta.computeLoad)}%</p>
                  <div className="flex-1 h-1 bg-gray-800 rounded-full mb-1.5 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000"
                      style={{ width: `${liveMeta.computeLoad}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="bg-[#0a0f12] p-3 rounded-xl border border-[#1e293b]">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Sentiment</p>
                <p className="text-xl font-black text-[#a855f7]">{Math.round(liveMeta.sentiment)}%</p>
              </div>
              <div className="bg-[#0a0f12] p-3 rounded-xl border border-[#1e293b]">
                <p className="text-[10px] text-gray-500 font-bold uppercase">Market Vol.</p>
                <p className="text-xl font-black text-white">${liveMeta.marketVolume.toFixed(1)}B</p>
              </div>
            </div>

            <div className="h-48 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData.chartData}>
                  <defs>
                    <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    hide={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#4b5563', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#131b21', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                  />
                  {marketData.tools.map((tool: any, idx: number) => (
                    <Area
                      key={tool.category}
                      type="monotone"
                      dataKey={tool.category}
                      stroke={idx === 0 ? "#2563eb" : idx === 1 ? "#a855f7" : idx === 2 ? "#3b82f6" : "#10b981"}
                      fillOpacity={idx === 0 ? 1 : 0}
                      fill={idx === 0 ? "url(#colorInterest)" : "none"}
                      strokeWidth={idx === 0 ? 3 : 2}
                      dot={idx === 0 ? { r: 4, fill: '#2563eb' } : false}
                      animationDuration={500}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="p-4 rounded-xl bg-[#0a0f12] border border-[#1e293b]">
              <p className="text-xs text-gray-500 mb-2 uppercase font-bold flex items-center justify-between">
                <span>Category Pulse</span>
                <span className="text-[10px] py-0.5 px-2 bg-green-500/10 text-green-500 rounded-full border border-green-500/20">LIVE</span>
              </p>
              <p className="text-sm text-gray-300 leading-relaxed mb-3">
                Real-time trend analysis for <span className="text-primary font-bold">{marketData.tools[0]?.category || 'AI Tools'}</span> indicating high market resonance.
              </p>
              <div className="pt-3 border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Strategic Narrative</p>
                <p className="text-[11px] text-gray-400 italic leading-tight">
                  "The surge in {marketData.tools[0]?.category} interest suggests a pivot towards infrastructure-first AI deployment strategies for H2 2024."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Opportunities Snapshot */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold flex items-center space-x-3">
            <i className="fas fa-globe-americas text-primary"></i>
            <span>Opportunity Snapshot</span>
          </h3>
        </div>

        <div className="bg-[#131b21] p-8 rounded-3xl border border-[#1e293b] grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Skill Resonance</p>
            <div className="space-y-3">
              {(marketData.jobs[0]?.tags?.slice(0, 2) || ['Python', 'LLMs']).map((skill: string, i: number) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between text-[9px] text-gray-400 font-bold">
                    <span>{skill}</span>
                    <span>{95 - (i * 12)}% Match</span>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${95 - (i * 12)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Market Saturation</p>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[65%]"></div>
            </div>
            <p className="text-gray-400 text-[10px]">Optimal entry window detected for {marketData.jobs[0]?.location || 'Remote'} positions.</p>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-right mr-6">
              <p className="text-[10px] text-gray-500 font-bold uppercase">Average Salary Range</p>
              <p className="text-2xl font-black text-primary">{marketData.jobs[0]?.salary || '$180k - $250k'}</p>
            </div>
            <button className="bg-[#1e293b] hover:bg-primary hover:text-white text-white w-12 h-12 rounded-full transition-all flex items-center justify-center">
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
