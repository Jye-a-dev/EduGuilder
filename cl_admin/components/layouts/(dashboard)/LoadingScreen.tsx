"use client";

import { useEffect, useState } from "react";

const BOOT_LINES = [
  { label: "KERNEL INIT", value: "OK", color: "text-cyber-success" },
  { label: "AUTH MODULE", value: "LOADED", color: "text-cyber-cyan" },
  { label: "DB CONNECTION", value: "ESTABLISHING...", color: "text-cyber-warning" },
  { label: "PRIVILEGE CHECK", value: "VERIFYING...", color: "text-cyber-warning" },
  { label: "ADMIN CONTEXT", value: "MOUNTING", color: "text-cyber-primary" },
];

export default function LoadingScreen() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    // Reveal boot lines sequentially
    const lineInterval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= BOOT_LINES.length) {
          clearInterval(lineInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 320);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    // Scan line animation
    const scanInterval = setInterval(() => {
      setScanY((prev) => (prev >= 100 ? 0 : prev + 1.5));
    }, 16);

    return () => {
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      clearInterval(scanInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-cyber-bg flex items-center justify-center overflow-hidden">
      {/* Dot-grid background */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

      {/* Scan line */}
      <div
        className="absolute left-0 right-0 h-px bg-cyber-cyan/20 pointer-events-none transition-none"
        style={{ top: `${scanY}%` }}
      />
      <div
        className="absolute left-0 right-0 h-16 pointer-events-none"
        style={{
          top: `${scanY - 8}%`,
          background:
            "linear-gradient(to bottom, transparent, rgba(6,182,212,0.04), transparent)",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-6 h-6 border-t-2 border-l-2 border-cyber-cyan/60" />
      <div className="absolute top-6 right-6 w-6 h-6 border-t-2 border-r-2 border-cyber-cyan/60" />
      <div className="absolute bottom-6 left-6 w-6 h-6 border-b-2 border-l-2 border-cyber-cyan/60" />
      <div className="absolute bottom-6 right-6 w-6 h-6 border-b-2 border-r-2 border-cyber-cyan/60" />

      {/* Main card */}
      <div className="relative w-[420px] max-w-[90vw]">
        {/* Logo */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyber-primary to-cyber-cyan flex items-center justify-center shadow-lg shadow-cyber-primary/30">
            <i className="fa-solid fa-shield-halved text-white text-xl" />
          </div>
          <div>
            <span className="block text-xl font-black font-mono tracking-widest text-white uppercase">
              EDUPATH
            </span>
            <span className="block text-xs font-mono text-cyber-cyan tracking-wider">
              CORE ADMIN v2.0
            </span>
          </div>
        </div>

        {/* Boot log terminal */}
        <div className="bg-cyber-card/80 border border-gray-800 rounded-xl p-5 font-mono text-xs mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800">
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-alert" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-warning" />
            <div className="w-2.5 h-2.5 rounded-full bg-cyber-success" />
            <span className="ml-2 text-gray-500 text-[10px] tracking-widest uppercase">
              System Boot Log
            </span>
          </div>

          <div className="space-y-1.5 min-h-[100px]">
            {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className="flex items-center gap-2 animate-[fadeSlideIn_0.25s_ease_forwards]"
              >
                <span className="text-gray-600">›</span>
                <span className="text-gray-400 flex-1">{line.label}</span>
                <span className={`${line.color} font-bold`}>{line.value}</span>
              </div>
            ))}
            {visibleLines < BOOT_LINES.length && (
              <div className="flex items-center gap-2">
                <span className="text-cyber-cyan animate-pulse">_</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-gray-500">
            <span>INITIALIZING ADMIN CONTEXT</span>
            <span className="text-cyber-cyan">{progress}%</span>
          </div>
          <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-100 ease-linear"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, #4f46e5, #06b6d4)",
                boxShadow: "0 0 8px rgba(6,182,212,0.6)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
