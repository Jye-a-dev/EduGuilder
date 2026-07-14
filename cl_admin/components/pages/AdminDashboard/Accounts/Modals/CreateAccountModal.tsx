"use client";

import type { FormEvent } from "react";

interface CreateAccountModalProps {
  isOpen: boolean;
  closeModal: () => void;
  modalFeedback: string | null;
  newEmail: string;
  setNewEmail: (v: string) => void;
  newFullName: string;
  setNewFullName: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  newRole: string;
  setNewRole: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
}

export default function CreateAccountModal({
  isOpen,
  closeModal,
  modalFeedback,
  newEmail,
  setNewEmail,
  newFullName,
  setNewFullName,
  newPassword,
  setNewPassword,
  newRole,
  setNewRole,
  onSubmit,
}: CreateAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="glow-border w-full max-w-md rounded-2xl border border-gray-800 bg-cyber-card p-6 shadow-2xl">
        <h3 className="text-sm font-bold text-white mb-4 uppercase font-mono">
          Tạo Tài Khoản Mới
        </h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Họ tên
            </label>
            <input
              type="text"
              required
              placeholder="Nguyễn Văn A"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Tối thiểu 8 ký tự"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white placeholder-gray-700 focus:border-cyber-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
              Vai trò (Role)
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-cyber-bg px-3 py-2 text-xs text-white focus:border-cyber-primary focus:outline-none"
            >
              <option value="student">student</option>
              <option value="uni">uni</option>
              <option value="admin">admin</option>
            </select>
          </div>
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
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
