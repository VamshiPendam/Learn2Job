import React from 'react';
import { useSearch } from '../context/SearchContext';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { View } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const { user, logout } = useAuth();
  const { setActiveView } = useUI();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setActiveView(View.ROADMAPS);
    }
  };

  return (
    <header className="h-16 md:h-20 border-b border-[#1e293b] bg-[#0a0f12]/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-10 md:pl-64">
      {/* Left: Hamburger + Search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Hamburger - mobile only */}
        <button
          className="md:hidden text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <i className="fas fa-bars text-xl" />
        </button>

        {/* Search bar */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search tools, jobs, skills..."
            className="w-full bg-[#131b21] border border-[#1e293b] rounded-full py-2 pl-9 pr-4 text-sm text-gray-300 focus:outline-none focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications + User + Logout */}
      <div className="flex items-center space-x-3 md:space-x-6 ml-3">
        {/* Bell - hidden on very small screens */}
        <button className="hidden sm:block relative text-gray-400 hover:text-white transition-colors">
          <i className="far fa-bell text-xl" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full border-2 border-[#0a0f12]" />
        </button>

        {/* User info - text hidden on small screens */}
        <div className="flex items-center space-x-2 md:space-x-3 pl-3 md:pl-6 border-l border-[#1e293b]">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold text-white">{user?.username || 'Guest'}</p>
            <p className="text-[10px] text-primary font-bold tracking-wider uppercase">{user?.email || 'Welcome'}</p>
          </div>
          <img
            src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=0D8ABC&color=fff`}
            alt="User"
            className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-[#1e293b] object-cover flex-shrink-0"
          />
        </div>

        <button
          onClick={logout}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-semibold text-sm transition-all group"
          title="Logout"
        >
          <i className="fas fa-sign-out-alt group-hover:translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
