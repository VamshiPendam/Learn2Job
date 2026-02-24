import React from 'react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { View } from '../types';

const Header: React.FC = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, logout } = useAuth();
  const { setActiveView } = useUI();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setActiveView(View.ROADMAPS);
    }
  };

  return (
    <header className="h-20 border-b border-[#1e293b] bg-[#0a0f12]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 ml-64">
      <div className="relative w-96">
        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search tools, jobs, or skills..."
          className="w-full bg-[#131b21] border border-[#1e293b] rounded-full py-2.5 pl-12 pr-4 text-sm text-gray-300 focus:outline-none focus:border-primary transition-all"
        />
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-gray-400 hover:text-white transition-colors">
          <i className="far fa-bell text-xl"></i>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-[#0a0f12]"></span>
        </button>

        <div className="flex items-center space-x-3 pl-6 border-l border-[#1e293b]">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">{user?.username || 'Guest'}</p>
            <p className="text-[10px] text-primary font-bold tracking-wider uppercase">{user?.email || 'Welcome'}</p>
          </div>
        </div>
        <img
          src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0D8ABC&color=fff`}
          alt="User"
          className="w-10 h-10 rounded-xl border border-[#1e293b] object-cover"
        />

        <button
          onClick={logout}
          className="ml-4 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-semibold text-sm transition-all flex items-center space-x-2 group"
          title="Logout"
        >
          <i className="fas fa-sign-out-alt group-hover:translate-x-0.5 transition-transform"></i>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
