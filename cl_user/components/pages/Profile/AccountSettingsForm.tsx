"use client";

import { type FormEvent } from "react";
import type { User } from "@/components/providers/AuthProvider";
import type { University } from "@/hooks/useUniversities";

interface AccountSettingsFormProps {
  user: User;
  fullName: string;
  setFullName: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  currentGrade: number | "";
  setCurrentGrade: (v: number | "") => void;
  selectedUniId: string;
  setSelectedUniId: (v: string) => void;
  universities: University[];
  accountFeedback: string | null;
  isUpdatingAccount: boolean;
  onSubmit: (e: FormEvent) => void;
}

export default function AccountSettingsForm({
  user,
  fullName,
  setFullName,
  password,
  setPassword,
  currentGrade,
  setCurrentGrade,
  selectedUniId,
  setSelectedUniId,
  universities,
  accountFeedback,
  isUpdatingAccount,
  onSubmit,
}: AccountSettingsFormProps) {
  return (
    <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-6">
      <h3 className="text-sm font-bold text-text-main uppercase font-mono tracking-wider">Cài Đặt Tài Khoản</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">Họ và tên</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">
              Mật khẩu mới (bỏ trống nếu không đổi)
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main focus:border-brand-primary focus:outline-none"
            />
          </div>
          {user.role === "student" && (
            <>
              <div>
                <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">Lớp học</label>
                <select
                  value={currentGrade}
                  onChange={(e) => setCurrentGrade(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main focus:border-brand-primary focus:outline-none"
                >
                  <option value="">Chưa chọn</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Lớp {i + 1}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">Trường liên kết</label>
                <select
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main focus:border-brand-primary focus:outline-none"
                >
                  <option value="">Không liên kết</option>
                  {universities.map((uni) => (
                    <option key={uni.id} value={uni.id}>
                      {uni.name} ({uni.code})
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
        {accountFeedback && <p className="text-xs font-mono text-brand-primary">{accountFeedback}</p>}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isUpdatingAccount}
            className="px-6 py-2 rounded-xl bg-brand-primary text-xs font-bold text-white hover:opacity-90 transition-all cursor-pointer disabled:opacity-60"
          >
            {isUpdatingAccount ? "Đang lưu..." : "Cập nhật tài khoản"}
          </button>
        </div>
      </form>
    </div>
  );
}
