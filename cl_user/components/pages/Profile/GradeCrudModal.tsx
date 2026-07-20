"use client";

import { type FormEvent } from "react";
import type { StudentGrade } from "@/hooks/useStudentGrades";

interface GradeCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingGrade: StudentGrade | null;
  gradeSemester: string;
  setGradeSemester: (v: string) => void;
  gradeSubject: string;
  setGradeSubject: (v: string) => void;
  gradeScore: number | "";
  setGradeScore: (v: number | "") => void;
  gradeFeedback: string | null;
  isSubmittingGrade: boolean;
  onSubmit: (e: FormEvent) => void;
}

export default function GradeCrudModal({
  isOpen,
  onClose,
  editingGrade,
  gradeSemester,
  setGradeSemester,
  gradeSubject,
  setGradeSubject,
  gradeScore,
  setGradeScore,
  gradeFeedback,
  isSubmittingGrade,
  onSubmit,
}: GradeCrudModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-border-custom bg-brand-card p-6 shadow-2xl">
        <h3 className="text-sm font-bold text-text-main mb-1 uppercase font-mono tracking-wider">
          {editingGrade ? "Chỉnh sửa môn học" : "Thêm môn học mới"}
        </h3>
        <p className="text-xs text-text-sub font-light mb-4">Nhập chính xác học kỳ và điểm số ghi nhận trên học bạ.</p>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">Học kỳ</label>
            <select
              value={gradeSemester}
              onChange={(e) => setGradeSemester(e.target.value)}
              className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main focus:outline-none"
            >
              <option value="Học kỳ 1.1">Học kỳ 1.1 (Lớp 10 Kỳ 1)</option>
              <option value="Học kỳ 1.2">Học kỳ 1.2 (Lớp 10 Kỳ 2)</option>
              <option value="Học kỳ 2.1">Học kỳ 2.1 (Lớp 11 Kỳ 1)</option>
              <option value="Học kỳ 2.2">Học kỳ 2.2 (Lớp 11 Kỳ 2)</option>
              <option value="Học kỳ 3.1">Học kỳ 3.1 (Lớp 12 Kỳ 1)</option>
              <option value="Học kỳ 3.2">Học kỳ 3.2 (Lớp 12 Kỳ 2)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">Tên môn học</label>
            <input
              type="text"
              required
              placeholder="e.g. Toán học, Vật lý"
              value={gradeSubject}
              onChange={(e) => setGradeSubject(e.target.value)}
              className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main focus:border-brand-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-mono text-text-sub uppercase tracking-wider mb-1">Điểm (thang 10)</label>
            <input
              type="number"
              required
              min={0}
              max={10}
              step={0.1}
              placeholder="e.g. 8.5"
              value={gradeScore}
              onChange={(e) => setGradeScore(e.target.value !== "" ? Number(e.target.value) : "")}
              className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs font-mono text-text-main focus:border-brand-primary focus:outline-none"
            />
          </div>
          {gradeFeedback && <p className="text-[10px] font-mono text-rose-500">{gradeFeedback}</p>}
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
              disabled={isSubmittingGrade}
              className="px-4 py-2 rounded-lg bg-brand-primary text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSubmittingGrade ? "Đang xử lý..." : editingGrade ? "Lưu thay đổi" : "Thêm môn học"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
