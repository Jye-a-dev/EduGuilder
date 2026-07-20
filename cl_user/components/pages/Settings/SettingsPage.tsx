"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;
    
    // Defer state update to avoid synchronous cascading renders warning
    setTimeout(() => {
      setTheme(initialTheme);
    }, 0);
  }, []);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 relative">
      <div>
        <h1 className="text-3xl font-black text-text-main tracking-wide uppercase font-mono">
          Thiết lập hệ thống
        </h1>
        <p className="text-sm text-text-sub font-light mt-1">
          Tùy chỉnh cấu hình hiển thị và giao diện EduPath Portal của bạn.
        </p>
      </div>

      <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-text-main">Chủ đề & Giao diện</h2>
          <p className="text-xs text-text-sub font-light mt-0.5">
            Thay đổi màu nền của ứng dụng để phù hợp với môi trường làm việc của bạn.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div 
            onClick={() => handleThemeChange("light")}
            className={`
              cursor-pointer rounded-xl border p-4 flex flex-col items-center gap-3 transition-all duration-200
              ${theme === "light" 
                ? "border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/5 text-brand-primary" 
                : "border-border-custom bg-gray-50/10 text-text-sub hover:border-gray-400"
              }
            `}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-500 text-lg">
              <i className="fa-regular fa-sun" />
            </div>
            <span className="text-xs font-bold font-mono uppercase tracking-wider">Chế độ Sáng (Light)</span>
          </div>

          <div 
            onClick={() => handleThemeChange("dark")}
            className={`
              cursor-pointer rounded-xl border p-4 flex flex-col items-center gap-3 transition-all duration-200
              ${theme === "dark" 
                ? "border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/5 text-brand-primary" 
                : "border-border-custom bg-gray-50/10 text-text-sub hover:border-gray-400"
              }
            `}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-400 text-lg">
              <i className="fa-regular fa-moon" />
            </div>
            <span className="text-xs font-bold font-mono uppercase tracking-wider">Chế độ Tối (Dark)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
