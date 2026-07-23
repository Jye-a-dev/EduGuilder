"use client";

import type { FormEvent } from "react";
import type { StudentVerification } from "@/hooks/useStudentVerifications";

interface StudentVerificationCardProps {
  verification: StudentVerification | null;
  verifyCardKey: string;
  setVerifyCardKey: (v: string) => void;
  verifyFeedback: string | null;
  isRequestingVerify: boolean;
  onSubmit: (e: FormEvent) => void;
}

export default function StudentVerificationCard({
  verification,
  verifyCardKey,
  setVerifyCardKey,
  verifyFeedback,
  isRequestingVerify,
  onSubmit,
}: StudentVerificationCardProps) {
  const statusLabel = verification?.status || "CHƯA XÁC THỰC";
  const badgeClass =
    verification?.status === "approved"
      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      : verification?.status === "pending"
      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
      : verification?.status === "rejected"
      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
      : "bg-gray-500/10 text-gray-400 border border-gray-500/20";

  return (
    <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-main uppercase font-mono tracking-wider">Xác Thực Học Sinh</h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono uppercase ${badgeClass}`}>
          {statusLabel}
        </span>
      </div>

      {verification?.status === "approved" ? (
        <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed font-light">
          <i className="fa-solid fa-circle-check mr-1.5" /> Tài khoản đã được phê duyệt. Bạn có toàn quyền gửi bài viết & đánh giá.
        </div>
      ) : verification?.status === "pending" ? (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/15 text-xs text-amber-500 leading-relaxed font-light">
          <i className="fa-regular fa-clock mr-1.5" /> Đang chờ duyệt hồ sơ. Admin sẽ kiểm tra ảnh thẻ học sinh trong thời gian ngắn nhất.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <p className="text-[11px] text-text-sub font-light leading-relaxed">
            {verification?.status === "rejected"
              ? "Yêu cầu trước đó đã bị từ chối. Vui lòng gửi lại với ảnh thẻ hợp lệ."
              : "Tài khoản chưa được xác thực. Nhập đường dẫn ảnh thẻ học sinh để yêu cầu duyệt."}
          </p>
          {verification?.reject_reason && (
            <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-[10px] text-rose-400">
              <span className="font-bold">Lý do từ chối:</span> {verification.reject_reason}
            </div>
          )}
          <input
            type="text"
            required
            placeholder="cards/image_path.jpg"
            value={verifyCardKey}
            onChange={(e) => setVerifyCardKey(e.target.value)}
            className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs font-mono text-text-main placeholder-text-sub focus:border-brand-primary focus:outline-none"
          />
          {verifyFeedback && <p className="text-[10px] font-mono text-brand-primary">{verifyFeedback}</p>}
          <button
            type="submit"
            disabled={isRequestingVerify}
            className="w-full py-2 rounded-xl bg-brand-primary text-xs font-bold text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-60"
          >
            Gửi yêu cầu xác thực
          </button>
        </form>
      )}
    </div>
  );
}
