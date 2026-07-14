"use client";

import type { FormEvent } from "react";
import type { UserRole } from "../../types";

interface EditAccountModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  editFullName: string;
  setEditFullName: (v: string) => void;
  editRole: UserRole;
  setEditRole: (v: UserRole) => void;
  editEcoPoints: number;
  setEditEcoPoints: (v: number) => void;
  editUniversityId: string;
  setEditUniversityId: (v: string) => void;
  editCurrentGrade: string;
  setEditCurrentGrade: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function EditAccountModal({
  isOpen,
  closeModal,
  modalFeedback,
  editFullName,
  setEditFullName,
  editRole,
  setEditRole,
  editEcoPoints,
  setEditEcoPoints,
  editUniversityId,
  setEditUniversityId,
  editCurrentGrade,
  setEditCurrentGrade,
  onSubmit,
}: EditAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">
          Chỉnh sửa Tài Khoản
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Họ tên
            </label>
            <input
              type="text"
              required
              value={editFullName}
              onChange={(e) => setEditFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Vai trò (Role)
            </label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value as UserRole)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            >
              <option value="student">student</option>
              <option value="uni">uni</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Eco Points
            </label>
            <input
              type="number"
              min={0}
              value={editEcoPoints}
              onChange={(e) => setEditEcoPoints(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          {editRole === "uni" && (
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                University ID
              </label>
              <input
                type="text"
                placeholder="UUID của trường đại học"
                value={editUniversityId}
                onChange={(e) => setEditUniversityId(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs font-mono text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
              />
            </div>
          )}
          {editRole === "student" && (
            <div>
              <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                Lớp hiện tại (1–12)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                placeholder="e.g. 12"
                value={editCurrentGrade}
                onChange={(e) => setEditCurrentGrade(e.target.value)}
                className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
              />
            </div>
          )}
          {modalFeedback && (
            <p className="text-[10px] font-mono text-cyber-alert">{modalFeedback}</p>
          )}
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
