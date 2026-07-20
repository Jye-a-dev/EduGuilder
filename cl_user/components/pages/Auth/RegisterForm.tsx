"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/providers/ThemeProvider";
import { apiClient } from "@/libs/apiClient";

interface University {
  id: string;
  name: string;
  code: string;
}

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "uni">("student");
  const [universityId, setUniversityId] = useState("");
  const [currentGrade, setCurrentGrade] = useState<number>(10);
  const [universities, setUniversities] = useState<University[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { register, isLoading } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  useEffect(() => {
    async function loadUniversities() {
      try {
        const response = await apiClient.get<{ data: University[] }>("/universities", {
          params: { limit: 100 },
        });
        if (response?.data) setUniversities(response.data);
      } catch (err) {
        console.error("Không thể tải danh sách trường đại học:", err);
      }
    }
    loadUniversities();
  }, []);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    try {
      await register({
        email,
        password,
        full_name: fullName,
        role,
        university_id: universityId || undefined,
        current_grade: role === "student" ? currentGrade : undefined,
      });
      setFeedback({ type: "success", message: "Tạo tài khoản thành công! Đang chuyển hướng..." });
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Đăng ký không thành công.",
      });
    }
  };

  return (
    <div
      className="flex flex-col justify-center w-full lg:w-5/12 xl:w-4/12 min-h-screen px-8 sm:px-12 lg:px-14 xl:px-16 relative z-10 overflow-y-auto"
      style={{ backgroundColor: "var(--auth-card-bg)", borderRight: "1px solid var(--auth-divider)" }}
    >
      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="absolute top-6 right-6 w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer"
        style={{
          background: "var(--btn-ghost-bg)",
          color: "var(--body-muted)",
          border: "1px solid var(--border-card)",
        }}
        title={theme === "dark" ? "Chuyển Light mode" : "Chuyển Dark mode"}
      >
        <i className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"} text-sm`} />
      </button>

      {/* Back */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold transition-colors"
        style={{ color: "var(--body-muted)" }}
      >
        <i className="fa-solid fa-arrow-left text-[10px]" /> Trang chủ
      </Link>

      <div className="py-20">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-primary via-brand-accent to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/30 group-hover:rotate-12 transition-all duration-500">
              <i className="fa-solid fa-orbit text-white text-lg animate-spin" style={{ animationDuration: "15s" }} />
            </div>
            <span className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary">
              EduPath
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: "var(--heading)" }}>
            Bắt đầu hành trình
          </h1>
          <p className="text-sm font-light" style={{ color: "var(--body-muted)" }}>
            Tạo tài khoản để kích hoạt hành tinh tri thức của bạn.
          </p>
        </div>

        {/* Feedback */}
        {feedback && (
          <div
            className={`mb-5 flex items-center gap-2.5 rounded-xl p-3.5 text-xs border ${
              feedback.type === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-500"
                : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
          >
            <i className={`fa-solid ${feedback.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
            <span className="font-mono">{feedback.message}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="auth-label">Họ và tên</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: "var(--body-muted)" }}>
                <i className="fa-solid fa-user text-sm" />
              </span>
              <input
                type="text"
                id="fullName"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) text-(--auth-input-text) py-3 pl-10 pr-4 font-mono text-sm placeholder-(--auth-placeholder) focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="auth-label">Email của bạn</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: "var(--body-muted)" }}>
                <i className="fa-solid fa-envelope text-sm" />
              </span>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ten@student.edu.vn"
                className="w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) text-(--auth-input-text) py-3 pl-10 pr-4 font-mono text-sm placeholder-(--auth-placeholder) focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="pass" className="auth-label">Mật khẩu (tối thiểu 6 ký tự)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: "var(--body-muted)" }}>
                <i className="fa-solid fa-key text-sm" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="pass"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) text-(--auth-input-text) py-3 pl-10 pr-10 font-mono text-sm placeholder-(--auth-placeholder) focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 focus:outline-none cursor-pointer"
                style={{ color: "var(--body-muted)" }}
              >
                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} text-xs`} />
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="auth-label">Vai trò tham gia</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className="py-2.5 px-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer"
                style={{
                  background: role === "student" ? "rgba(59,130,246,0.1)" : "var(--auth-input-bg)",
                  borderColor: role === "student" ? "#3B82F6" : "var(--auth-input-border)",
                  color: role === "student" ? "#06B6D4" : "var(--body-muted)",
                }}
              >
                <i className="fa-solid fa-graduation-cap mr-1.5" /> Học sinh
              </button>
              <button
                type="button"
                onClick={() => setRole("uni")}
                className="py-2.5 px-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer"
                style={{
                  background: role === "uni" ? "rgba(139,92,246,0.1)" : "var(--auth-input-bg)",
                  borderColor: role === "uni" ? "#8B5CF6" : "var(--auth-input-border)",
                  color: role === "uni" ? "#8B5CF6" : "var(--body-muted)",
                }}
              >
                <i className="fa-solid fa-building-columns mr-1.5" /> Đại học
              </button>
            </div>
          </div>

          {/* Grade - student only */}
          {role === "student" && (
            <div>
              <label htmlFor="grade" className="auth-label">Lớp học hiện tại</label>
              <select
                id="grade"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(Number(e.target.value))}
                className="w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) text-(--auth-input-text) py-3 px-3.5 font-mono text-sm focus:border-brand-secondary focus:outline-none transition-all cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((val) => (
                  <option key={val} value={val} className="bg-(--auth-input-bg) text-(--auth-input-text)">Lớp {val}</option>
                ))}
              </select>
            </div>
          )}

          {/* University */}
          <div>
            <label htmlFor="university" className="auth-label">
              Trường đại học {role === "student" ? "mục tiêu / đang học" : "liên kết"}
            </label>
            <select
              id="university"
              value={universityId}
              onChange={(e) => setUniversityId(e.target.value)}
              className="w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) text-(--auth-input-text) py-3 px-3.5 font-mono text-sm focus:border-brand-secondary focus:outline-none transition-all cursor-pointer"
            >
              <option value="">-- Chọn trường đại học --</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id} className="bg-(--auth-input-bg) text-(--auth-input-text)">{uni.name} ({uni.code})</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary py-3.5 font-mono text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/25 hover:opacity-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all mt-2"
          >
            {isLoading ? (
              <><i className="fa-solid fa-spinner animate-spin" /> Đang tạo tài khoản...</>
            ) : (
              <>Đăng ký ngay <i className="fa-solid fa-user-plus text-xs ml-0.5" /></>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 text-center" style={{ borderTop: "1px solid var(--auth-divider)" }}>
          <p className="text-xs font-light" style={{ color: "var(--body-muted)" }}>
            Đã có tài khoản?{" "}
            <Link href="/login" className="text-brand-secondary font-bold hover:underline">
              Đăng nhập hệ thống
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
