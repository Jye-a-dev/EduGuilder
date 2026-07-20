"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Lỗi ứng dụng:", error);
  }, [error]);

  const statusCode = error.status || (error.message.includes("400") ? 400 : 500);

  if (statusCode === 400) {
    return (
      <div className="min-h-screen bg-[#05070F] text-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 text-2xl border border-amber-500/20 mb-6">
          <i className="fa-solid fa-triangle-exclamation" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wide font-mono text-amber-500">
          Lỗi Yêu Cầu (400 Bad Request)
        </h1>
        <p className="text-xs text-[#9CA3AF] font-light max-w-md mt-2 leading-relaxed">
          Yêu cầu gửi đi không hợp lệ hoặc dữ liệu không đúng định dạng cấu trúc hệ thống.
        </p>
        <button
          onClick={reset}
          className="mt-6 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-400 transition-all"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070F] text-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 text-2xl border border-red-500/20 mb-6">
        <i className="fa-solid fa-server" />
      </div>
      <h1 className="text-2xl font-black uppercase tracking-wide font-mono text-red-500">
        Lỗi Hệ Thống (500 Server Error)
      </h1>
      <p className="text-xs text-[#9CA3AF] font-light max-w-md mt-2 leading-relaxed">
        Đã xảy ra sự cố nghiêm trọng trên máy chủ. Chúng tôi đang kiểm tra và khắc phục sự cố này.
      </p>
      <button
        onClick={reset}
        className="mt-6 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-xs font-bold text-red-400 transition-all"
      >
        Thử lại
      </button>
    </div>
  );
}
