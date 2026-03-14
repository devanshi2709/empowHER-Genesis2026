import React, { createContext, useState } from 'react';

interface AppContextProps {
  setLastScanSessionId: (sessionId: string) => void;
  // other properties
}

const AppContext = createContext<AppContextProps | null>(null);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within a AppContext.Provider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastScanSessionId, setLastScanSessionId] = useState('');

  // other state and logic

  return (
    <AppContext.Provider value={{ setLastScanSessionId, /* other properties */ }}>
      {children}
    </AppContext.Provider>
  );
};