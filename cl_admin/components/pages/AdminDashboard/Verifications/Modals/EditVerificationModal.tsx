"use client";

import type { FormEvent } from "react";
import type { VerifyStatus } from "../../types";

interface EditVerificationModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  editVerStudentId: string;
  setEditVerStudentId: (val: string) => void;
  editVerCardImageKey: string;
  setEditVerCardImageKey: (val: string) => void;
  editVerStatus: VerifyStatus;
  setEditVerStatus: (status: VerifyStatus) => void;
  editVerRejectReason: string;
  setEditVerRejectReason: (reason: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function EditVerificationModal({
  isOpen,
  closeModal,
  modalFeedback,
  editVerStudentId,
  setEditVerStudentId,
  editVerCardImageKey,
  setEditVerCardImageKey,
  editVerStatus,
  setEditVerStatus,
  editVerRejectReason,
  setEditVerRejectReason,
  onSubmit,
}: EditVerificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Sửa Yêu Cầu Xác Thực</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Mã sinh viên (Student ID UUID)
            </label>
            <input
              type="text"
              required
              value={editVerStudentId}
              onChange={(e) => setEditVerStudentId(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Ảnh Thẻ Đường dẫn (Card Image Key)
            </label>
            <input
              type="text"
              required
              value={editVerCardImageKey}
              onChange={(e) => setEditVerCardImageKey(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Trạng Thái Duyệt
            </label>
            <select
              value={editVerStatus}
              onChange={(e) => setEditVerStatus(e.target.value as VerifyStatus)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none font-mono"
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="rejected">rejected</option>
            </select>
          </div>
          {editVerStatus === "rejected" && (
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                Lý do từ chối
              </label>
              <input
                type="text"
                required
                placeholder="Nhập lý do từ chối thẻ"
                value={editVerRejectReason}
                onChange={(e) => setEditVerRejectReason(e.target.value)}
                className="w-full rounded-lg border border-cyber-alert bg-cyber-bg px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          )}
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
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
