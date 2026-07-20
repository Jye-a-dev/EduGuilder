"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";

export interface UniversityAdmission {
  id: string;
  university_id: string;
  year: number;
  major_code: string;
  major_name: string;
  quota: number;
  benchmark_score: number;
  group_code: string;
  created_at: string;
}

export function useUniversityAdmissions(token: string | null) {
  const [admissions, setAdmissions] = useState<UniversityAdmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdmissions = useCallback(async (universityId?: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: UniversityAdmission[]; total: number }>("/university_admissions", {
        token,
        params: universityId ? { university_id: universityId } : {}
      });
      setAdmissions(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách chỉ tiêu tuyển sinh.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    admissions,
    isLoading,
    error,
    fetchAdmissions,
  };
}
