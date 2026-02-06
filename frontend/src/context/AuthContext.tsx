import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { currentUser, User } from '../utils/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<boolean>;
  completeOnboarding: (data: { name: string; role: string }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => {},
  verifyOTP: async () => false,
  completeOnboarding: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (_phone: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
  }, []);

  const verifyOTP = useCallback(async (_otp: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setToken('mock-jwt-token');
    setUser(currentUser);
    setIsLoading(false);
    return true;
  }, []);

  const completeOnboarding = useCallback((data: { name: string; role: string }) => {
    if (user) {
      setUser({ ...user, name: data.name, role: data.role as User['role'] });
    }
  }, [user]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        verifyOTP,
        completeOnboarding,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
