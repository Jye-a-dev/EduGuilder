"use client";

import { useEffect } from "react";
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import { useDashboard } from "@/components/layouts/(dashboard)/DashboardContext";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import AuditLogsTab from "./AuditLogsTab";

function AuditLogsInner() {
  const { token } = useDashboard();
  const { auditLogs, isLoading, error, fetchAuditLogs } = useAuditLogs(token);

  useEffect(() => {
    fetchAuditLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return <AuditLogsTab auditLogs={auditLogs} isLoading={isLoading} error={error} onRetry={fetchAuditLogs} />;
}

export default function AuditLogsPage() {
  return (
    <DashboardSetup>
      <AuditLogsInner />
    </DashboardSetup>
  );
}
