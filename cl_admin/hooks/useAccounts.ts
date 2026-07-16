"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";
import type { Account } from "@/components/pages/AdminDashboard/types";

interface UpdateAccountBody {
  full_name?: string;
  role?: string;
  university_id?: string | null;
  current_grade?: number | null;
  eco_points?: number;
}

interface AccountsPage {
  data: Account[];
  total: number;
}

export function useAccounts(token: string | null) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** Fetch ALL accounts by paginating through the server (max 100/page). */
  const fetchAccounts = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      // First page to discover total
      const first = await apiClient.get<AccountsPage>("/users", {
        token,
        params: { page: 1, limit: 100, includeDeleted: true },
      });

      const total = first.total;
      let all: Account[] = first.data;

      // Fetch remaining pages in parallel if needed
      if (total > 100) {
        const pageCount = Math.ceil(total / 100);
        const pageNums = Array.from({ length: pageCount - 1 }, (_, i) => i + 2);
        const rest = await Promise.all(
          pageNums.map((page) =>
            apiClient.get<AccountsPage>("/users", {
              token,
              params: { page, limit: 100, includeDeleted: true },
            })
          )
        );
        all = [first.data, ...rest.map((r) => r.data)].flat();
      }

      setAccounts(all);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách tài khoản.");
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
    await apiClient.post("/users", { email, full_name: fullName, password, role }, { token });
    await fetchAccounts();
  };

  const updateAccount = async (id: string, body: UpdateAccountBody) => {
    if (!token) return;
    await apiClient.patch(`/users/${id}`, body, { token });
    await fetchAccounts();
  };

  const softDeleteAccount = async (id: string) => {
    if (!token) return;
    await apiClient.delete(`/users/${id}`, { token });
    await fetchAccounts();
  };

  const hardDeleteAccount = async (id: string) => {
    if (!token) return;
    await apiClient.delete(`/users/${id}`, {
      token,
      params: { hardDelete: true },
    });
    await fetchAccounts();
  };

  const restoreAccount = async (id: string) => {
    if (!token) return;
    await apiClient.post(`/users/${id}/restore`, {}, { token });
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
