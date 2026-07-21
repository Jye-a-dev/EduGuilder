"use client";

import type { FormEvent } from "react";

interface EditReviewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  editRevRating: number;
  setEditRevRating: (stars: number) => void;
  editRevComment: string;
  setEditRevComment: (val: string) => void;
  editRevOfficialReply: string;
  setEditRevOfficialReply: (val: string) => void;
  editRevIsApproved: boolean;
  setEditRevIsApproved: (val: boolean) => void;
  editRevRatings: Record<string, number | boolean>;
  setEditRevRatings: (val: Record<string, number | boolean>) => void;
  isInsider: boolean;
  setIsInsider: (val: boolean) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function EditReviewModal({
  isOpen,
  closeModal,
  modalFeedback,
  editRevRating,
  setEditRevRating,
  editRevComment,
  setEditRevComment,
  editRevOfficialReply,
  setEditRevOfficialReply,
  editRevIsApproved,
  setEditRevIsApproved,
  editRevRatings,
  setEditRevRatings,
  isInsider,
  setIsInsider,
  onSubmit,
}: EditReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Hiệu Chỉnh Bài Đánh Giá</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Đánh giá trung bình (Số sao)
            </label>
            <select
              value={editRevRating}
              onChange={(e) => setEditRevRating(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none font-mono"
            >
              <option value={5}>5 Sao</option>
              <option value={4}>4 Sao</option>
              <option value={3}>3 Sao</option>
              <option value={2}>2 Sao</option>
              <option value={1}>1 Sao</option>
            </select>
          </div>

          {/* Ratings criteria inputs & Role toggle */}
          <div className="rounded-lg border border-gray-800 bg-cyber-bg/50 p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <span className="block text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                Đối tượng đánh giá
              </span>
              <div className="flex items-center gap-1 bg-gray-900 p-0.5 rounded-lg border border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsInsider(true)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                    isInsider
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Insider (Sinh viên)
                </button>
                <button
                  type="button"
                  onClick={() => setIsInsider(false)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase transition-all ${
                    !isInsider
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Outsider (Học sinh)
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[8px] font-mono text-gray-600 uppercase mb-0.5">
                  {isInsider ? "Đào tạo" : "Thương hiệu"}
                </label>
                <select
                  value={Number(editRevRatings.c1 ?? 5)}
                  onChange={(e) => setEditRevRatings({ ...editRevRatings, c1: Number(e.target.value) })}
                  className="w-full rounded bg-cyber-bg border border-gray-800 px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyber-primary"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[8px] font-mono text-gray-600 uppercase mb-0.5">
                  {isInsider ? "Cơ sở vật chất" : "Học phí"}
                </label>
                <select
                  value={Number(editRevRatings.c2 ?? 5)}
                  onChange={(e) => setEditRevRatings({ ...editRevRatings, c2: Number(e.target.value) })}
                  className="w-full rounded bg-cyber-bg border border-gray-800 px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyber-primary"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[8px] font-mono text-gray-600 uppercase mb-0.5">
                  {isInsider ? "Giảng viên" : "Khuôn viên"}
                </label>
                <select
                  value={Number(editRevRatings.c3 ?? 5)}
                  onChange={(e) => setEditRevRatings({ ...editRevRatings, c3: Number(e.target.value) })}
                  className="w-full rounded bg-cyber-bg border border-gray-800 px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyber-primary"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[8px] font-mono text-gray-600 uppercase mb-0.5">
                  {isInsider ? "Đời sống" : "Đầu vào"}
                </label>
                <select
                  value={Number(editRevRatings.c4 ?? 5)}
                  onChange={(e) => setEditRevRatings({ ...editRevRatings, c4: Number(e.target.value) })}
                  className="w-full rounded bg-cyber-bg border border-gray-800 px-2 py-1 text-[11px] text-white focus:outline-none focus:border-cyber-primary"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Bình luận học sinh
            </label>
            <textarea
              required
              rows={3}
              value={editRevComment}
              onChange={(e) => setEditRevComment(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Phản hồi chính thức (Official Reply)
            </label>
            <input
              type="text"
              placeholder="Nhập phản hồi ban giám hiệu..."
              value={editRevOfficialReply}
              onChange={(e) => setEditRevOfficialReply(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editRevIsApproved"
              checked={editRevIsApproved}
              onChange={(e) => setEditRevIsApproved(e.target.checked)}
              className="h-4 w-4 rounded border-gray-800 bg-cyber-bg text-cyber-primary focus:ring-cyber-primary focus:outline-none"
            />
            <label htmlFor="editRevIsApproved" className="text-xs text-gray-400 font-mono select-none">
              Phê duyệt bài viết (Hiển thị công khai)
            </label>
          </div>
          {modalFeedback && <p className="text-[10px] font-mono text-cyber-alert">{modalFeedback}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-lg bg-gray-900 border border-gray-800 text-xs font-bold text-gray-400 hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-linear-to-r from-cyber-primary to-cyber-cyan text-xs font-bold text-white"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
