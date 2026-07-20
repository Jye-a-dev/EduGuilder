"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";

export interface Notification {
  id: string;
  title: string;
  content: string;
  is_read: boolean;
  type: string;
  created_at: string;
}

export function useNotifications(token: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Notification[]; total: number }>("/notifications", { token });
      setNotifications(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể lấy danh sách thông báo.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const markAsRead = async (id: string) => {
    if (!token) return;
    try {
      await apiClient.patch<void>(`/notifications/${id}/read`, {}, { token });
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi đánh dấu đã đọc.");
    }
  };

  const markAllAsRead = async (userId: string) => {
    if (!token) return;
    try {
      await apiClient.post<void>("/notifications/mark-all-read", {}, { token, params: { user_id: userId } });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi đánh dấu đọc tất cả.");
    }
  };

  return {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
}
