import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'creator' | 'doer';

interface AppContextType {
  currentRole: Role;
  toggleRole: () => void;
  setRole: (role: Role) => void;
  location: { latitude: number; longitude: number; address: string } | null;
  setLocation: (loc: { latitude: number; longitude: number; address: string }) => void;
}

const AppContext = createContext<AppContextType>({
  currentRole: 'doer',
  toggleRole: () => {},
  setRole: () => {},
  location: null,
  setLocation: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<Role>('doer');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>({
    latitude: 12.9352,
    longitude: 77.6245,
    address: 'Koramangala, Bangalore',
  });

  const toggleRole = () => {
    setCurrentRole((prev) => (prev === 'doer' ? 'creator' : 'doer'));
  };

  const setRole = (role: Role) => setCurrentRole(role);

  return (
    <AppContext.Provider value={{ currentRole, toggleRole, setRole, location, setLocation }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
