"use client";

import { useEffect } from "react";

interface ColorTheme {
  text: string;
  bg: string;
  border: string;
  btnBg: string;
  btnHover: string;
  btnText: string;
}

const colorThemes: Record<string, ColorTheme> = {
  amber: {
    text: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    btnBg: "bg-amber-500/20",
    btnHover: "hover:bg-amber-500/30",
    btnText: "text-amber-400",
  },
  red: {
    text: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    btnBg: "bg-red-500/20",
    btnHover: "hover:bg-red-500/30",
    btnText: "text-red-400",
  },
  rose: {
    text: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
    btnBg: "bg-rose-500/20",
    btnHover: "hover:bg-rose-500/30",
    btnText: "text-rose-400",
  },
  sky: {
    text: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    btnBg: "bg-sky-500/20",
    btnHover: "hover:bg-sky-500/30",
    btnText: "text-sky-400",
  },
};

interface ErrorDetail {
  icon: string;
  theme: keyof typeof colorThemes;
  title: string;
  desc: string;
  btnText: string;
  action?: () => void;
}

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

  let statusCode = error.status;
  if (!statusCode) {
    const match = error.message.match(/\b(400|401|403|404|409)\b/);
    statusCode = match ? parseInt(match[1], 10) : 500;
  }

  const errorConfigs: Record<number, ErrorDetail> = {
    400: {
      icon: "fa-solid fa-triangle-exclamation",
      theme: "amber",
      title: "Yêu Cầu Không Hợp Lệ (400)",
      desc: "Yêu cầu gửi đi không hợp lệ hoặc dữ liệu không đúng cấu trúc hệ thống.",
      btnText: "Thử lại",
    },
    401: {
      icon: "fa-solid fa-lock",
      theme: "amber",
      title: "Chưa Xác Thực (401)",
      desc: "Phiên làm việc hết hạn hoặc thông tin đăng nhập không chính xác. Vui lòng đăng nhập lại.",
      btnText: "Đăng nhập lại",
      action: () => {
        window.location.assign("/login");
      },
    },
    403: {
      icon: "fa-solid fa-ban",
      theme: "rose",
      title: "Truy Cập Bị Từ Chối (403)",
      desc: "Tài khoản của bạn không được cấp quyền truy cập tài nguyên này.",
      btnText: "Quay lại trang chủ",
      action: () => {
        window.location.assign("/");
      },
    },
    404: {
      icon: "fa-solid fa-magnifying-glass",
      theme: "sky",
      title: "Không Tìm Thấy (404)",
      desc: "Đường dẫn hoặc tài nguyên bạn yêu cầu không tồn tại trên hệ thống.",
      btnText: "Quay lại trang chủ",
      action: () => {
        window.location.assign("/");
      },
    },
    409: {
      icon: "fa-solid fa-copy",
      theme: "amber",
      title: "Xung Đột Dữ Liệu (409)",
      desc: "Thông tin gửi đi bị xung đột hoặc đã tồn tại trong cơ sở dữ liệu.",
      btnText: "Thử lại",
    },
  };

  const config = errorConfigs[statusCode] || {
    icon: "fa-solid fa-server",
    theme: "red" as const,
    title: `Lỗi Hệ Thống (${statusCode})`,
    desc: "Đã xảy ra sự cố nghiêm trọng trên máy chủ. Chúng tôi đang kiểm tra và khắc phục sự cố này.",
    btnText: "Thử lại",
  };

  const color = colorThemes[config.theme] || colorThemes.red;

  const handleAction = () => {
    if (config.action) {
      config.action();
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-[#05070F] text-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className={`w-16 h-16 rounded-2xl ${color.bg} flex items-center justify-center ${color.text} text-2xl border ${color.border} mb-6`}>
        <i className={config.icon} />
      </div>
      <h1 className={`text-2xl font-black uppercase tracking-wide font-mono ${color.text}`}>
        {config.title}
      </h1>
      <p className="text-xs text-[#9CA3AF] font-light max-w-md mt-2 leading-relaxed">
        {config.desc}
      </p>
      <button
        onClick={handleAction}
        className={`mt-6 px-4 py-2 ${color.btnBg} ${color.btnHover} border ${color.border} rounded-xl text-xs font-bold ${color.btnText} transition-all`}
      >
        {config.btnText}
      </button>
    </div>
  );
}
