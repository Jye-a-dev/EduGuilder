"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "uni" | "student";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  university_id?: string | null;
  current_grade?: number | null;
  eco_points: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("user_token");
    const storedUser = localStorage.getItem("user_profile");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setTimeout(() => {
          setToken(storedToken);
          setUser(parsedUser);
          setIsLoading(false);
        }, 0);
        return;
      } catch {
        // Clear corrupted storage
        localStorage.removeItem("user_token");
        localStorage.removeItem("user_profile");
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 0);
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("user_token", newToken);
    localStorage.setItem("user_profile", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_profile");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
