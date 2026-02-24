import React from 'react';
import { useAuth } from '../context/AuthContext';
import LandingPage from '../pages/LandingPage';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#060a0d]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00f2ea]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
