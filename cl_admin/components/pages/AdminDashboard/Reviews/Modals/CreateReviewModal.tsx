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
  onSubmit,
}: CreateReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative">
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
              Số sao (1-5)
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
