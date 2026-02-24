
import React from 'react';
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
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1">
          <Header />
          <main className="ml-64 animate-in fade-in duration-700">
            <div className="min-h-[calc(100vh-80px)]">
              {renderView()}
            </div>
          </main>
        </div>

        {/* Background Decorative Elements */}
        <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 -translate-y-1/4"></div>
        <div className="fixed bottom-0 left-64 -z-10 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/4 translate-y-1/4"></div>
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
