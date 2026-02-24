import React, { useState, useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { synthesizeMarketPulse } from '../services/geminiService';

const AnimatedStat: React.FC<{ value: string }> = ({ value }) => {
    const [displayValue, setDisplayValue] = useState('0');

    useEffect(() => {
        const match = value.match(/([^0-9.-]*)([0-9.-]+)([^0-9.]*)/);
        if (!match) {
            setDisplayValue(value);
            return;
        }

        const prefix = match[1];
        const num = parseFloat(match[2].replace(/,/g, ''));
        const suffix = match[3];

        const duration = 1500;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuad = (t: number) => t * (2 - t);
            const currentNum = num * easeOutQuad(progress);

            const decimalPlaces = match[2].includes('.') ? match[2].split('.')[1].length : 0;
            const formattedNum = currentNum.toLocaleString(undefined, {
                minimumFractionDigits: decimalPlaces,
                maximumFractionDigits: decimalPlaces
            });

            setDisplayValue(`${prefix}${formattedNum}${suffix}`);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return <span>{displayValue}</span>;
};

const Insights: React.FC = () => {
    const { searchQuery } = useSearch();
    const [pulseData, setPulseData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeRange, setTimeRange] = useState('6M');
    const [displayedMandate, setDisplayedMandate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            setDisplayedMandate('');
            try {
                const data = await synthesizeMarketPulse(searchQuery, timeRange);
                if (data) {
                    setPulseData(data);
                } else {
                    setError('Unable to fetch market data. Please try again later.');
                }
            } catch (err) {
                setError('An error occurred while fetching information.');
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchData, searchQuery ? 800 : 0);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, timeRange]);

    useEffect(() => {
        if (pulseData?.toolSpotlight?.industryNeed) {
            let i = 0;
            const fullText = pulseData.toolSpotlight.industryNeed;
            const timer = setInterval(() => {
                setDisplayedMandate(fullText.slice(0, i));
                i++;
                if (i > fullText.length) clearInterval(timer);
            }, 30);
            return () => clearInterval(timer);
        }
    }, [pulseData]);

    if (loading && !pulseData) {
        return (
            <div className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary animate-pulse">insights</span>
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-tight">Synthesizing Market Data...</h3>
                        <p className="text-slate-400 text-sm animate-pulse">Scanning AI ecosystems and tracking real-time trends{searchQuery ? ` for "${searchQuery}"` : ''}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 w-full flex items-center justify-center min-h-[60vh]">
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md">
                    <span className="material-symbols-outlined text-red-400 text-5xl mb-4">error</span>
                    <h3 className="text-xl font-bold text-white mb-2">Analysis Failed</h3>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-red-500 text-white px-6 py-2 rounded-xl font-bold">Retry Analysis</button>
                </div>
            </div>
        );
    }

    const { stats, chartData, insights, categories, cagr, toolSpotlight, bestOverallTool } = pulseData || {};

    return (
        <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 font-display animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header / Trending */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Trending Topics:</span>
                    <div className="flex gap-2">
                        {['Sora', 'Claude 3.5', 'Devin', 'Llama 3'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 bg-primary/10 p-1 rounded-xl border border-primary/20">
                    {['3M', '6M', '1Y'].map(range => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === range
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                {bestOverallTool && (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-500 text-sm font-bold shadow-lg shadow-yellow-500/5 animate-pulse">
                        <span className="material-symbols-outlined text-sm">workspace_premium</span>
                        Market Choice: {bestOverallTool}
                    </div>
                )}
                {searchQuery && (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-xl text-primary text-sm font-bold">
                        <span className="material-symbols-outlined text-sm">search</span>
                        Filtered by: {searchQuery}
                    </div>
                )}
            </div>

            {/* Tool Spotlight / Detailed View */}
            {toolSpotlight && (
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-primary/5 border border-primary/30 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="grid grid-cols-1 lg:grid-cols-3">
                            {/* Left Column - Core Info */}
                            <div className="p-8 bg-primary/10 border-b lg:border-b-0 lg:border-r border-primary/20">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">{toolSpotlight.name}</h2>
                                        <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded uppercase tracking-widest">{toolSpotlight.category}</span>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Diagnostic Score</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-primary">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <span key={i} className={`material-symbols-outlined text-sm ${i < parseInt(toolSpotlight.rating) ? 'fill-1' : ''}`}>star</span>
                                                ))}
                                            </div>
                                            <span className="text-white font-bold">{toolSpotlight.rating}/5</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Pricing Model</p>
                                        <p className="text-white font-bold flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary text-sm">payments</span>
                                            {toolSpotlight.pricing}
                                        </p>
                                    </div>
                                    <button onClick={() => window.open(toolSpotlight.website, '_blank')} className="w-full bg-primary text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                        Visit Official Website
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right Column - Deep Insights */}
                            <div className="lg:col-span-2 p-8 space-y-8">
                                <div>
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                        Executive Summary
                                    </h4>
                                    <p className="text-slate-400 leading-relaxed italic border-l-2 border-primary/30 pl-4">
                                        {toolSpotlight.description}
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-primary/10">
                                    <h4 className="text-primary font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-sm">hub</span>
                                        Industry Mandate
                                    </h4>
                                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 min-h-[80px]">
                                        <p className="text-white text-sm leading-relaxed">
                                            {displayedMandate}
                                            <span className="inline-block w-1.5 h-4 bg-primary ml-1 animate-pulse"></span>
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                                        <span className="material-symbols-outlined text-sm">groups</span>
                                        Competitive Landscape
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {toolSpotlight.competitors.map((comp: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-400 text-xs font-medium">
                                                {comp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-lg shadow-primary/5 group hover:border-primary/50 transition-all">
                    <p className="text-sm text-slate-400 mb-1">Market Cap Influence</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">
                            <AnimatedStat value={stats?.marketCap || "$0"} />
                        </h3>
                        <span className="text-sm font-medium flex items-center text-primary">
                            <span className="material-symbols-outlined text-xs">arrow_upward</span>
                            <AnimatedStat value={stats?.marketCapGrowth || "0%"} />
                        </span>
                    </div>
                </div>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-lg shadow-primary/5 group hover:border-primary/50 transition-all">
                    <p className="text-sm text-slate-400 mb-1">Active AI Solutions</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">
                            <AnimatedStat value={stats?.activeTools || "0"} />
                        </h3>
                        <span className="text-sm font-medium flex items-center text-primary">
                            <span className="material-symbols-outlined text-xs">add</span>
                            <AnimatedStat value={stats?.weeklyNewTools || "0"} /> /wk
                        </span>
                    </div>
                </div>
                <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 shadow-lg shadow-primary/5 group hover:border-primary/50 transition-all">
                    <p className="text-sm text-slate-400 mb-1">{stats?.fundingLabel}</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold text-white">
                            <AnimatedStat value={stats?.avgFunding || "$0"} />
                        </h3>
                        <span className="text-primary text-sm font-medium flex items-center">
                            <span className="material-symbols-outlined text-xs">trending_up</span> Peak
                        </span>
                    </div>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Market Overview Chart */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                    <section className="bg-primary/5 rounded-xl border border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
                        <div className="p-6 border-b border-primary/20 flex justify-between items-center bg-primary/10">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {toolSpotlight ? `${toolSpotlight.name} Sentiment & Growth` : 'Market Sentiment & Growth'}
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {toolSpotlight ? `Adoption trajectory for ${toolSpotlight.name}` : 'Monthly Projection based on current pulse'}
                                </p>
                            </div>
                            <div className="bg-primary px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(17,82,212,0.4)]">
                                <span className="text-white text-sm font-bold tracking-tight">{cagr} Rate</span>
                            </div>
                        </div>
                        <div className="relative h-[400px] w-full p-6 bg-gradient-to-b from-primary/5 to-transparent">
                            {/* Chart Placeholder Graphic */}
                            <div className="absolute inset-x-6 bottom-16 h-64 flex items-end justify-between px-4">
                                {chartData?.map((data: any, i: number) => (
                                    <div
                                        key={i}
                                        style={{ height: `${data.growth}%` }}
                                        className="w-[10%] bg-primary/30 rounded-t-lg relative group transition-all duration-1000"
                                    >
                                        <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-[#131b21]/95 backdrop-blur-md border border-primary/30 text-white px-3 py-2 rounded-xl text-xs font-bold opacity-0 group-hover:opacity-100 group-hover:-top-24 transition-all pointer-events-none z-20 shadow-xl whitespace-nowrap flex flex-col items-center min-w-[100px]">
                                            <span className="text-primary text-[9px] uppercase tracking-widest leading-none mb-1">{data.label} ({data.demandTrend})</span>
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="material-symbols-outlined text-[10px] text-yellow-500 fill-1">star</span>
                                                <span className="text-white">Rate: {data.timeRate}/5</span>
                                            </div>
                                            <span className="text-white text-[12px]">{data.growth}% Growth</span>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#131b21] border-b border-r border-primary/30 rotate-45"></div>
                                        </div>
                                        <div className={`absolute inset-0 rounded-t-lg transition-colors cursor-pointer border-x border-t
                                ${data.demandTrend === 'increasing' ? 'bg-primary/20 border-primary/40 group-hover:bg-primary/50' :
                                                data.demandTrend === 'decreasing' ? 'bg-red-500/20 border-red-500/40 group-hover:bg-red-500/50' :
                                                    'bg-slate-500/20 border-slate-500/40 group-hover:bg-slate-500/50'}`}>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Trend Line */}
                            <svg className="absolute inset-x-6 bottom-16 h-64 w-[calc(100%-48px)] overflow-visible" preserveAspectRatio="none">
                                <path
                                    d="M 20 200 Q 150 180 300 120 T 750 40"
                                    fill="none"
                                    stroke="#1152d4"
                                    strokeLinecap="round"
                                    strokeWidth="4"
                                    className="drop-shadow-[0_0_8px_#1152d4] animate-[draw_2s_ease-out]"
                                ></path>
                                <circle cx="750" cy="40" fill="#1152d4" r="6" className="animate-pulse shadow-[0_0_15px_#1152d4]"></circle>
                            </svg>
                            {/* Labels */}
                            <div className="absolute bottom-6 inset-x-6 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4">
                                {chartData?.map((data: any) => <span key={data.month}>{data.month}</span>)}
                            </div>
                        </div>
                    </section>

                    {/* Key Industry Insights */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                            <span className="material-symbols-outlined text-primary">auto_awesome</span>
                            Real-time AI Insights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {insights?.map((insight: any, i: number) => (
                                <div key={i} className="p-5 bg-primary/5 rounded-xl border border-primary/20 hover:border-primary transition-all group cursor-pointer shadow-lg shadow-primary/5 hover:shadow-primary/10">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] uppercase font-bold tracking-wider text-primary px-2 py-0.5 bg-primary/10 rounded">
                                            {insight.tag}
                                        </span>
                                        <span className="text-xs text-slate-500">{insight.time}</span>
                                    </div>
                                    <h4 className="font-bold mb-2 text-white group-hover:text-primary transition-colors leading-snug">
                                        {insight.title}
                                    </h4>
                                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                        {insight.content}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Categories & Market Share */}
                <aside className="lg:col-span-4 space-y-6">
                    <section className="bg-primary/5 rounded-xl border border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
                        <div className="p-6 border-b border-primary/20 bg-primary/10">
                            <h2 className="text-lg font-bold text-white">Market Distribution</h2>
                        </div>
                        <div className="divide-y divide-primary/10">
                            {categories?.map((cat: any, i: number) => (
                                <div key={i} className="p-4 hover:bg-primary/10 transition-colors cursor-pointer group relative">
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/90 text-white text-[10px] font-black px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-90 group-hover:scale-100 z-10 border border-white/20 whitespace-nowrap">
                                        <AnimatedStat value={cat.growth} /> YEARLY GROWTH
                                    </div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-sm text-slate-200">{cat.name}</span>
                                        <span className="text-xs font-bold text-primary">
                                            <AnimatedStat value={cat.growth} />
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary shadow-[0_0_10px_#1152d4] transition-all duration-1000 ease-out"
                                                style={{ width: `${cat.percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-slate-400 w-8">
                                            <AnimatedStat value={`${cat.percentage}%`} />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-primary/10 text-center">
                            <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline hover:text-white transition-colors">Analyze Full Spectrum</button>
                        </div>
                    </section>

                    {/* Top Growing Tools */}
                    <section className="bg-primary/5 rounded-xl border border-primary/20 overflow-hidden shadow-xl shadow-primary/5">
                        <div className="p-6 border-b border-primary/20 bg-primary/10 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">trending_up</span>
                            <h2 className="text-lg font-bold text-white">Top Growing Tools</h2>
                        </div>
                        <div className="p-4 space-y-4">
                            {pulseData?.growingTools?.map((tool: any, i: number) => (
                                <div key={i} className="group p-3 bg-white/5 rounded-xl border border-white/10 hover:border-primary/50 transition-all hover:bg-primary/5">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-white group-hover:text-primary transition-colors">{tool.name}</h4>
                                        <span className="text-xs font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20 shadow-sm shadow-primary/10">
                                            <AnimatedStat value={tool.growth} />
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-1 group-hover:line-clamp-none transition-all">{tool.reason}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Discovery Card */}
                    <div className="bg-gradient-to-br from-primary to-blue-800 rounded-xl p-6 text-white relative overflow-hidden group shadow-2xl shadow-primary/20 border border-primary/30">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2">Deep-Dive Analysis</h3>
                            <p className="text-sm text-white/80 mb-4">Request a customized PDF report for these search results powered by AI.</p>
                            <button className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-lg group-hover:scale-105 transition-transform">
                                Generate Report
                            </button>
                        </div>
                        <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-white/10 text-9xl rotate-12 transition-transform duration-700 group-hover:rotate-45 group-hover:scale-110">analytics</span>
                    </div>
                </aside>
            </div>
        </div >
    );
};

export default Insights;
