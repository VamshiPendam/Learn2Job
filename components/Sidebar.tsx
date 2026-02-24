
import React from 'react';
import { View } from '../types';
import Logo from './Logo';
import { useUI } from '../context/UIContext';

const Sidebar: React.FC = () => {
  const { activeView, setActiveView } = useUI();

  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'fa-th-large' },
    { id: View.AI_TOOLS, label: 'AI Tools', icon: 'fa-rocket' },
    { id: View.JOB_BOARD, label: 'Job Board', icon: 'fa-briefcase' },
    { id: View.INSIGHTS, label: 'Market Insights', icon: 'fa-chart-line' },
    { id: View.ROADMAPS, label: 'Roadmaps', icon: 'fa-map-signs' },
  ];

  return (
    <aside className="w-64 bg-[#0a1128] border-r border-primary/20 flex flex-col h-screen fixed left-0 top-0 z-20">
      <div className="p-8 flex justify-start">
        <Logo size="md" showText={true} />
      </div>

      <nav className="flex-1 mt-4 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id
              ? 'bg-[#131b21] text-primary shadow-[0_0_15px_rgba(37,99,235,0.1)]'
              : 'text-gray-400 hover:bg-[#0f172a] hover:text-white'
              }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 space-y-4">
        <div className="bg-[#131b21] rounded-2xl p-4 border border-[#1e293b]">
          <p className="text-xs text-primary font-semibold mb-1">WEEKLY PULSE</p>
          <p className="text-sm text-gray-300 leading-relaxed">AI job growth is up <span className="text-white font-bold">14.2%</span> this month.</p>
          <button className="w-full mt-4 bg-primary text-white py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20">
            Go Premium
          </button>
        </div>

        <button
          onClick={() => setActiveView(View.PROFILE)}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === View.PROFILE ? 'bg-[#131b21] text-primary' : 'text-gray-400 hover:text-white'
            }`}
        >
          <i className="fas fa-user-circle text-lg"></i>
          <span className="font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
