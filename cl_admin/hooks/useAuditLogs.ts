"use client";

import { useState, useCallback } from "react";
import type { AuditLog } from "@/components/pages/AdminDashboard/types";

export function useAuditLogs(token: string | null) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/audit_logs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải audit logs.");
      const json = await res.json();
      setAuditLogs(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    auditLogs,
    isLoading,
    error,
    fetchAuditLogs,
  };
}
