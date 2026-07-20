"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to previous route or default to dashboard
    if (typeof window !== "undefined") {
      const hasHistory = window.history.length > 1;
      if (hasHistory) {
        router.back();
      } else {
        router.push("/dashboard");
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#05070F] text-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-2xl border border-indigo-500/20 mb-6">
        <i className="fa-solid fa-compass-drafting animate-spin" />
      </div>
      <h1 className="text-xl font-bold uppercase tracking-wide font-mono text-gray-300">
        Không tìm thấy trang (404)
      </h1>
      <p className="text-xs text-[#9CA3AF] mt-1 font-light">
        Đang tự động chuyển hướng bạn trở lại trang khả dụng gần nhất...
      </p>
    </div>
  );
}
