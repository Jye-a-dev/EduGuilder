"use client";

import { useState, useCallback } from "react";
import type { StudentVerification, VerifyStatus } from "@/components/pages/AdminDashboard/types";

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
      const res = await fetch("http://localhost:3000/student_verifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách xác thực.");
      const json = await res.json();
      const list = json.data || [];
      setVerifications(list);
      setPendingVerificationsCount(list.filter((x: StudentVerification) => x.status === "pending").length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createVerification = async (studentId: string, cardImageKey: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch("http://localhost:3000/student_verifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        student_id: studentId,
        card_image_key: cardImageKey || "cards/student_card.jpg",
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi máy chủ khi tạo xác thực.");
    }
    await fetchVerifications();
  };

  const updateVerification = async (
    id: string,
    body: { student_id: string; card_image_key: string; status: VerifyStatus; reject_reason?: string | null }
  ) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/student_verifications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi khi cập nhật yêu cầu xác thực.");
    }
    await fetchVerifications();
  };

  const approveVerification = async (id: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/student_verifications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "approved" }),
    });
    if (!res.ok) throw new Error("Không thể duyệt yêu cầu.");
    await fetchVerifications();
  };

  const rejectVerification = async (id: string, reason: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/student_verifications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "rejected", reject_reason: reason }),
    });
    if (!res.ok) throw new Error("Không thể từ chối yêu cầu.");
    await fetchVerifications();
  };

  const deleteVerification = async (id: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/student_verifications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể xóa yêu cầu.");
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
