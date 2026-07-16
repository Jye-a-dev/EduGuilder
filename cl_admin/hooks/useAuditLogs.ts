"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";
import type { AuditLog } from "@/components/pages/AdminDashboard/types";

interface AuditLogsPage {
  data: AuditLog[];
  total: number;
}

export function useAuditLogs(token: string | null) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const json = await apiClient.get<AuditLogsPage>("/audit_logs", {
        token,
        params: { limit: 100 },
      });
      setAuditLogs(json.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải audit logs.");
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
