"use client";

import { useState } from "react";
import { apiClient } from "@/libs/apiClient";
import { useAuthContext, type User } from "@/components/providers/AuthProvider";

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: saveAuthSession, logout: clearAuthSession } = useAuthContext();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.post<AuthResponse>("/auth/login", { email, password });
      
      if (data.user.role === "admin") {
        throw new Error("Tài khoản quản trị không thể đăng nhập tại phân hệ người dùng.");
      }

      saveAuthSession(data.access_token, data.user);
      return data.user;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Đăng nhập thất bại.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: {
    email: string;
    password: string;
    full_name: string;
    role?: "student" | "uni";
    university_id?: string;
    current_grade?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.post<AuthResponse>("/auth/register", {
        ...payload,
        role: payload.role || "student",
      });

      saveAuthSession(data.access_token, data.user);
      return data.user;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Đăng ký thất bại.";
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    register,
    logout: clearAuthSession,
    isLoading,
    error,
    setError,
  };
}
