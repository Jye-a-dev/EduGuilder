"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";

export interface StudentVerification {
  id: string;
  student_id: string;
  card_image_key: string;
  status: "pending" | "approved" | "rejected";
  reject_reason?: string | null;
  created_at: string;
}

export function useStudentVerifications(token: string | null) {
  const [verification, setVerification] = useState<StudentVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerification = useCallback(async (userId?: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: StudentVerification[]; total: number }>("/student_verifications", {
        token,
        params: userId ? { student_id: userId } : {}
      });
      if (res.data && res.data.length > 0) {
        // Sort by created_at desc to get the latest status
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setVerification(sorted[0]);
      } else {
        setVerification(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải trạng thái xác thực.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createVerification = async (studentId: string, cardImageKey: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<StudentVerification>("/student_verifications", {
        student_id: studentId,
        card_image_key: cardImageKey,
      }, { token });
      setVerification(res);
      return res;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể gửi yêu cầu xác thực.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verification,
    isLoading,
    error,
    fetchVerification,
    createVerification,
  };
}
