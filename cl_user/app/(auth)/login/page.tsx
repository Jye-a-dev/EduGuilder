"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { login, isLoading } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    try {
      await login(email, password);
      setFeedback({ type: "success", message: "Đăng nhập thành công! Đang tải hệ thống..." });
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (err: unknown) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Đăng nhập không thành công.",
      });
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-dark)" }}>

      {/* ── LEFT: Form panel (4/10 → col-span-4) ────────────────────────── */}
      <div
        className="flex flex-col justify-center w-full lg:w-5/12 xl:w-4/12 min-h-screen px-8 sm:px-12 lg:px-14 xl:px-16 relative z-10"
        style={{ backgroundColor: "var(--auth-card-bg)", borderRight: "1px solid var(--auth-divider)" }}
      >
        {/* Theme toggle top-right of form panel */}
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

        {/* Back to home */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold transition-colors"
          style={{ color: "var(--body-muted)" }}
        >
          <i className="fa-solid fa-arrow-left text-[10px]" /> Trang chủ
        </Link>

        {/* Logo */}
        <div className="mb-10">
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
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: "var(--heading)" }}>
            Chào mừng trở lại
          </h1>
          <p className="text-sm font-light" style={{ color: "var(--body-muted)" }}>
            Đăng nhập để tiếp cận hành tinh tri thức của bạn.
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
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="auth-label">Địa chỉ Email</label>
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
                placeholder="ten@truong.edu.vn"
                className="w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) text-(--auth-input-text) py-3.5 pl-10 pr-4 font-mono text-sm placeholder-(--auth-placeholder) focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="pass" className="auth-label" style={{ margin: 0 }}>Mật khẩu</label>
              <a href="#" className="text-[10px] font-mono text-brand-secondary hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: "var(--body-muted)" }}>
                <i className="fa-solid fa-lock text-sm" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="pass"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-(--auth-input-border) bg-(--auth-input-bg) text-(--auth-input-text) py-3.5 pl-10 pr-10 font-mono text-sm placeholder-(--auth-placeholder) focus:border-brand-secondary focus:ring-1 focus:ring-brand-secondary focus:outline-none transition-all"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary py-3.5 font-mono text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-brand-primary/25 hover:opacity-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all mt-2"
          >
            {isLoading ? (
              <><i className="fa-solid fa-spinner animate-spin" /> Đang kiểm tra...</>
            ) : (
              <>Đăng nhập <i className="fa-solid fa-arrow-right-to-bracket text-xs ml-0.5" /></>
            )}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-8 pt-6 text-center" style={{ borderTop: "1px solid var(--auth-divider)" }}>
          <p className="text-xs font-light" style={{ color: "var(--body-muted)" }}>
            Chưa có tài khoản?{" "}
            <Link href="/register" className="text-brand-secondary font-bold hover:underline">
              Tạo tài khoản học sinh
            </Link>
          </p>
          <span className="flex items-center justify-center gap-1.5 font-mono text-[9px] mt-3" style={{ color: "var(--stat-label)" }}>
            <i className="fa-solid fa-shield-halved text-brand-primary" /> Bảo mật và mã hóa chuẩn NestJS API.
          </span>
        </div>
      </div>

      {/* ── RIGHT: Visual panel (6/10 → col-span-6) ─────────────────────── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden"
        style={{ background: "var(--auth-panel-bg)" }}
      >
        {/* Ambient orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-brand-primary/20 blur-[120px] pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-brand-accent/15 blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-secondary/10 blur-[90px] pointer-events-none" />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-lg px-12 text-center space-y-10">

          {/* Planet illustration */}
          <div className="relative flex justify-center mb-6">
            <div className="w-52 h-52 rounded-full bg-linear-to-tr from-brand-secondary via-brand-primary to-brand-accent flex items-center justify-center shadow-[0_0_80px_rgba(6,182,212,0.4)] relative animate-float">
              <i className="fa-solid fa-planet-ringed text-white" style={{ fontSize: "5rem" }} />
              <span className="absolute top-3 right-3 w-5 h-5 bg-brand-accent rounded-full shadow-[0_0_12px_#A855F7]" />
              <span className="absolute bottom-4 left-4 w-3 h-3 bg-brand-secondary rounded-full shadow-[0_0_8px_#06B6D4]" />
            </div>
            {/* Orbit ring */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-dashed animate-spin"
              style={{ borderColor: "var(--border-subtle)", animationDuration: "20s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-dashed animate-spin"
              style={{ borderColor: "var(--border-subtle)", animationDuration: "35s", animationDirection: "reverse", opacity: 0.5 }}
            />
          </div>

          {/* Headlines */}
          <div>
            <h2 className="text-4xl font-black leading-[1.15] mb-4" style={{ color: "var(--auth-panel-text)" }}>
              Hành Tinh Tri Thức <br />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-secondary via-brand-primary to-brand-accent">
                Của Riêng Bạn
              </span>
            </h2>
            <p className="text-base font-light leading-relaxed" style={{ color: "var(--auth-panel-sub)" }}>
              Kết nối ghi chép thông minh, định hướng nghề nghiệp tự động. Gia nhập cùng{" "}
              <strong style={{ color: "var(--auth-panel-text)", fontWeight: 700 }}>50.000+ học sinh</strong>{" "}
              đang làm chủ tương lai của họ.
            </p>
          </div>

          {/* Stats row */}
          <div
            className="grid grid-cols-3 gap-4 py-6 rounded-2xl"
            style={{
              background: theme === "dark" ? "rgba(13,19,36,0.6)" : "rgba(255,255,255,0.55)",
              border: "1px solid var(--border-card)",
              backdropFilter: "blur(12px)",
            }}
          >
            {[
              { val: "2.5M+", label: "Ghi chú", color: "var(--auth-panel-text)" },
              { val: "94.2%", label: "Chuẩn xác AI", color: "#06B6D4" },
              { val: "120+", label: "Đại học", color: "#8B5CF6" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black tracking-tight" style={{ color: s.color }}>{s.val}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--stat-label)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Features list */}
          <ul className="space-y-3 text-sm text-left" style={{ color: "var(--auth-panel-sub)" }}>
            {[
              { icon: "fa-solid fa-brain", text: "PKM Graph — Đồ thị tri thức 3D liên kết đa chiều" },
              { icon: "fa-solid fa-trophy", text: "Octalysis Gamification — Tiến hóa hành tinh học tập" },
              { icon: "fa-solid fa-robot", text: "AI Matching — Gợi ý ngành nghề dựa trên năng lực thực tế" },
            ].map((f) => (
              <li key={f.text} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-secondary text-xs shrink-0 mt-0.5">
                  <i className={f.icon} />
                </span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>

    </div>
  );
}
