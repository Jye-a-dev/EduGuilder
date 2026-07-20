"use client";

import type { StudentGrade } from "@/hooks/useStudentGrades";

interface StudentGradesTableProps {
  grades: StudentGrade[];
  openAddGradeModal: () => void;
  openEditGradeModal: (g: StudentGrade) => void;
  handleDeleteGrade: (id: string) => void;
}

export default function StudentGradesTable({
  grades,
  openAddGradeModal,
  openEditGradeModal,
  handleDeleteGrade,
}: StudentGradesTableProps) {
  return (
    <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-text-main uppercase font-mono tracking-wider">Tiến Trình Học Tập (Học Bạ)</h3>
          <p className="text-[10px] text-text-sub mt-0.5">Quản lý và tính điểm học bạ phục vụ xét tuyển.</p>
        </div>
        <button
          onClick={openAddGradeModal}
          className="px-3.5 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold hover:bg-brand-primary/20 transition-all cursor-pointer"
        >
          Thêm môn học +
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border-custom bg-brand-dark/40">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-custom bg-brand-card font-mono text-[9px] font-bold uppercase tracking-wider text-text-sub">
              <th className="p-3">Học kỳ</th>
              <th className="p-3">Tên môn học</th>
              <th className="p-3">Điểm số</th>
              <th className="p-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-custom/50 text-xs">
            {grades.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-sub font-mono text-[11px]">
                  Chưa có ghi nhận điểm. Hãy thêm môn học đầu tiên.
                </td>
              </tr>
            ) : (
              grades.map((g) => (
                <tr key={g.id} className="hover:bg-gray-100/5 transition-colors">
                  <td className="p-3 font-mono text-text-sub">{g.semester}</td>
                  <td className="p-3 font-bold text-text-main">{g.subject_name}</td>
                  <td className="p-3">
                    <span className="font-mono font-black text-brand-primary bg-brand-primary/5 rounded-md px-2 py-0.5">
                      {g.score}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => openEditGradeModal(g)}
                      className="text-text-sub hover:text-brand-primary transition-colors p-1"
                      title="Sửa"
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    <button
                      onClick={() => handleDeleteGrade(g.id)}
                      className="text-text-sub hover:text-rose-500 transition-colors p-1"
                      title="Xóa"
                    >
                      <i className="fa-solid fa-trash-can" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
