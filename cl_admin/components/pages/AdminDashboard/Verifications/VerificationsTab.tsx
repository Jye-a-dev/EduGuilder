"use client";

import { useState, useMemo } from "react";
import type { StudentVerification, VerifyStatus } from "../types";

type StatusFilter = "all" | VerifyStatus;

interface VerificationsTabProps {
  verifications: StudentVerification[];
  handleApproveVerification: (id: string) => void;
  handleRejectVerification: (id: string) => void;
  openEditVerification: (v: StudentVerification) => void;
  handleDeleteVerification: (id: string) => void;
  setActiveModal: (modal: "create-verification" | null) => void;
}

export default function VerificationsTab({
  verifications,
  handleApproveVerification,
  handleRejectVerification,
  openEditVerification,
  handleDeleteVerification,
  setActiveModal,
}: VerificationsTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return verifications.filter((v) => {
      const matchesSearch =
        search === "" ||
        v.student_id.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [verifications, search, statusFilter]);

  const counts = useMemo(
    () => ({
      all: verifications.length,
      pending: verifications.filter((v) => v.status === "pending").length,
      approved: verifications.filter((v) => v.status === "approved").length,
      rejected: verifications.filter((v) => v.status === "rejected").length,
    }),
    [verifications]
  );

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
            placeholder="Tìm theo ID yêu cầu hoặc Mã sinh viên..."
            className="w-full bg-cyber-card/60 border border-gray-800 rounded-lg pl-8 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-primary/60 transition-colors"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(["all", "pending", "approved", "rejected"] as const).map((s) => {
            const label: Record<typeof s, string> = {
              all: "Tất cả",
              pending: "Chờ duyệt",
              approved: "Đã duyệt",
              rejected: "Từ chối",
            };
            const active = statusFilter === s;
            const colorMap: Record<typeof s, string> = {
              all: "border-gray-600 text-gray-300 bg-gray-800/50",
              pending: "border-cyber-warning/40 text-cyber-warning bg-cyber-warning/10",
              approved: "border-cyber-success/40 text-cyber-success bg-cyber-success/10",
              rejected: "border-cyber-alert/40 text-cyber-alert bg-cyber-alert/10",
            };
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                  active
                    ? colorMap[s] + " opacity-100"
                    : "border-gray-800 text-gray-600 bg-transparent hover:border-gray-700 hover:text-gray-400"
                }`}
              >
                {label[s]}{" "}
                <span className="opacity-60">({counts[s]})</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setActiveModal("create-verification")}
          className="px-4 py-2 rounded-lg bg-linear-to-r from-cyber-primary to-cyber-cyan text-xs font-bold text-white shadow hover:opacity-90 active:scale-95 transition-all shrink-0"
        >
          <i className="fa-solid fa-plus mr-1.5" /> Tạo Mới
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-900 bg-cyber-card/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-900 bg-cyber-card/80 font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="p-4">Mã Yêu Cầu</th>
              <th className="p-4">Mã Sinh Viên</th>
              <th className="p-4">Ảnh Thẻ</th>
              <th className="p-4">Trạng Thái</th>
              <th className="p-4">Lý do từ chối</th>
              <th className="p-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/50 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">
                  {search || statusFilter !== "all"
                    ? "Không có kết quả phù hợp với bộ lọc."
                    : "Không tìm thấy yêu cầu xác thực sinh viên nào."}
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr key={v.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="p-4 font-mono text-[10px] text-gray-400 select-all">{v.id}</td>
                  <td className="p-4 font-mono text-gray-200 select-all">{v.student_id}</td>
                  <td className="p-4">
                    <span className="text-cyber-cyan hover:underline cursor-pointer flex items-center gap-1">
                      <i className="fa-solid fa-image" /> {v.card_image_key.split("/").pop()}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        v.status === "approved"
                          ? "bg-cyber-success/10 border-cyber-success/30 text-cyber-success"
                          : v.status === "rejected"
                          ? "bg-cyber-alert/10 border-cyber-alert/30 text-cyber-alert"
                          : "bg-cyber-warning/10 border-cyber-warning/30 text-cyber-warning"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-450 italic max-w-xs truncate" title={v.reject_reason || ""}>
                    {v.reject_reason || "-"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {v.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApproveVerification(v.id)}
                          className="px-2 py-1 rounded bg-cyber-success/15 border border-cyber-success/30 text-cyber-success font-bold hover:bg-cyber-success/25 transition-all"
                        >
                          Duyệt
                        </button>
                        <button
                          onClick={() => handleRejectVerification(v.id)}
                          className="px-2 py-1 rounded bg-cyber-alert/15 border border-cyber-alert/30 text-cyber-alert font-bold hover:bg-cyber-alert/25 transition-all"
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => openEditVerification(v)}
                      className="text-gray-500 hover:text-white transition-all p-1"
                      title="Sửa thông tin"
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      onClick={() => handleDeleteVerification(v.id)}
                      className="text-gray-500 hover:text-cyber-alert transition-all p-1"
                      title="Xóa yêu cầu"
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

      {/* Footer count */}
      {filtered.length > 0 && (
        <p className="text-[10px] text-gray-600 font-mono text-right">
          Hiển thị {filtered.length} / {verifications.length} kết quả
        </p>
      )}
    </div>
  );
}


