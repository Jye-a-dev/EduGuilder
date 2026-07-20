"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";

export interface University {
  id: string;
  code: string;
  name: string;
  region: string;
  tuition_fees?: string;
  is_verified: boolean;
}

export function useUniversities(token: string | null) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [singleUniversity, setSingleUniversity] = useState<University | null>(null);
  const [universitiesCount, setUniversitiesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: University[]; total: number }>("/universities", { token });
      setUniversities(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách trường đại học.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchUniversityById = useCallback(async (id: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<University>(`/universities/${id}`, { token });
      setSingleUniversity(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải thông tin trường đại học.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const updateUniversity = async (id: string, payload: Partial<University>) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const updated = await apiClient.patch<University>(`/universities/${id}`, payload, { token });
      setSingleUniversity(updated);
      setUniversities(prev => prev.map(u => u.id === id ? updated : u));
      return updated;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật thông tin trường.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUniversitiesCount = useCallback(async () => {
    if (!token) return;
    try {
      const { count } = await apiClient.get<{ count: number }>("/universities/count", { token });
      setUniversitiesCount(count);
    } catch (err: unknown) {
      console.error("Lỗi khi tải số lượng trường đại học:", err);
    }
  }, [token]);

  return {
    universities,
    singleUniversity,
    universitiesCount,
    isLoading,
    error,
    fetchUniversities,
    fetchUniversityById,
    updateUniversity,
    fetchUniversitiesCount,
  };
}
