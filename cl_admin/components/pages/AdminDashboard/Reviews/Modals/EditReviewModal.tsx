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
  onSubmit,
}: EditReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Hiệu Chỉnh Bài Đánh Giá</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Đánh giá (Số sao)
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
