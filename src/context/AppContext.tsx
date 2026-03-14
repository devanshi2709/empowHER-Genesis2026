import React, { createContext, useState } from 'react';

export interface ScanResult {
  scanId: string;
  detectedIssue: string;
  confidence: 'low' | 'moderate' | 'high';
  scanType: string;
  insight: string;
  imageUrl: string;
}

interface AppContextProps {
  lastScanSessionId: string;
  setLastScanSessionId: (sessionId: string) => void;
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult) => void;
}

const AppContext = createContext<AppContextProps | null>(null);

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppContext.Provider');
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastScanSessionId, setLastScanSessionId] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  return (
    <AppContext.Provider value={{ lastScanSessionId, setLastScanSessionId, scanResult, setScanResult }}>
      {children}
    </AppContext.Provider>
  );
};