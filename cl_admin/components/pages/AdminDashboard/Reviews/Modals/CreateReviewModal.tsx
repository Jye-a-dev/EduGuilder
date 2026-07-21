"use client";

import type { FormEvent } from "react";

interface CreateReviewModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  newRevUniId: string;
  setNewRevUniId: (val: string) => void;
  newRevReviewerId: string;
  setNewRevReviewerId: (val: string) => void;
  newRevRating: number;
  setNewRevRating: (stars: number) => void;
  newRevComment: string;
  setNewRevComment: (val: string) => void;
  newRevRatings: Record<string, number>;
  setNewRevRatings: (val: Record<string, number>) => void;
  isInsider: boolean;
  setIsInsider: (val: boolean) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function CreateReviewModal({
  isOpen,
  closeModal,
  modalFeedback,
  newRevUniId,
  setNewRevUniId,
  newRevReviewerId,
  setNewRevReviewerId,
  newRevRating,
  setNewRevRating,
  newRevComment,
  setNewRevComment,
  newRevRatings,
  setNewRevRatings,
  isInsider,
  setIsInsider,
  onSubmit,
}: CreateReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Tạo Bài Đánh Giá Mới</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Trường Đại học (University ID UUID)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              value={newRevUniId}
              onChange={(e) => setNewRevUniId(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Người đánh giá (Reviewer ID UUID)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              value={newRevReviewerId}
              onChange={(e) => setNewRevReviewerId(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Số sao trung bình (1-5)
            </label>
            <select
              value={newRevRating}
              onChange={(e) => setNewRevRating(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            >
              <option value={5}>5 sao</option>
              <option value={4}>4 sao</option>
              <option value={3}>3 sao</option>
              <option value={2}>2 sao</option>
              <option value={1}>1 sao</option>
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
                  value={newRevRatings.c1 ?? 5}
                  onChange={(e) => setNewRevRatings({ ...newRevRatings, c1: Number(e.target.value) })}
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
                  value={newRevRatings.c2 ?? 5}
                  onChange={(e) => setNewRevRatings({ ...newRevRatings, c2: Number(e.target.value) })}
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
                  value={newRevRatings.c3 ?? 5}
                  onChange={(e) => setNewRevRatings({ ...newRevRatings, c3: Number(e.target.value) })}
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
                  value={newRevRatings.c4 ?? 5}
                  onChange={(e) => setNewRevRatings({ ...newRevRatings, c4: Number(e.target.value) })}
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
              Ý kiến / Đánh giá
            </label>
            <textarea
              required
              rows={3}
              placeholder="Nhập nội dung nhận xét..."
              value={newRevComment}
              onChange={(e) => setNewRevComment(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
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
              Tạo Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
