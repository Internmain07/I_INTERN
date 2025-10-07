import React, { createContext, useState, useContext, useEffect } from 'react';

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
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    role: null,
    isAuthenticated: false,
  });

  // On initial load, check localStorage for a token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token && role) {
      setAuthState({ token, role, isAuthenticated: true });
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userRole', role);
    setAuthState({ token, role, isAuthenticated: true });
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