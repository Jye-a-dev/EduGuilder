"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";

// Custom API Hooks
import { useAuditLogs } from "@/hooks/useAuditLogs";

// Sub-components
import AuditLogsTab from "./AuditLogsTab";

export default function AuditLogsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Bind Hook
  const { auditLogs, fetchAuditLogs } = useAuditLogs(token);

  // Authenticate user on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      router.push("/");
      return;
    }
    setTimeout(() => {
      setToken(storedToken);
    }, 0);
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchAuditLogs();
    }
  }, [token, fetchAuditLogs]);

  return (
    <DashboardSetup>
      <AuditLogsTab auditLogs={auditLogs} />
    </DashboardSetup>
  );
}
