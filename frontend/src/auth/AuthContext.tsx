import React, { createContext, useState, useContext } from 'react';

interface AuthState {
  token: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (token: string, role: string) => void;
  logout: () => void;
}

// 1. Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  // Helper to normalize backend role values to frontend role keys
  const normalizeRole = (rawRole: string | null): string | null => {
    if (!rawRole) return null;
    const r = rawRole.toLowerCase();
    if (r === 'student' || r === 'intern') return 'intern';
    if (r === 'employer' || r === 'company') return 'company';
    if (r === 'admin') return 'admin';
    return null;
  };

  // Initialize state from localStorage immediately to prevent logout flash
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('authToken');
    const rawRole = localStorage.getItem('userRole');
    const role = rawRole ? normalizeRole(rawRole) : null;
    if (token && role) {
      return { token, role, isAuthenticated: true };
    }
    return { token: null, role: null, isAuthenticated: false };
  });

  const login = (token: string, role: string) => {
    const normalized = normalizeRole(role) || '';
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', normalized);
    setAuthState({ token, role: normalized || null, isAuthenticated: true });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    setAuthState({ token: null, role: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};