"use client";

import type { FormEvent } from "react";

interface CreateVerificationModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  newVerStudentId: string;
  setNewVerStudentId: (val: string) => void;
  newVerCardImageKey: string;
  setNewVerCardImageKey: (val: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function CreateVerificationModal({
  isOpen,
  closeModal,
  modalFeedback,
  newVerStudentId,
  setNewVerStudentId,
  newVerCardImageKey,
  setNewVerCardImageKey,
  onSubmit,
}: CreateVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Tạo Yêu Cầu Xác Thực</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Mã sinh viên (Student ID UUID)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3fa85f64-5717-4562-b3fc-2c963f66afa6"
              value={newVerStudentId}
              onChange={(e) => setNewVerStudentId(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Ảnh Thẻ Đường dẫn (Card Image Key)
            </label>
            <input
              type="text"
              placeholder="e.g. cards/student_card.jpg"
              value={newVerCardImageKey}
              onChange={(e) => setNewVerCardImageKey(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
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
              Xác nhận
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
