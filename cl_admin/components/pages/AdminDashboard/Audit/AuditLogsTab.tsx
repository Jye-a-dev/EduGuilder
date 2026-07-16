"use client";

import { useState, useMemo } from "react";
import type { AuditLog } from "../types";

interface AuditLogsTabProps {
  auditLogs: AuditLog[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function AuditLogsTab({ auditLogs, isLoading = false, error = null, onRetry }: AuditLogsTabProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  // Collect unique action types from data for the filter dropdown
  const actionOptions = useMemo(() => {
    const actions = Array.from(new Set(auditLogs.map((l) => l.action))).sort();
    return actions;
  }, [auditLogs]);

  const filtered = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        search === "" ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.entity_name.toLowerCase().includes(search.toLowerCase()) ||
        (log.ip_address ?? "").toLowerCase().includes(search.toLowerCase()) ||
        log.id.toLowerCase().includes(search.toLowerCase());
      const matchesAction = actionFilter === "all" || log.action === actionFilter;
      return matchesSearch && matchesAction;
    });
  }, [auditLogs, search, actionFilter]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo action, entity, IP hoặc Log ID..."
            className="w-full bg-cyber-card/60 border border-gray-800 rounded-lg pl-8 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-primary/60 transition-colors"
          />
        </div>

        {/* Action type filter */}
        <div className="flex items-center gap-2 shrink-0 bg-cyber-card/60 border border-gray-800 rounded-lg px-3 py-2">
          <i className="fa-solid fa-filter text-gray-500 text-[10px]" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer min-w-35"
          >
            <option value="all" className="bg-gray-900">
              Tất cả hành động
            </option>
            {actionOptions.map((action) => (
              <option key={action} value={action} className="bg-gray-900">
                {action}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-900 bg-cyber-card/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-900 bg-cyber-card/80 font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="p-4">Log ID</th>
              <th className="p-4">Hành động</th>
              <th className="p-4">Thực thể</th>
              <th className="p-4">IP Address</th>
              <th className="p-4">Thời Gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/50 text-xs font-mono">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="p-4"><div className="h-3 bg-gray-800 rounded w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <div className="inline-flex flex-col items-center gap-3">
                    <i className="fa-solid fa-triangle-exclamation text-cyber-alert text-2xl" />
                    <p className="text-cyber-alert font-mono text-xs">{error}</p>
                    {onRetry && (
                      <button onClick={onRetry} className="px-4 py-1.5 rounded-lg border border-cyber-primary/40 text-cyber-cyan text-xs font-bold hover:bg-cyber-primary/10 transition-all">
                        <i className="fa-solid fa-rotate-right mr-1.5" /> Thử lại
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-mono">
                  {search || actionFilter !== "all"
                    ? "Không có kết quả phù hợp với bộ lọc."
                    : "Không tìm thấy nhật ký sự kiện nào."}
                </td>
              </tr>
            ) : (
              filtered.map((log) => (
                <tr key={log.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="p-4 text-[10px] text-gray-500 select-all">{log.id}</td>
                  <td className="p-4 font-bold text-cyber-cyan">{log.action}</td>
                  <td className="p-4 text-gray-300">{log.entity_name}</td>
                  <td className="p-4 text-gray-400">{log.ip_address || "local"}</td>
                  <td className="p-4 text-gray-450 text-[10px]">
                    {new Date(log.created_at).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-[10px] text-gray-600 font-mono text-right">
          Hiển thị {filtered.length} / {auditLogs.length} kết quả
        </p>
      )}
    </div>
  );
}

