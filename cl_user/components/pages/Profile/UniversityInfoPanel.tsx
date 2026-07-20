"use client";

import { useState, useEffect } from "react";
import type { University } from "@/hooks/useUniversities";

interface UniversityInfoPanelProps {
  university: University;
  onUpdate?: (id: string, payload: Partial<University>) => Promise<unknown>;
  isLoading?: boolean;
}

export default function UniversityInfoPanel({ university, onUpdate, isLoading }: UniversityInfoPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [prevPropTuitionFees, setPrevPropTuitionFees] = useState(university.tuition_fees);
  const [tuitionFees, setTuitionFees] = useState(university.tuition_fees || "");
  const [feedback, setFeedback] = useState<string | null>(null);

  // Sync state if university changes from props during render phase
  if (university.tuition_fees !== prevPropTuitionFees) {
    setPrevPropTuitionFees(university.tuition_fees);
    setTuitionFees(university.tuition_fees || "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdate) return;
    setFeedback(null);
    try {
      await onUpdate(university.id, { tuition_fees: tuitionFees });
      setFeedback("Cập nhật học phí thành công! ✨");
      setIsEditing(false);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : "Không thể cập nhật học phí.");
    }
  };

  return (
    <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-main uppercase font-mono tracking-wider">Hồ Sơ Trường Đại Học</h3>
          <p className="text-[10px] text-text-sub mt-0.5">
            {onUpdate ? "Cập nhật các thông tin công khai thuộc quyền hạn của trường." : "Thông tin công khai của trường (chỉ xem)."}
          </p>
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-1 rounded-full font-mono uppercase border ${
            university.is_verified
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
          }`}
        >
          {university.is_verified ? "VERIFIED" : "UNVERIFIED"}
        </span>
      </div>

      {feedback && (
        <div
          className={`p-3 text-xs rounded-xl font-mono border ${
            feedback.includes("thành công")
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {feedback}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="tuition_fees" className="block text-[10px] font-mono font-bold text-text-sub uppercase tracking-wider">
              Mức học phí (ví dụ: 25,000,000 - 45,000,000 VND/năm)
            </label>
            <input
              type="text"
              id="tuition_fees"
              value={tuitionFees}
              onChange={(e) => setTuitionFees(e.target.value)}
              placeholder="Chưa cập nhật học phí"
              className="w-full rounded-xl border border-border-custom bg-brand-dark/40 py-2.5 px-4 text-xs text-text-main outline-none focus:border-brand-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-primary text-white hover:opacity-90 transition-all cursor-pointer"
            >
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTuitionFees(university.tuition_fees || "");
                setIsEditing(false);
              }}
              className="px-4 py-2 text-xs font-bold rounded-lg border border-border-custom text-text-main hover:bg-brand-dark/50 transition-all cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
              <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Tên trường</span>
              <span className="block font-bold text-text-main">{university.name}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
              <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Mã trường</span>
              <span className="block font-mono font-bold text-brand-primary">{university.code}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
              <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Vùng miền</span>
              <span className="block font-bold text-text-main">{university.region || "Chưa cập nhật"}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-brand-dark/40 border border-border-custom space-y-1">
              <span className="block text-[9px] font-mono text-text-sub uppercase tracking-wider">Học phí</span>
              <span className="block font-bold text-text-main">{university.tuition_fees || "Chưa cập nhật"}</span>
            </div>
          </div>

          {onUpdate && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-lg bg-linear-to-r from-brand-primary to-brand-secondary text-white hover:opacity-90 shadow-md shadow-brand-primary/10 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-pen-to-square" /> Chỉnh sửa học phí
            </button>
          )}
        </div>
      )}
    </div>
  );
}
