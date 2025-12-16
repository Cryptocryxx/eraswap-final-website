import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (userId: number, username: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedUsername = localStorage.getItem("username");
    
    if (storedUserId && storedUsername) {
      setUser({
        id: parseInt(storedUserId),
        username: storedUsername
      });
    }
  }, []);

  const login = (userId: number, username: string) => {
    localStorage.setItem("userId", userId.toString());
    localStorage.setItem("username", username);
    setUser({ id: userId, username });
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
