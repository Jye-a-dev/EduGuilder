"use client";

import Link from "next/link";
import type { User } from "@/components/providers/AuthProvider";
import type { Note } from "@/hooks/useNotes";
import type { StudentGrade } from "@/hooks/useStudentGrades";
import type { StudentVerification } from "@/hooks/useStudentVerifications";

interface StudentDashboardProps {
  user: User;
  notes: Note[];
  notesCount: number;
  grades: StudentGrade[];
  verification: StudentVerification | null;
  averageScore: string;
  getVerificationColor: (status?: string) => string;
  getVerificationText: (status?: string) => string;
  formatTimeAgo: (dateString: string) => string;
  onOpenVerifyModal: () => void;
}

export default function StudentDashboard({
  user,
  notes,
  notesCount,
  grades,
  verification,
  averageScore,
  getVerificationColor,
  getVerificationText,
  formatTimeAgo,
  onOpenVerifyModal,
}: StudentDashboardProps) {
  return (
    <div className="space-y-6 relative">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight font-sans">
            Chào buổi sáng, {user.full_name.split(" ").pop()}! 👋
          </h1>
          <p className="text-xs text-text-sub font-light mt-0.5">Cùng cập nhật tiến trình tuyển sinh hôm nay nào.</p>
        </div>
      </div>

      {/* --- STATS GRID (4 CARDS) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* EDU-POINTS */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Edu-Points</span>
            <span className="block text-2xl font-black text-text-main font-sans tracking-tight">
              {user.eco_points.toLocaleString("vi-VN")}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 font-mono">
              <i className="fa-solid fa-arrow-up text-[8px]" /> +50 hôm nay
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100/50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500 shrink-0">
            <i className="fa-solid fa-leaf text-lg" />
          </div>
        </div>

        {/* MY NOTES */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Ghi chú của tôi</span>
            <span className="block text-2xl font-black text-text-main font-sans tracking-tight">{notesCount}</span>
            <span className="text-[10px] text-text-sub font-light font-mono">5 tệp nháp</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500 shrink-0">
            <i className="fa-solid fa-file-invoice text-lg" />
          </div>
        </div>

        {/* TRANSCRIPT AVERAGE */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Điểm TB học bạ</span>
            <span className="block text-2xl font-black text-text-main font-sans tracking-tight">{averageScore}</span>
            <span className="text-[10px] text-text-sub font-light font-mono">Học kỳ 1</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-100/50 dark:bg-indigo-950/20 flex items-center justify-center text-indigo-500 shrink-0">
            <i className="fa-solid fa-chart-line text-lg" />
          </div>
        </div>

        {/* VERIFICATION */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5 flex-1 pr-2">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Xác thực HS</span>
            <span className={`block text-xl font-black font-sans tracking-tight ${getVerificationColor(verification?.status)}`}>
              {getVerificationText(verification?.status)}
            </span>
            <span className="text-[10px] text-text-sub font-light font-mono block">
              {verification?.status === "approved" ? "Hồ sơ sẵn sàng" : "Chờ phê duyệt"}
            </span>
            {verification?.status !== "approved" && (
              <button
                onClick={onOpenVerifyModal}
                className="mt-2 px-3 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 hover:border-brand-primary/45 rounded-lg text-[10px] font-mono font-bold text-brand-primary transition-all cursor-pointer"
              >
                {verification ? "Gửi lại yêu cầu" : "Xác thực ngay"}
              </button>
            )}
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0">
            <i className="fa-solid fa-shield-halved text-lg" />
          </div>
        </div>
      </div>

      {/* --- MAIN GRID CONTENT (STUDENT) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (Knowledge map + Recent Notes) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Knowledge Map Card */}
          <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main">Hệ sinh thái tri thức [[Link]]</h3>
            </div>

            <div className="h-64 rounded-xl border border-dashed border-border-custom bg-gray-50/5 flex flex-col items-center justify-center text-center cursor-pointer group hover:bg-gray-50/10 dark:hover:bg-gray-800/10 transition-colors">
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3 transition-transform duration-300 group-hover:scale-110">
                <i className="fa-solid fa-circle-nodes text-xl animate-pulse" />
              </div>
              <span className="text-xs font-semibold text-text-main">Click để mở rộng bản đồ 3D</span>
            </div>
          </div>

          {/* Recent Notes Card */}
          <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main">Ghi chú mới nhất</h3>
              <Link href="/knowledge" className="text-xs text-brand-primary font-bold hover:underline">
                Tạo mới +
              </Link>
            </div>

            <div className="divide-y divide-border-custom max-h-80 overflow-y-auto pr-1 space-y-3.5">
              {notes.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-sub">Chưa có ghi chú nào được lưu trữ.</div>
              ) : (
                notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="flex items-center justify-between pt-3.5 first:pt-0">
                    <div className="min-w-0 flex-1 pr-4">
                      <span className="block text-xs font-semibold text-text-main truncate hover:text-brand-primary cursor-pointer">
                        {note.title}
                      </span>
                      <span className="text-[10px] text-text-sub font-mono block mt-1">
                        {note.subject || "Toán Học"} • {formatTimeAgo(note.created_at)}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono font-bold bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2 py-0.5 rounded-sm shrink-0">
                      LỚP {user.current_grade || "12"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column (Achievements) */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main">Thành tích học tập</h3>
              <Link href="/profile" className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1">
                Bảng điểm <i className="fa-solid fa-arrow-right text-[10px]" />
              </Link>
            </div>

            <div className="space-y-3">
              {grades.length === 0 ? (
                <div className="py-6 text-center text-xs text-text-sub">Chưa ghi nhận điểm môn học nào.</div>
              ) : (
                grades.slice(0, 4).map((grade) => (
                  <div
                    key={grade.id}
                    className="flex items-center gap-3 min-w-0 p-3.5 rounded-xl bg-gray-50/30 dark:bg-gray-900/30 border border-border-custom justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-xs font-bold text-brand-primary shrink-0 uppercase font-mono">
                        {grade.subject_name.slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-text-main truncate">{grade.subject_name}</span>
                        <span className="text-[9px] text-text-sub font-mono block mt-0.5">
                          Học kỳ {grade.semester.split(".").pop()}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-brand-primary font-mono bg-brand-primary/10 px-2.5 py-1 rounded-lg shrink-0">
                      {grade.score}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
