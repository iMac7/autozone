// contexts/AppContext.tsx
import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

export type AuthType = 'builder' | 'onboarding' | 'account_manager' | null;

interface AppContextType {
  authState: boolean;
  setAuthState: Dispatch<SetStateAction<boolean>>;
  authType: AuthType;
  setAuthType: Dispatch<SetStateAction<AuthType>>;
  loggedInAccount: string|null;
  setLoggedInAccount: Dispatch<SetStateAction<string|null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState(false);
  const [authType, setAuthType] = useState<AuthType>(null);
  const [loggedInAccount, setLoggedInAccount] = useState<string|null>(null)

  const value: AppContextType = {
    authState,
    setAuthState,
    authType,
    setAuthType,
    loggedInAccount,
    setLoggedInAccount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};