"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localFeedback, setLocalFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const { login, isLoading } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAdminLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalFeedback(null);

    try {
      await login(email, password);
      setLocalFeedback({
        type: "success",
        message: "Đăng nhập thành công! Đang chuyển hướng đến Command Dashboard...",
      });
      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Lỗi: Thông tin truy cập không hợp lệ.";
      setLocalFeedback({
        type: "error",
        message: errMsg,
      });
    }
  };

  return (
    <div className="w-full min-w-[320px] sm:min-w-105 lg:w-auto">
      <div className="glow-border relative overflow-hidden rounded-2xl border border-gray-800 bg-cyber-card/80 p-8 shadow-[0_0_50px_rgba(79,70,229,0.15)] backdrop-blur-xl">
        {/* Internal card ambient lights */}
        <div className="absolute -top-12 -right-12 -z-10 h-32 w-32 rounded-full bg-cyber-primary/20 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 -z-10 h-32 w-32 rounded-full bg-cyber-cyan/15 blur-2xl" />

        <div className="relative z-10 mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyber-alert" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-cyber-alert">
              Secure Access Only
            </span>
          </div>
          <h2 className="font-mono text-2xl font-black uppercase tracking-wide text-white">Xác thực Admin</h2>
          <p className="text-xs font-light text-gray-400">
            Vui lòng nhập định danh mã hóa để giải nén quyền truy cập hệ thống.
          </p>
        </div>

        {/* Feedback alert messages */}
        {localFeedback && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg p-3 font-mono text-xs border transition-all ${
              localFeedback.type === "success"
                ? "border-cyber-success/30 bg-cyber-success/10 text-cyber-success"
                : "border-cyber-alert/30 bg-cyber-alert/10 text-cyber-alert"
            }`}
          >
            <i
              className={`fa-solid ${
                localFeedback.type === "success" ? "fa-circle-check" : "fa-triangle-exclamation"
              }`}
            />
            <span>{localFeedback.message}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="relative z-10 space-y-4">
          <div className="space-y-1 text-left">
            <label htmlFor="admin-email" className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400">
              Định danh (Email)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fa-solid fa-user-shield text-sm" />
              </span>
              <input
                type="email"
                id="admin-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@edupath.org"
                className="w-full rounded-xl border border-gray-800 bg-cyber-bg py-3 pl-10 pr-4 font-mono text-sm text-white placeholder-gray-600 focus:border-cyber-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex justify-between items-center">
              <label
                htmlFor="admin-password"
                className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400"
              >
                Mật mã truy cập
              </label>
              <a href="#" className="font-mono text-[10px] text-cyber-cyan hover:underline">
                Quên mật mã?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <i className="fa-solid fa-key text-sm" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-gray-800 bg-cyber-bg py-3 pl-10 pr-10 font-mono text-sm text-white placeholder-gray-600 focus:border-cyber-primary focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white focus:outline-none"
              >
                <i className={`fa-solid ${showPassword ? "fa-eye" : "fa-eye-slash"} text-sm`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-800 bg-cyber-bg text-cyber-primary focus:ring-1 focus:ring-cyber-primary focus:ring-offset-0 focus:outline-none"
              />
              <span className="font-mono text-xs text-gray-400">Duy trì phiên điều khiển</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyber-primary via-[#6366F1] to-cyber-cyan py-4 font-mono text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-cyber-primary/20 transition-all hover:opacity-95 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner animate-spin" /> Đang xác thực chứng chỉ...
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-nodes" /> Đăng nhập bảng điều khiển
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-gray-900 pt-4 text-center relative z-10">
          <span className="flex items-center justify-center gap-1 font-mono text-[10px] text-gray-600">
            <i className="fa-solid fa-circle-exclamation text-cyber-alert" /> Mọi phiên truy cập sẽ được mã hóa và
            lưu vào audit_log.
          </span>
        </div>
      </div>
    </div>
  );
}
