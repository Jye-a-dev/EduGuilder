"use client";

import { useState, useCallback } from "react";
import type { Account } from "@/components/pages/AdminDashboard/types";

interface UpdateAccountBody {
  full_name?: string;
  role?: string;
  university_id?: string | null;
  current_grade?: number | null;
  eco_points?: number;
}

export function useAccounts(token: string | null) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/users?limit=100&includeDeleted=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách tài khoản.");
      const json = await res.json();
      setAccounts(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createAccount = async (
    email: string,
    fullName: string,
    password: string,
    role: string
  ) => {
    if (!token) return;
    const res = await fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, full_name: fullName, password, role }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi khi tạo tài khoản.");
    }
    await fetchAccounts();
  };

  const updateAccount = async (id: string, body: UpdateAccountBody) => {
    if (!token) return;
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi khi cập nhật tài khoản.");
    }
    await fetchAccounts();
  };

  const softDeleteAccount = async (id: string) => {
    if (!token) return;
    const res = await fetch(`http://localhost:3000/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể vô hiệu hóa tài khoản.");
    await fetchAccounts();
  };

  const hardDeleteAccount = async (id: string) => {
    if (!token) return;
    const res = await fetch(`http://localhost:3000/users/${id}?hardDelete=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể xóa tài khoản.");
    await fetchAccounts();
  };

  const restoreAccount = async (id: string) => {
    if (!token) return;
    const res = await fetch(`http://localhost:3000/users/${id}/restore`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể khôi phục tài khoản.");
    await fetchAccounts();
  };

  return {
    accounts,
    isLoading,
    error,
    fetchAccounts,
    createAccount,
    updateAccount,
    softDeleteAccount,
    hardDeleteAccount,
    restoreAccount,
  };
}
