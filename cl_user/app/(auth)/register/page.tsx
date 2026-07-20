"use client";

import { useState, useEffect, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/libs/apiClient";

interface University {
  id: string;
  name: string;
  code: string;
}

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "uni">("student");
  const [universityId, setUniversityId] = useState("");
  const [currentGrade, setCurrentGrade] = useState<number>(10); // Default to Grade 10 for students
  const [universities, setUniversities] = useState<University[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { register, isLoading } = useAuth();
  const router = useRouter();

  // Load universities dynamically for dropdown
  useEffect(() => {
    async function loadUniversities() {
      try {
        const response = await apiClient.get<{ data: University[] }>("/universities", {
          params: { limit: 100 },
        });
        if (response && response.data) {
          setUniversities(response.data);
        }
      } catch (err) {
        console.error("Không thể tải danh sách trường đại học:", err);
      }
    }
    loadUniversities();
  }, []);

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const payload = {
      email,
      password,
      full_name: fullName,
      role,
      university_id: universityId || undefined,
      current_grade: role === "student" ? currentGrade : undefined,
    };

    try {
      await register(payload);
      setFeedback({
        type: "success",
        message: "Tạo tài khoản thành công! Đang chuyển hướng...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Đăng ký không thành công.";
      setFeedback({
        type: "error",
        message: errMsg,
      });
    }
  };

  return (
    <div className="glow-border relative overflow-hidden rounded-3xl border border-gray-800/80 bg-brand-card/90 p-8 shadow-2xl backdrop-blur-xl">
      <div className="absolute -top-12 -right-12 -z-10 h-32 w-32 rounded-full bg-brand-secondary/15 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 -z-10 h-32 w-32 rounded-full bg-brand-accent/10 blur-2xl" />

      <div className="relative z-10 mb-6 text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2 group mb-1">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg group-hover:rotate-185 transition-all duration-500">
            <i className="fa-solid fa-orbit text-white text-base"></i>
          </div>
          <span className="text-xl font-black tracking-wider text-white">EduPath</span>
        </Link>
        <h2 className="text-2xl font-black tracking-wide text-white uppercase font-mono">Đăng Ký</h2>
        <p className="text-xs text-gray-400 font-light">
          Tạo tài khoản mới để kích hoạt hành tinh tri thức.
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-4 flex items-center gap-2.5 rounded-xl p-3.5 font-mono text-xs border transition-all ${feedback.type === "success"
            ? "border-green-500/20 bg-green-500/10 text-green-400"
            : "border-red-500/20 bg-red-500/10 text-red-400"
            }`}
        >
          <i className={`fa-solid ${feedback.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="relative z-10 space-y-4">
        {/* Full Name */}
        <div className="space-y-1 text-left">
          <label htmlFor="fullName" className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Họ và tên
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
              <i className="fa-solid fa-user text-sm" />
            </span>
            <input
              type="text"
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
              className="w-full rounded-xl border border-gray-800/80 bg-brand-dark/50 py-3 pl-10 pr-4 font-mono text-sm text-white placeholder-gray-605 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1 text-left">
          <label htmlFor="email" className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Email của bạn
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
              <i className="fa-solid fa-envelope text-sm" />
            </span>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@student.edu.vn"
              className="w-full rounded-xl border border-gray-800/80 bg-brand-dark/50 py-3 pl-10 pr-4 font-mono text-sm text-white placeholder-gray-605 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1 text-left">
          <label htmlFor="pass" className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Mật mã truy cập (tối thiểu 6 ký tự)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
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
              className="w-full rounded-xl border border-gray-800/80 bg-brand-dark/50 py-3 pl-10 pr-10 font-mono text-sm text-white placeholder-gray-605 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-500 hover:text-white focus:outline-none"
            >
              <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} text-xs`} />
            </button>
          </div>
        </div>

        {/* Role Selector */}
        <div className="space-y-1 text-left">
          <label className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Vai trò tham gia
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all ${role === "student"
                ? "bg-brand-primary/10 border-brand-primary text-brand-secondary"
                : "bg-brand-dark/30 border-gray-800/80 text-gray-500 hover:text-gray-300"
                }`}
            >
              <i className="fa-solid fa-graduation-cap mr-1.5" /> Học sinh
            </button>
            <button
              type="button"
              onClick={() => setRole("uni")}
              className={`py-2 px-3 rounded-xl border font-mono text-xs font-bold transition-all ${role === "uni"
                ? "bg-brand-accent/10 border-brand-accent text-brand-accent"
                : "bg-brand-dark/30 border-gray-800/80 text-gray-500 hover:text-gray-300"
                }`}
            >
              <i className="fa-solid fa-building-columns mr-1.5" /> Đại học
            </button>
          </div>
        </div>

        {/* Current Grade - Student only */}
        {role === "student" && (
          <div className="space-y-1 text-left">
            <label htmlFor="grade" className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">
              Lớp học hiện tại
            </label>
            <select
              id="grade"
              value={currentGrade}
              onChange={(e) => setCurrentGrade(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-800/80 bg-brand-dark py-3 px-3.5 font-mono text-sm text-white focus:border-brand-secondary focus:outline-none transition-all cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((val) => (
                <option key={val} value={val} className="bg-brand-dark text-white">
                  Lớp {val}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* University Association */}
        <div className="space-y-1 text-left">
          <label htmlFor="university" className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Trường đại học {role === "student" ? "mục tiêu / đang học" : "liên kết"}
          </label>
          <select
            id="university"
            value={universityId}
            onChange={(e) => setUniversityId(e.target.value)}
            className="w-full rounded-xl border border-gray-800/80 bg-brand-dark py-3 px-3.5 font-mono text-sm text-white focus:border-brand-secondary focus:outline-none transition-all cursor-pointer"
          >
            <option value="" className="bg-brand-dark text-gray-550">
              -- Chọn trường đại học --
            </option>
            {universities.map((uni) => (
              <option key={uni.id} value={uni.id} className="bg-brand-dark text-white">
                {uni.name} ({uni.code})
              </option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary py-3.5 font-mono text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/20 hover:opacity-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all pt-4"
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner animate-spin" /> Đang tạo tài khoản...
            </>
          ) : (
            <>
              Đăng ký ngay <i className="fa-solid fa-user-plus text-xs ml-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 border-t border-gray-900 pt-4 text-center relative z-10 space-y-2">
        <p className="text-xs text-gray-400 font-light">
          Đã có tài khoản?{" "}
          <Link href="/login" className="text-brand-secondary font-bold hover:underline">
            Đăng nhập hệ thống
          </Link>
        </p>
      </div>
    </div>
  );
}
