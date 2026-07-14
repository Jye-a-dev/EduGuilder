"use client";

import type { FormEvent } from "react";

interface CreateUniversityModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  newUniCode: string;
  setNewUniCode: (val: string) => void;
  newUniName: string;
  setNewUniName: (val: string) => void;
  newUniTuition: string;
  setNewUniTuition: (val: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function CreateUniversityModal({
  isOpen,
  closeModal,
  modalFeedback,
  newUniCode,
  setNewUniCode,
  newUniName,
  setNewUniName,
  newUniTuition,
  setNewUniTuition,
  onSubmit,
}: CreateUniversityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl relative">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">Đăng Ký Trường Đại Học Mới</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Mã Code Trường
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NEU"
              value={newUniCode}
              onChange={(e) => setNewUniCode(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Tên trường đại học
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Đại Học Kinh Tế Quốc Dân"
              value={newUniName}
              onChange={(e) => setNewUniName(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Mức học phí (Tuition Fees)
            </label>
            <input
              type="text"
              placeholder="e.g. 20 - 45 triệu VND/năm"
              value={newUniTuition}
              onChange={(e) => setNewUniTuition(e.target.value)}
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
              Đăng Ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
