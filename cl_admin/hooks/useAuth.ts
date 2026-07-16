import { useState } from "react";
import { apiClient } from "@/libs/apiClient";

export type UserRole = "admin" | "uni" | "student";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.post<LoginResponse>("/auth/login", { email, password });

      // Check if the user has admin role
      if (data.user.role !== "admin") {
        throw new Error("Quyền truy cập bị từ chối. Chỉ dành cho tài khoản quản trị.");
      }

      // Store authorization tokens and user data in local storage
      localStorage.setItem("admin_token", data.access_token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));
      setUser(data.user);

      return data;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Kết nối máy chủ thất bại.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setUser(null);
  };

  return {
    login,
    logout,
    isLoading,
    error,
    user,
    setError,
  };
}
