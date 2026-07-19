"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    try {
      await login(email, password);
      setFeedback({
        type: "success",
        message: "Đăng nhập thành công! Đang tải hệ thống...",
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Đăng nhập không thành công.";
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

      <div className="relative z-10 mb-8 text-center space-y-3">
        <Link href="/" className="inline-flex items-center gap-2 group mb-2">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg group-hover:rotate-185 transition-all duration-500">
            <i className="fa-solid fa-orbit text-white text-base"></i>
          </div>
          <span className="text-xl font-black tracking-wider text-white">EduPath</span>
        </Link>
        <h2 className="text-2xl font-black tracking-wide text-white uppercase font-mono">Đăng Nhập</h2>
        <p className="text-xs text-gray-400 font-light">
          Vui lòng điền thông tin để tiếp cận hành tinh học thuật.
        </p>
      </div>

      {feedback && (
        <div
          className={`mb-5 flex items-center gap-2.5 rounded-xl p-3.5 font-mono text-xs border transition-all ${
            feedback.type === "success"
              ? "border-green-500/20 bg-green-500/10 text-green-400"
              : "border-red-500/20 bg-red-500/10 text-red-400"
          }`}
        >
          <i className={`fa-solid ${feedback.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"}`} />
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="relative z-10 space-y-5">
        <div className="space-y-1.5 text-left">
          <label htmlFor="email" className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Địa chỉ Email
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
              placeholder="ten@truong.edu.vn"
              className="w-full rounded-xl border border-gray-800/80 bg-brand-dark/50 py-3.5 pl-10 pr-4 font-mono text-sm text-white placeholder-gray-600 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-left">
          <div className="flex justify-between items-center">
            <label htmlFor="pass" className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Mật mã
            </label>
            <a href="#" className="font-mono text-[10px] text-brand-secondary hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
              <i className="fa-solid fa-lock text-sm" />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              id="pass"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-gray-800/80 bg-brand-dark/50 py-3.5 pl-10 pr-10 font-mono text-sm text-white placeholder-gray-600 focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
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

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary py-3.5 font-mono text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/20 hover:opacity-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all"
        >
          {isLoading ? (
            <>
              <i className="fa-solid fa-spinner animate-spin" /> Đang kiểm tra...
            </>
          ) : (
            <>
              Đăng nhập <i className="fa-solid fa-arrow-right-to-bracket text-xs ml-0.5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-gray-900 pt-5 text-center relative z-10 space-y-3">
        <p className="text-xs text-gray-400 font-light">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="text-brand-secondary font-bold hover:underline">
            Tạo tài khoản học sinh
          </Link>
        </p>
        <span className="flex items-center justify-center gap-1.5 font-mono text-[9px] text-gray-600">
          <i className="fa-solid fa-shield-halved text-brand-primary" /> Bảo mật và mã hóa chuẩn NestJS API.
        </span>
      </div>
    </div>
  );
}
