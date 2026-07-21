"use client";

import { useEffect } from "react";

export default function LoadingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="fixed inset-0 z-9999 bg-cyber-bg flex flex-col items-center justify-center overflow-hidden">
      {/* Dot-grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Modern Circular Spinner */}
      <div className="relative w-16 h-16">
        {/* Outer glowing track */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
        {/* Spinning active ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-cyber-cyan border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        {/* Inner pulsing cyber logo/dot */}
        <div className="absolute inset-4 rounded-full bg-cyber-primary/20 border border-cyber-primary/40 animate-pulse flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" />
        </div>
      </div>

      <div className="mt-6 text-center z-10 space-y-1">
        <span className="block text-[10px] font-mono text-cyber-cyan uppercase tracking-[0.25em] animate-pulse">
          Đang tải dữ liệu...
        </span>
        <span className="block text-[8px] font-mono text-gray-650 uppercase tracking-widest">
          EduGuilder Core Engine
        </span>
      </div>
    </div>
  );
}
