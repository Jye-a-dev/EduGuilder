"use client";

import type { FormEvent } from "react";

interface EditUniversityModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  editUniCode: string;
  setEditUniCode: (val: string) => void;
  editUniName: string;
  setEditUniName: (val: string) => void;
  editUniTuition: string;
  setEditUniTuition: (val: string) => void;
  editUniVerified: boolean;
  setEditUniVerified: (val: boolean) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function EditUniversityModal({
  isOpen,
  closeModal,
  modalFeedback,
  editUniCode,
  setEditUniCode,
  editUniName,
  setEditUniName,
  editUniTuition,
  setEditUniTuition,
  editUniVerified,
  setEditUniVerified,
  onSubmit,
}: EditUniversityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Sửa Thông Tin Trường</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Mã Code
            </label>
            <input
              type="text"
              required
              value={editUniCode}
              onChange={(e) => setEditUniCode(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Tên trường đại học
            </label>
            <input
              type="text"
              required
              value={editUniName}
              onChange={(e) => setEditUniName(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Học phí
            </label>
            <input
              type="text"
              value={editUniTuition}
              onChange={(e) => setEditUniTuition(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="editUniVerified"
              checked={editUniVerified}
              onChange={(e) => setEditUniVerified(e.target.checked)}
              className="h-4 w-4 rounded border-gray-800 bg-cyber-bg text-cyber-primary focus:ring-cyber-primary focus:outline-none"
            />
            <label htmlFor="editUniVerified" className="text-xs text-gray-400 font-mono select-none">
              Xác thực đối tác (Verified)
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
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
