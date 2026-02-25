
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { UIProvider, useUI } from './context/UIContext';
import { SearchProvider } from './context/SearchContext';
import ProtectedRoute from './components/ProtectedRoute';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Roadmaps from './pages/Roadmaps';
import ToolDiscovery from './pages/ToolDiscovery';
import JobBoard from './pages/JobBoard';
import Insights from './pages/Insights';
import Profile from './pages/Profile';

const AuthenticatedApp: React.FC = () => {
  const { activeView, setActiveView } = useUI();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderView = () => {
    switch (activeView) {
      case View.DASHBOARD:
        return <Dashboard />;
      case View.ROADMAPS:
        return <Roadmaps />;
      case View.AI_TOOLS:
        return <ToolDiscovery />;
      case View.JOB_BOARD:
        return <JobBoard />;
      case View.INSIGHTS:
        return <Insights />;
      case View.PROFILE:
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background-dark text-[#e2e8f0]">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content area - offset by sidebar on md+ screens */}
        <div className="flex-1 min-w-0 md:ml-64">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="animate-in fade-in duration-700">
            <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)]">
              {renderView()}
            </div>
          </main>
        </div>

        {/* Background decorative elements */}
        <div className="fixed top-0 right-0 -z-10 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4" />
        <div className="fixed bottom-0 left-0 md:left-64 -z-10 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4" />
      </div>
    </ProtectedRoute>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <UIProvider>
          <AuthenticatedApp />
        </UIProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
