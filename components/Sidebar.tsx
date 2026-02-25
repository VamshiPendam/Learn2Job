
import React from 'react';
import { View } from '../types';
import Logo from './Logo';
import { useUI } from '../context/UIContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeView, setActiveView } = useUI();

  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: 'fa-th-large' },
    { id: View.AI_TOOLS, label: 'AI Tools', icon: 'fa-rocket' },
    { id: View.JOB_BOARD, label: 'Job Board', icon: 'fa-briefcase' },
    { id: View.INSIGHTS, label: 'Market Insights', icon: 'fa-chart-line' },
    { id: View.ROADMAPS, label: 'Roadmaps', icon: 'fa-map-signs' },
  ];

  const handleNavClick = (id: View) => {
    setActiveView(id);
    onClose(); // close drawer on mobile after navigation
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen w-64
          bg-[#0a1128] border-r border-primary/20
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Header row with logo + close button (mobile) */}
        <div className="p-6 flex items-center justify-between">
          <Logo size="md" showText={true} />
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors p-1"
            onClick={onClose}
            aria-label="Close menu"
          >
            <i className="fas fa-times text-xl" />
          </button>
        </div>

        <nav className="flex-1 mt-2 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id
                  ? 'bg-[#131b21] text-primary shadow-[0_0_15px_rgba(37,99,235,0.1)]'
                  : 'text-gray-400 hover:bg-[#0f172a] hover:text-white'
                }`}
            >
              <i className={`fas ${item.icon} text-lg`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-4">
          <div className="bg-[#131b21] rounded-2xl p-4 border border-[#1e293b]">
            <p className="text-xs text-primary font-semibold mb-1">WEEKLY PULSE</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              AI job growth is up <span className="text-white font-bold">14.2%</span> this month.
            </p>
            <button className="w-full mt-4 bg-primary text-white py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-primary/20">
              Go Premium
            </button>
          </div>

          <button
            onClick={() => handleNavClick(View.PROFILE)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === View.PROFILE
                ? 'bg-[#131b21] text-primary'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            <i className="fas fa-user-circle text-lg" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
