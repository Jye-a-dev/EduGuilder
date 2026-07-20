"use client";

import { type FormEvent } from "react";

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  newEmail: string;
  setNewEmail: (v: string) => void;
  emailFeedback: string | null;
  isUpdatingEmail: boolean;
  onSubmit: (e: FormEvent) => void;
}

export default function EmailChangeModal({
  isOpen,
  onClose,
  newEmail,
  setNewEmail,
  emailFeedback,
  isUpdatingEmail,
  onSubmit,
}: EmailChangeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border-custom bg-brand-card p-6 shadow-2xl">
        <h3 className="text-sm font-bold text-text-main mb-1 uppercase font-mono tracking-wider">Đổi địa chỉ Email</h3>
        <p className="text-[11px] text-text-sub font-light mb-4">Nhập email mới cho tài khoản của bạn.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">Email mới</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs font-mono text-text-main focus:border-brand-primary focus:outline-none"
            />
          </div>
          {emailFeedback && <p className="text-[10px] font-mono text-rose-500">{emailFeedback}</p>}
          <div className="flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-custom text-xs font-bold text-text-sub hover:text-text-main"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isUpdatingEmail}
              className="px-4 py-2 rounded-lg bg-brand-primary text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {isUpdatingEmail ? "Đang lưu..." : "Xác nhận đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
