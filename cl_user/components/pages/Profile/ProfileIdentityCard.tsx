"use client";

import type { User } from "@/components/providers/AuthProvider";
import type { University } from "@/hooks/useUniversities";

interface ProfileIdentityCardProps {
  user: User;
  gpa: string;
  onOpenEmailModal: () => void;
}

export default function ProfileIdentityCard({ user, gpa, onOpenEmailModal }: ProfileIdentityCardProps) {
  const roleLabel = user.role === "student" ? "Học sinh" : user.role === "uni" ? "Trường học" : "Quản trị viên";

  return (
    <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-6">
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-linear-to-tr from-brand-primary to-brand-secondary p-0.5 shadow-lg shadow-brand-primary/20">
          <div className="w-full h-full rounded-full bg-brand-card flex items-center justify-center font-black text-2xl text-text-main uppercase font-mono">
            {user.full_name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-main">{user.full_name}</h3>
          <span className="text-[10px] font-mono uppercase bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded-full inline-block mt-1">
            {roleLabel}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border-custom text-xs">
        <div className="py-3 flex justify-between items-center">
          <span className="text-text-sub">Email</span>
          <button
            onClick={onOpenEmailModal}
            className="font-mono text-text-main hover:text-brand-primary transition-colors text-right break-all flex items-center gap-1 max-w-[55%]"
            title="Nhấn để đổi email"
          >
            <span className="truncate">{user.email}</span>
            <i className="fa-solid fa-pen text-[9px] text-text-sub shrink-0" />
          </button>
        </div>
        <div className="py-3 flex justify-between">
          <span className="text-text-sub">Edu Points</span>
          <span className="font-bold text-emerald-500 font-mono">{user.eco_points.toLocaleString("vi-VN")} pts</span>
        </div>
        {user.role === "student" && (
          <>
            <div className="py-3 flex justify-between">
              <span className="text-text-sub">Lớp học</span>
              <span className="font-bold text-brand-primary">Lớp {user.current_grade || "N/A"}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-text-sub">GPA học bạ</span>
              <span className="font-black text-brand-secondary font-mono">{gpa}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
