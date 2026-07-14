"use client";

import { useState, useMemo } from "react";
import type { UniversityReview } from "../types";

type ApprovalFilter = "all" | "approved" | "pending";

interface ReviewsTabProps {
  reviews: UniversityReview[];
  handleToggleReviewApproval: (id: string, currentStatus: boolean) => void;
  openEditReview: (r: UniversityReview) => void;
  handleDeleteReview: (id: string) => void;
  setActiveModal: (modal: "create-review" | null) => void;
}

export default function ReviewsTab({
  reviews,
  handleToggleReviewApproval,
  openEditReview,
  handleDeleteReview,
  setActiveModal,
}: ReviewsTabProps) {
  const [search, setSearch] = useState("");
  const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>("all");
  const [minRating, setMinRating] = useState(1);

  const filtered = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        search === "" ||
        r.university_id.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchesApproval =
        approvalFilter === "all" ||
        (approvalFilter === "approved" ? r.is_approved : !r.is_approved);
      const matchesRating = r.rating_stars >= minRating;
      return matchesSearch && matchesApproval && matchesRating;
    });
  }, [reviews, search, approvalFilter, minRating]);

  const counts = useMemo(
    () => ({
      all: reviews.length,
      approved: reviews.filter((r) => r.is_approved).length,
      pending: reviews.filter((r) => !r.is_approved).length,
    }),
    [reviews]
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
            placeholder="Tìm theo University ID hoặc nội dung bình luận..."
            className="w-full bg-cyber-card/60 border border-gray-800 rounded-lg pl-8 pr-4 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyber-primary/60 transition-colors"
          />
        </div>

        {/* Rating filter */}
        <div className="flex items-center gap-2 shrink-0 bg-cyber-card/60 border border-gray-800 rounded-lg px-3 py-2">
          <i className="fa-solid fa-star text-cyber-warning text-[10px]" />
          <span className="text-[10px] text-gray-500 font-mono">Tối thiểu</span>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="bg-transparent text-xs text-gray-300 focus:outline-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n} className="bg-gray-900">
                {n}★
              </option>
            ))}
          </select>
        </div>

        {/* Approval Filter Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {(["all", "approved", "pending"] as const).map((s) => {
            const label: Record<typeof s, string> = {
              all: "Tất cả",
              approved: "Đã duyệt",
              pending: "Chờ duyệt",
            };
            const active = approvalFilter === s;
            const colorMap: Record<typeof s, string> = {
              all: "border-gray-600 text-gray-300 bg-gray-800/50",
              approved: "border-cyber-success/40 text-cyber-success bg-cyber-success/10",
              pending: "border-cyber-warning/40 text-cyber-warning bg-cyber-warning/10",
            };
            return (
              <button
                key={s}
                onClick={() => setApprovalFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                  active
                    ? colorMap[s]
                    : "border-gray-800 text-gray-600 bg-transparent hover:border-gray-700 hover:text-gray-400"
                }`}
              >
                {label[s]} <span className="opacity-60">({counts[s]})</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setActiveModal("create-review")}
          className="px-4 py-2 rounded-lg bg-linear-to-r from-cyber-primary to-cyber-cyan text-xs font-bold text-white shadow hover:opacity-90 active:scale-95 transition-all shrink-0"
        >
          <i className="fa-solid fa-plus mr-1.5" /> Thêm Mới
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-900 bg-cyber-card/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-900 bg-cyber-card/80 font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="p-4">Review ID</th>
              <th className="p-4">University ID</th>
              <th className="p-4">Đánh giá</th>
              <th className="p-4">Nội dung bình luận</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/50 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-mono">
                  {search || approvalFilter !== "all" || minRating > 1
                    ? "Không có kết quả phù hợp với bộ lọc."
                    : "Không tìm thấy bài viết đánh giá nào."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="hover:bg-gray-800/20 transition-colors">
                  <td className="p-4 font-mono text-[10px] text-gray-455 select-all">{r.id}</td>
                  <td className="p-4 font-mono text-gray-300 select-all">{r.university_id}</td>
                  <td className="p-4 text-cyber-warning font-bold flex items-center gap-0.5">
                    {r.rating_stars} <i className="fa-solid fa-star text-[10px]" />
                  </td>
                  <td className="p-4 max-w-sm truncate text-gray-300" title={r.comment}>
                    {r.comment}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        r.is_approved
                          ? "bg-cyber-success/10 border-cyber-success/30 text-cyber-success"
                          : "bg-cyber-warning/10 border-cyber-warning/30 text-cyber-warning"
                      }`}
                    >
                      {r.is_approved ? "APPROVED" : "PENDING"}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleReviewApproval(r.id, r.is_approved)}
                      className={`px-2 py-1 rounded font-bold transition-all border ${
                        r.is_approved
                          ? "bg-cyber-warning/15 border-cyber-warning/30 text-cyber-warning hover:bg-cyber-warning/25"
                          : "bg-cyber-success/15 border-cyber-success/30 text-cyber-success hover:bg-cyber-success/25"
                      }`}
                    >
                      {r.is_approved ? "Ẩn" : "Phê duyệt"}
                    </button>
                    <button
                      onClick={() => openEditReview(r)}
                      className="text-gray-500 hover:text-white transition-all p-1"
                      title="Xem chi tiết & Sửa"
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="text-gray-500 hover:text-cyber-alert transition-all p-1"
                      title="Xóa đánh giá"
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
          Hiển thị {filtered.length} / {reviews.length} kết quả
        </p>
      )}
    </div>
  );
}


