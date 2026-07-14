"use client";

import { useState, useCallback } from "react";
import type { University } from "@/components/pages/AdminDashboard/types";

export function useUniversities(token: string | null) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/universities", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách trường.");
      const json = await res.json();
      setUniversities(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createUniversity = async (code: string, name: string, tuitionFees: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch("http://localhost:3000/universities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        code,
        name,
        tuition_fees: tuitionFees || null,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi khi tạo trường đại học.");
    }
    await fetchUniversities();
  };

  const updateUniversity = async (id: string, body: Partial<University>) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/universities/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi khi cập nhật trường.");
    }
    await fetchUniversities();
  };

  const toggleUniversityVerification = async (id: string, currentStatus: boolean) => {
    await updateUniversity(id, { is_verified: !currentStatus });
  };

  const deleteUniversity = async (id: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/universities/${id}?hardDelete=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      throw new Error("Không thể xóa trường đại học.");
    }
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
