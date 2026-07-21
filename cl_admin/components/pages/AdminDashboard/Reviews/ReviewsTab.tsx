"use client";

import { useState, useMemo } from "react";
import type { UniversityReview, University, Account } from "../types";

type ApprovalFilter = "all" | "approved" | "pending";

interface ReviewsTabProps {
  reviews: UniversityReview[];
  universities?: University[];
  accounts?: Account[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  handleToggleReviewApproval: (id: string, currentStatus: boolean) => void;
  openEditReview: (r: UniversityReview) => void;
  handleDeleteReview: (id: string) => void;
  setActiveModal: (modal: "create-review" | null) => void;
}

function renderParsedComment(comment: string) {
  const isInsider = comment.includes("--- ĐÁNH GIÁ NGƯỜI TRONG CUỘC ---");
  const isOutsider = comment.includes("--- ĐÁNH GIÁ NGƯỜI NGOÀI CUỘC ---");

  if (!isInsider && !isOutsider) {
    const textOnly = comment.replace(/<[^>]*>/g, "");
    return <span className="text-gray-300 wrap-break-word line-clamp-3" title={textOnly}>{textOnly}</span>;
  }

  const lines = comment.split("\n");
  const detailStartIdx = lines.findIndex((l) => l.includes("Nội dung chi tiết:"));
  
  const ratingLines = lines.filter((l) => l.includes("- ") && l.includes("/5"));
  const rawDetailedText = detailStartIdx !== -1 ? lines.slice(detailStartIdx + 1).join("\n").trim() : "";
  const detailedText = rawDetailedText.replace(/<[^>]*>/g, "").trim();

  return (
    <div className="space-y-1.5 py-1">
      {/* Type badge */}
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono font-black uppercase border ${
        isInsider 
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
      }`}>
        {isInsider ? "Insider Review 🎓" : "Outsider Review 👁️"}
      </span>

      {/* Ratings grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9px] text-gray-500 font-mono">
        {ratingLines.map((line, idx) => {
          const cleanLine = line.replace(/<[^>]*>/g, "").replace("- ", "").trim();
          const [crit, val] = cleanLine.split(":");
          return (
            <div key={idx} className="flex items-center justify-between border-b border-gray-800/25 pb-0.5">
              <span className="truncate max-w-27.5" title={crit}>{crit}</span>
              <span className="text-amber-500 font-bold ml-1 shrink-0">{val?.trim()}</span>
            </div>
          );
        })}
      </div>

      {/* Detailed comment text */}
      {detailedText && (
        <p className="text-[10px] text-gray-300 italic line-clamp-2 mt-1" title={detailedText}>
          &quot;{detailedText}&quot;
        </p>
      )}
    </div>
  );
}

export default function ReviewsTab({
  reviews,
  universities = [],
  accounts = [],
  isLoading = false,
  error = null,
  onRetry,
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
      const uni = universities.find((u) => u.id === r.university_id);
      const acc = accounts.find((a) => a.id === r.reviewer_id);

      const matchesSearch =
        search === "" ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase()) ||
        r.university_id.toLowerCase().includes(search.toLowerCase()) ||
        (uni && uni.name.toLowerCase().includes(search.toLowerCase())) ||
        (uni && uni.code.toLowerCase().includes(search.toLowerCase())) ||
        (acc && acc.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (acc && acc.email.toLowerCase().includes(search.toLowerCase()));

      const matchesApproval =
        approvalFilter === "all" ||
        (approvalFilter === "approved" ? r.is_approved : !r.is_approved);
      const matchesRating = r.rating_stars >= minRating;
      return matchesSearch && matchesApproval && matchesRating;
    });
  }, [reviews, search, approvalFilter, minRating, universities, accounts]);

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
            placeholder="Tìm theo tên trường, mã trường, reviewer, hoặc nội dung..."
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
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all cursor-pointer ${
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
          className="px-4 py-2 rounded-lg bg-linear-to-r from-cyber-primary to-cyber-cyan text-xs font-bold text-white shadow hover:opacity-90 active:scale-95 transition-all shrink-0 cursor-pointer"
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
              <th className="p-4">Trường đại học</th>
              <th className="p-4">Người đánh giá</th>
              <th className="p-4">Đánh giá</th>
              <th className="p-4">Nội dung bình luận</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-900/50 text-xs">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 7 }).map((__, j) => (
                    <td key={j} className="p-4"><div className="h-3 bg-gray-800 rounded w-3/4" /></td>
                  ))}
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={7} className="p-10 text-center">
                  <div className="inline-flex flex-col items-center gap-3">
                    <i className="fa-solid fa-triangle-exclamation text-cyber-alert text-2xl" />
                    <p className="text-cyber-alert font-mono text-xs">{error}</p>
                    {onRetry && (
                      <button onClick={onRetry} className="px-4 py-1.5 rounded-lg border border-cyber-primary/40 text-cyber-cyan text-xs font-bold hover:bg-cyber-primary/10 transition-all cursor-pointer">
                        <i className="fa-solid fa-rotate-right mr-1.5" /> Thử lại
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500 font-mono">
                  {search || approvalFilter !== "all" || minRating > 1
                    ? "Không có kết quả phù hợp với bộ lọc."
                    : "Không tìm thấy bài viết đánh giá nào."}
                </td>
              </tr>
            ) : (
              filtered.map((r) => {
                const uni = universities.find((u) => u.id === r.university_id);
                const acc = accounts.find((a) => a.id === r.reviewer_id);

                return (
                  <tr key={r.id} className="hover:bg-gray-800/20 transition-colors">
                    {/* Review ID */}
                    <td className="p-4 font-mono text-[10px] text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <span className="select-all" title={r.id}>
                          {r.id.substring(0, 8)}...
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(r.id);
                          }}
                          className="text-gray-600 hover:text-gray-400 p-0.5 cursor-pointer"
                          title="Sao chép ID"
                        >
                          <i className="fa-regular fa-copy text-[10px]" />
                        </button>
                      </div>
                    </td>

                    {/* University Info */}
                    <td className="p-4">
                      <div className="max-w-40">
                        <span className="block font-bold text-gray-200 text-xs">
                          {uni ? uni.code : "---"}
                        </span>
                        <span className="block text-[10px] text-gray-500 truncate" title={uni ? uni.name : ""}>
                          {uni ? uni.name : r.university_id}
                        </span>
                      </div>
                    </td>

                    {/* Reviewer Info */}
                    <td className="p-4">
                      <div className="max-w-40">
                        <span className="block font-semibold text-gray-200 text-xs">
                          {acc ? acc.full_name : "---"}
                        </span>
                        <span className="block text-[10px] text-gray-500 font-mono truncate" title={acc ? acc.email : ""}>
                          {acc ? acc.email : r.reviewer_id}
                        </span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-500 font-mono font-bold w-fit">
                        <span>{r.rating_stars}</span>
                        <i className="fa-solid fa-star text-[9px]" />
                      </div>
                    </td>

                    {/* Comment Content */}
                    <td className="p-4 max-w-sm">
                      {renderParsedComment(r.comment)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black font-mono border ${
                          r.is_approved
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${r.is_approved ? "bg-emerald-400" : "bg-amber-400"}`} />
                        {r.is_approved ? "APPROVED" : "PENDING"}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleReviewApproval(r.id, r.is_approved)}
                          className={`px-2.5 py-1.5 rounded font-bold transition-all border text-[10px] cursor-pointer ${
                            r.is_approved
                              ? "bg-amber-500/15 border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
                              : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                          }`}
                        >
                          {r.is_approved ? "Ẩn" : "Phê duyệt"}
                        </button>
                        <button
                          onClick={() => openEditReview(r)}
                          className="w-7 h-7 rounded border border-gray-800 bg-cyber-card/40 flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
                          title="Xem chi tiết & Sửa"
                        >
                          <i className="fa-solid fa-pen text-[10px]" />
                        </button>
                        <button
                          onClick={() => handleDeleteReview(r.id)}
                          className="w-7 h-7 rounded border border-red-500/10 bg-red-500/5 flex items-center justify-center text-gray-600 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer"
                          title="Xóa đánh giá"
                        >
                          <i className="fa-solid fa-trash-can text-[10px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
