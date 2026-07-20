"use client";

import { type FormEvent } from "react";

interface StudentVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  cardImageKey: string;
  setCardImageKey: (v: string) => void;
  isSubmitting: boolean;
  modalError: string | null;
  onSubmit: (e: FormEvent) => void;
}

export default function StudentVerifyModal({
  isOpen,
  onClose,
  cardImageKey,
  setCardImageKey,
  isSubmitting,
  modalError,
  onSubmit,
}: StudentVerifyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-border-custom bg-brand-card p-6 shadow-2xl relative">
        <h3 className="text-sm font-bold text-text-main mb-2 uppercase font-mono tracking-wider">
          Yêu cầu xác thực tài khoản
        </h3>
        <p className="text-xs text-text-sub font-light leading-relaxed mb-4">
          Vui lòng cung cấp đường dẫn ảnh thẻ học sinh/sinh viên của bạn để quản trị viên phê duyệt quyền đánh giá.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-text-sub uppercase tracking-widest mb-1">
              Đường dẫn ảnh thẻ (Card Image Key)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. cards/student_card.jpg"
              value={cardImageKey}
              onChange={(e) => setCardImageKey(e.target.value)}
              className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs font-mono text-text-main placeholder-text-sub focus:border-brand-primary focus:outline-none"
            />
          </div>
          {modalError && <p className="text-[10px] font-mono text-rose-500">{modalError}</p>}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border border-border-custom text-xs font-bold text-text-sub hover:text-text-main"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-brand-primary text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
