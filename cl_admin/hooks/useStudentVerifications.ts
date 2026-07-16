"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";
import type { StudentVerification, VerifyStatus } from "@/components/pages/AdminDashboard/types";

interface VerificationsPage {
  data: StudentVerification[];
  total: number;
}

export function useStudentVerifications(token: string | null) {
  const [verifications, setVerifications] = useState<StudentVerification[]>([]);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVerifications = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const json = await apiClient.get<VerificationsPage>("/student_verifications", {
        token,
        params: { limit: 100 },
      });
      const list = json.data || [];
      setVerifications(list);
      setPendingVerificationsCount(
        list.filter((x: StudentVerification) => x.status === "pending").length
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách xác thực.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createVerification = async (studentId: string, cardImageKey: string) => {
    if (!token) return;
    setError(null);
    await apiClient.post(
      "/student_verifications",
      { student_id: studentId, card_image_key: cardImageKey || "cards/student_card.jpg" },
      { token }
    );
    await fetchVerifications();
  };

  const updateVerification = async (
    id: string,
    body: { student_id: string; card_image_key: string; status: VerifyStatus; reject_reason?: string | null }
  ) => {
    if (!token) return;
    setError(null);
    await apiClient.patch(`/student_verifications/${id}`, body, { token });
    await fetchVerifications();
  };

  const approveVerification = async (id: string) => {
    if (!token) return;
    setError(null);
    await apiClient.patch(`/student_verifications/${id}`, { status: "approved" }, { token });
    await fetchVerifications();
  };

  const rejectVerification = async (id: string, reason: string) => {
    if (!token) return;
    setError(null);
    await apiClient.patch(
      `/student_verifications/${id}`,
      { status: "rejected", reject_reason: reason },
      { token }
    );
    await fetchVerifications();
  };

  const deleteVerification = async (id: string) => {
    if (!token) return;
    setError(null);
    await apiClient.delete(`/student_verifications/${id}`, { token });
    await fetchVerifications();
  };

  return {
    verifications,
    pendingVerificationsCount,
    isLoading,
    error,
    fetchVerifications,
    createVerification,
    updateVerification,
    approveVerification,
    rejectVerification,
    deleteVerification,
  };
}
