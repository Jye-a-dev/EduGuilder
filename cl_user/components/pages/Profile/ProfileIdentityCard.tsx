"use client";

import { useState } from "react";
import type { User } from "@/components/providers/AuthProvider";
import type { University } from "@/hooks/useUniversities";

interface ProfileIdentityCardProps {
  user: User;
  gpa: string;
  onOpenEmailModal: () => void;
  university?: University | null;
  onUpdateUser?: (payload: {
    full_name?: string;
    password?: string;
    university_id?: string | null;
    current_grade?: number | null;
  }) => Promise<unknown>;
  universities?: University[];
}

export default function ProfileIdentityCard({
  user,
  gpa,
  onOpenEmailModal,
  university,
  onUpdateUser,
  universities,
}: ProfileIdentityCardProps) {
  const roleLabel = user.role === "student" ? "Học sinh" : user.role === "uni" ? "Trường học" : "Quản trị viên";

  // State for inline updates
  const [isEditingName, setIsEditingName] = useState(false);
  const [fullName, setFullName] = useState(user.full_name);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const [isEditingGrade, setIsEditingGrade] = useState(false);
  const [currentGrade, setCurrentGrade] = useState<number | "">(user.current_grade ?? "");

  const [isEditingUni, setIsEditingUni] = useState(false);
  const [selectedUniId, setSelectedUniId] = useState(user.university_id ?? "");

  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser) {
    setPrevUser(user);
    setFullName(user.full_name);
    setCurrentGrade(user.current_grade ?? "");
    setSelectedUniId(user.university_id ?? "");
  }

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUser) return;
    setFeedback(null);
    try {
      const val = currentGrade === "" ? null : Number(currentGrade);
      await onUpdateUser({ current_grade: val });
      setIsEditingGrade(false);
      setFeedback("Cập nhật lớp học thành công! ✨");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : "Cập nhật lớp học thất bại.");
    }
  };

  const handleUniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUser) return;
    setFeedback(null);
    try {
      const val = selectedUniId === "" ? null : selectedUniId;
      await onUpdateUser({ university_id: val });
      setIsEditingUni(false);
      setFeedback("Cập nhật trường hướng tới thành công! ✨");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : "Cập nhật trường hướng tới thất bại.");
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUser || !fullName.trim()) return;
    setFeedback(null);
    try {
      await onUpdateUser({ full_name: fullName });
      setIsEditingName(false);
      setFeedback("Cập nhật họ tên thành công! ✨");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : "Cập nhật họ tên thất bại.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateUser || !password.trim()) return;
    setFeedback(null);
    try {
      await onUpdateUser({ password });
      setIsEditingPassword(false);
      setPassword("");
      setFeedback("Cập nhật mật khẩu thành công! ✨");
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: unknown) {
      setFeedback(err instanceof Error ? err.message : "Cập nhật mật khẩu thất bại.");
    }
  };

  return (
    <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-6">
      {/* Upper avatar + name section */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="w-20 h-20 rounded-full bg-linear-to-tr from-brand-primary to-brand-secondary p-0.5 shadow-lg shadow-brand-primary/20">
          <div className="w-full h-full rounded-full bg-brand-card flex items-center justify-center font-black text-2xl text-text-main uppercase font-mono">
            {user.full_name.slice(0, 2).toUpperCase()}
          </div>
        </div>
        <div>
          {isEditingName ? (
            <form onSubmit={handleNameSubmit} className="flex items-center justify-center gap-2 mt-1">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="rounded-lg border border-border-custom bg-brand-dark/40 px-2 py-1 text-xs text-text-main outline-none focus:border-brand-primary text-center font-bold"
              />
              <button type="submit" className="text-emerald-500 hover:text-emerald-400 text-xs font-bold cursor-pointer">Lưu</button>
              <button
                type="button"
                onClick={() => {
                  setFullName(user.full_name);
                  setIsEditingName(false);
                }}
                className="text-text-sub hover:text-text-main text-xs cursor-pointer"
              >
                Hủy
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-1.5 group">
              <h3 className="text-lg font-bold text-text-main">{user.full_name}</h3>
              {onUpdateUser && (
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-text-sub hover:text-brand-primary transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Chỉnh sửa họ tên"
                >
                  <i className="fa-solid fa-pen text-[10px]" />
                </button>
              )}
            </div>
          )}
          <span className="text-[10px] font-mono uppercase bg-brand-primary/10 border border-brand-primary/20 text-brand-primary px-2.5 py-0.5 rounded-full inline-block mt-1">
            {roleLabel}
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-2.5 text-[10px] text-center rounded-xl font-mono border ${
            feedback.includes("thành công")
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {feedback}
        </div>
      )}

      {/* Profile list attributes */}
      <div className="divide-y divide-border-custom text-xs">
        {/* Email */}
        <div className="py-3 flex justify-between items-center">
          <span className="text-text-sub">Email</span>
          <button
            onClick={onOpenEmailModal}
            className="font-mono text-text-main hover:text-brand-primary transition-colors text-right break-all flex items-center gap-1 max-w-[55%] cursor-pointer"
            title="Nhấn để đổi email"
          >
            <span className="truncate">{user.email}</span>
            <i className="fa-solid fa-pen text-[9px] text-text-sub shrink-0" />
          </button>
        </div>

        {/* Password (if inline editing is enabled) */}
        {onUpdateUser && (
          <div className="py-3 flex justify-between items-center">
            <span className="text-text-sub">Mật khẩu</span>
            {isEditingPassword ? (
              <form onSubmit={handlePasswordSubmit} className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-border-custom bg-brand-dark/40 px-2 py-1 text-xs text-text-main outline-none focus:border-brand-primary w-28"
                />
                <button type="submit" className="text-emerald-500 hover:text-emerald-400 text-xs font-bold cursor-pointer">Lưu</button>
                <button
                  type="button"
                  onClick={() => {
                    setPassword("");
                    setIsEditingPassword(false);
                  }}
                  className="text-text-sub hover:text-text-main text-xs cursor-pointer"
                >
                  Hủy
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsEditingPassword(true)}
                className="font-mono text-text-main hover:text-brand-primary transition-colors text-right flex items-center gap-1 cursor-pointer"
                title="Nhấn để đổi mật khẩu"
              >
                <span>••••••••</span>
                <i className="fa-solid fa-pen text-[9px] text-text-sub shrink-0" />
              </button>
            )}
          </div>
        )}

        {/* Edu Points */}
        <div className="py-3 flex justify-between">
          <span className="text-text-sub">Edu Points</span>
          <span className="font-bold text-emerald-500 font-mono">{user.eco_points.toLocaleString("vi-VN")} pts</span>
        </div>

        {/* Student parameters */}
        {user.role === "student" && (() => {
          const targetUni = universities?.find(u => u.id === user.university_id) || university;
          const universityName = targetUni ? `${targetUni.name} (${targetUni.code})` : "Chưa chọn";
          return (
            <>
              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-text-sub shrink-0">Lớp học</span>
                {isEditingGrade ? (
                  <form onSubmit={handleGradeSubmit} className="flex items-center gap-1.5">
                    <select
                      value={currentGrade}
                      onChange={(e) => setCurrentGrade(e.target.value ? Number(e.target.value) : "")}
                      className="rounded-lg border border-border-custom bg-brand-dark/40 px-2 py-1 text-xs text-text-main outline-none focus:border-brand-primary"
                    >
                      <option value="">Chưa chọn</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          Lớp {i + 1}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-emerald-500 hover:text-emerald-400 text-xs font-bold cursor-pointer">Lưu</button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentGrade(user.current_grade ?? "");
                        setIsEditingGrade(false);
                      }}
                      className="text-text-sub hover:text-text-main text-xs cursor-pointer"
                    >
                      Hủy
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsEditingGrade(true)}
                    className="font-bold text-brand-primary hover:text-brand-primary transition-colors text-right flex items-center gap-1 cursor-pointer font-sans"
                    title="Nhấn để đổi lớp"
                  >
                    <span>Lớp {user.current_grade || "N/A"}</span>
                    <i className="fa-solid fa-pen text-[9px] text-text-sub shrink-0" />
                  </button>
                )}
              </div>

              <div className="py-3 flex justify-between items-center gap-4">
                <span className="text-text-sub shrink-0">Trường hướng tới (Aim)</span>
                {isEditingUni ? (
                  <form onSubmit={handleUniSubmit} className="flex items-center gap-1.5">
                    <select
                      value={selectedUniId}
                      onChange={(e) => setSelectedUniId(e.target.value)}
                      className="rounded-lg border border-border-custom bg-brand-dark/40 px-2 py-1 text-xs text-text-main outline-none focus:border-brand-primary max-w-30"
                    >
                      <option value="">Không liên kết</option>
                      {universities?.map((uni) => (
                        <option key={uni.id} value={uni.id}>
                          {uni.name} ({uni.code})
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="text-emerald-500 hover:text-emerald-400 text-xs font-bold cursor-pointer">Lưu</button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUniId(user.university_id ?? "");
                        setIsEditingUni(false);
                      }}
                      className="text-text-sub hover:text-text-main text-xs cursor-pointer"
                    >
                      Hủy
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setIsEditingUni(true)}
                    className="font-bold text-text-main hover:text-brand-primary transition-colors text-right flex items-center gap-1 cursor-pointer font-sans"
                    title="Nhấn để đổi trường hướng tới"
                  >
                    <span className="truncate max-w-30">{universityName}</span>
                    <i className="fa-solid fa-pen text-[9px] text-text-sub shrink-0" />
                  </button>
                )}
              </div>

              <div className="py-3 flex justify-between">
                <span className="text-text-sub">GPA học bạ</span>
                <span className="font-black text-brand-secondary font-mono">{gpa}</span>
              </div>
            </>
          );
        })()}

        {/* University parameters (merged for Uni Role) */}
        {user.role === "uni" && university && (
          <>
            <div className="py-3 flex justify-between gap-4">
              <span className="text-text-sub shrink-0">Tên trường</span>
              <span className="font-bold text-text-main text-right wrap-break-word">{university.name}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-text-sub">Mã trường</span>
              <span className="font-bold text-brand-primary font-mono">{university.code}</span>
            </div>
            <div className="py-3 flex justify-between">
              <span className="text-text-sub">Vùng miền</span>
              <span className="font-bold text-text-main">{university.region || "Chưa cập nhật"}</span>
            </div>
            <div className="py-3 flex justify-between gap-4">
              <span className="text-text-sub shrink-0">Học phí</span>
              <span className="font-bold text-text-main text-right wrap-break-word">{university.tuition_fees || "Chưa cập nhật"}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
