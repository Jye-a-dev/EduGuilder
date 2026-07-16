"use client";

import { useState, useMemo } from "react";
import type { Account, UserRole } from "../types";

type RoleFilter = "all" | UserRole;
type StatusFilter = "all" | "active" | "deleted";

interface AccountsTabProps {
  accounts: Account[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  openEditAccount: (a: Account) => void;
  handleSoftDeleteAccount: (id: string) => void;
  handleHardDeleteAccount: (id: string) => void;
  handleRestoreAccount: (id: string) => void;
  setActiveModal: (modal: "create-account" | null) => void;
}

const ROLE_COLORS: Record<UserRole, string> = {
  admin: "bg-cyber-primary/10 border-cyber-primary/30 text-cyber-primary",
  uni: "bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan",
  student: "bg-cyber-success/10 border-cyber-success/30 text-cyber-success",
};

export default function AccountsTab({
  accounts,
  isLoading = false,
  error = null,
  onRetry,
  openEditAccount,
  handleSoftDeleteAccount,
  handleHardDeleteAccount,
  handleRestoreAccount,
  setActiveModal,
}: AccountsTabProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const matchesSearch =
        search === "" ||
        a.email.toLowerCase().includes(search.toLowerCase()) ||
        a.full_name.toLowerCase().includes(search.toLowerCase()) ||
        a.id.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || a.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "deleted" ? !!a.deleted_at : !a.deleted_at);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [accounts, search, roleFilter, statusFilter]);

  const counts = useMemo(
    () => ({
      all: accounts.length,
      admin: accounts.filter((a) => a.role === "admin").length,
      uni: accounts.filter((a) => a.role === "uni").length,
      student: accounts.filter((a) => a.role === "student").length,
      active: accounts.filter((a) => !a.deleted_at).length,
      deleted: accounts.filter((a) => !!a.deleted_at).length,
    }),
    [accounts]
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        {/* Row 1: Search + Create */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo email, họ tên hoặc User ID..."
              className="w-full bg-cyber-card/60 border border-gray-800 rounded-lg pl-8 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-primary/60 transition-colors"
            />
          </div>
          <button
            onClick={() => setActiveModal("create-account")}
            className="px-4 py-2 rounded-lg bg-linear-to-r from-cyber-primary to-cyber-cyan text-xs font-bold text-white shadow hover:opacity-90 active:scale-95 transition-all shrink-0"
          >
            <i className="fa-solid fa-plus mr-1.5" /> Tạo Mới
          </button>
        </div>

        {/* Row 2: Role filter + Status filter */}
        <div className="flex flex-wrap gap-2">
          {/* Role pills */}
          <div className="flex items-center gap-1.5">
            {(["all", "student", "uni", "admin"] as const).map((r) => {
              const label: Record<typeof r, string> = {
                all: "Tất cả",
                student: "Student",
                uni: "Uni",
                admin: "Admin",
              };
              const active = roleFilter === r;
              const colorMap: Record<typeof r, string> = {
                all: "border-gray-600 text-gray-300 bg-gray-800/50",
                student: "border-cyber-success/40 text-cyber-success bg-cyber-success/10",
                uni: "border-cyber-cyan/40 text-cyber-cyan bg-cyber-cyan/10",
                admin: "border-cyber-primary/40 text-cyber-primary bg-cyber-primary/10",
              };
              return (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                    active
                      ? colorMap[r]
                      : "border-gray-800 text-gray-600 bg-transparent hover:border-gray-700 hover:text-gray-400"
                  }`}
                >
                  {label[r]}{" "}
                  <span className="opacity-60">({r === "all" ? counts.all : counts[r]})</span>
                </button>
              );
            })}
          </div>

          {/* Separator */}
          <div className="w-px bg-gray-800 self-stretch" />

          {/* Status pills */}
          <div className="flex items-center gap-1.5">
            {(["all", "active", "deleted"] as const).map((s) => {
              const label: Record<typeof s, string> = {
                all: "Tất cả",
                active: "Hoạt động",
                deleted: "Đã xóa",
              };
              const active = statusFilter === s;
              const colorMap: Record<typeof s, string> = {
                all: "border-gray-600 text-gray-300 bg-gray-800/50",
                active: "border-cyber-success/40 text-cyber-success bg-cyber-success/10",
                deleted: "border-cyber-alert/40 text-cyber-alert bg-cyber-alert/10",
              };
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                    active
                      ? colorMap[s]
                      : "border-gray-800 text-gray-600 bg-transparent hover:border-gray-700 hover:text-gray-400"
                  }`}
                >
                  {label[s]}{" "}
                  <span className="opacity-60">({s === "all" ? counts.all : counts[s]})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-900 bg-cyber-card/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-900 bg-cyber-card/80 font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="p-4">User ID</th>
              <th className="p-4">Email</th>
              <th className="p-4">Họ tên</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Eco Points</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Ngày tạo</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/50 text-xs">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="p-4">
                      <div className="h-3 bg-gray-800 rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={8} className="p-10 text-center">
                  <div className="inline-flex flex-col items-center gap-3">
                    <i className="fa-solid fa-triangle-exclamation text-cyber-alert text-2xl" />
                    <p className="text-cyber-alert font-mono text-xs">{error}</p>
                    {onRetry && (
                      <button
                        onClick={onRetry}
                        className="px-4 py-1.5 rounded-lg border border-cyber-primary/40 text-cyber-cyan text-xs font-bold hover:bg-cyber-primary/10 transition-all"
                      >
                        <i className="fa-solid fa-rotate-right mr-1.5" /> Thử lại
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500 font-mono">
                  {search || roleFilter !== "all" || statusFilter !== "all"
                    ? "Không có kết quả phù hợp với bộ lọc."
                    : "Không tìm thấy tài khoản nào."}
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr
                  key={a.id}
                  className={`hover:bg-gray-800/20 transition-colors ${
                    a.deleted_at ? "opacity-50" : ""
                  }`}
                >
                  <td className="p-4 font-mono text-[10px] text-gray-500 select-all">{a.id}</td>
                  <td className="p-4 font-mono text-gray-200 select-all">{a.email}</td>
                  <td className="p-4 font-bold text-gray-100">{a.full_name}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${ROLE_COLORS[a.role]}`}
                    >
                      {a.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-cyber-warning font-bold">
                    {a.eco_points.toLocaleString()}
                  </td>
                  <td className="p-4">
                    {a.deleted_at ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-cyber-alert/10 border-cyber-alert/30 text-cyber-alert">
                        DELETED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border bg-cyber-success/10 border-cyber-success/30 text-cyber-success">
                        ACTIVE
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-[10px] font-mono text-gray-500">
                    {new Date(a.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="p-4 text-right space-x-1">
                    {a.deleted_at ? (
                      <button
                        onClick={() => handleRestoreAccount(a.id)}
                        className="px-2 py-1 rounded bg-cyber-success/15 border border-cyber-success/30 text-cyber-success font-bold hover:bg-cyber-success/25 transition-all"
                        title="Khôi phục tài khoản"
                      >
                        Khôi phục
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => openEditAccount(a)}
                          className="text-gray-500 hover:text-white transition-all p-1"
                          title="Chỉnh sửa"
                        >
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button
                          onClick={() => handleSoftDeleteAccount(a.id)}
                          className="text-gray-500 hover:text-cyber-warning transition-all p-1"
                          title="Vô hiệu hóa (soft delete)"
                        >
                          <i className="fa-solid fa-ban" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleHardDeleteAccount(a.id)}
                      className="text-gray-500 hover:text-cyber-alert transition-all p-1"
                      title="Xóa vĩnh viễn"
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-[10px] text-gray-600 font-mono text-right">
          Hiển thị {filtered.length} / {accounts.length} kết quả
        </p>
      )}
    </div>
  );
}

