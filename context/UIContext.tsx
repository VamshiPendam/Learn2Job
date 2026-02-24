import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View } from '../types';

interface UIContextType {
    activeView: View;
    setActiveView: (view: View) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeView, setActiveView] = useState<View>(View.DASHBOARD);

    return (
        <UIContext.Provider value={{ activeView, setActiveView }}>
            {children}
        </UIContext.Provider>
    );
};

export const useUI = () => {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error('useUI must be used within a UIProvider');
    }
    return context;
};
