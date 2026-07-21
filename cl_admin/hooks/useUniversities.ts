"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";
import type { University } from "@/components/pages/AdminDashboard/types";

interface UniversitiesPage {
  data: University[];
  total: number;
}

export function useUniversities(token: string | null) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const json = await apiClient.get<UniversitiesPage>("/universities", {
        token,
        params: { limit: 100 },
      });
      setUniversities(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách trường.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createUniversity = async (
    code: string,
    name: string,
    tuitionFees: string,
    region?: string | null,
    websiteUrl?: string | null,
    type?: string | null
  ) => {
    if (!token) return;
    setError(null);
    await apiClient.post(
      "/universities",
      {
        code,
        name,
        tuition_fees: tuitionFees || null,
        region: region || null,
        website_url: websiteUrl || null,
        type: type || null,
      },
      { token }
    );
    await fetchUniversities();
  };

  const updateUniversity = async (id: string, body: Partial<University>) => {
    if (!token) return;
    setError(null);
    await apiClient.patch(`/universities/${id}`, body, { token });
    await fetchUniversities();
  };

  const toggleUniversityVerification = async (id: string, currentStatus: boolean) => {
    await updateUniversity(id, { is_verified: !currentStatus });
  };

  const deleteUniversity = async (id: string) => {
    if (!token) return;
    setError(null);
    await apiClient.delete(`/universities/${id}`, {
      token,
      params: { hardDelete: true },
    });
    await fetchUniversities();
  };

  return {
    universities,
    isLoading,
    error,
    fetchUniversities,
    createUniversity,
    updateUniversity,
    toggleUniversityVerification,
    deleteUniversity,
  };
}
