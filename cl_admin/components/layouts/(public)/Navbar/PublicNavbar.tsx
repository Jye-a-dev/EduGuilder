"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PublicNavbar() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [latency, setLatency] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const checkStatus = async () => {
      const startTime = performance.now();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        const duration = Math.round(performance.now() - startTime);

        if (active) {
          // Any response from the target server indicates it is online
          if (response.ok || response.status >= 200) {
            setIsOnline(true);
            setLatency(duration);
          } else {
            setIsOnline(false);
            setLatency(null);
          }
        }
      } catch {
        clearTimeout(timeoutId);
        if (active) {
          setIsOnline(false);
          setLatency(null);
        }
      }
    };

    // Run verification immediately
    checkStatus();

    // Check server status periodically every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-900 bg-cyber-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 select-none">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-cyber-primary to-cyber-cyan shadow-lg shadow-cyber-primary/30">
            <i className="fa-solid fa-shield-halved text-sm text-white" />
          </div>
          <span className="font-mono text-lg font-black tracking-widest uppercase text-white">
            EduPath <span className="text-cyber-cyan">Admin</span>
          </span>
        </Link>

        <div className="hidden items-center gap-6 font-mono text-xs sm:flex">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  isOnline ? "bg-cyber-success" : "bg-cyber-alert"
                }`}
              />
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isOnline ? "bg-cyber-success" : "bg-cyber-alert"
                }`}
              />
            </span>
            <span>Hệ thống: {isOnline ? "ONLINE" : "OFFLINE"}</span>
          </div>
          <div className="h-4 w-px bg-gray-800" />
          <div className="text-gray-400">
            API Latency:{" "}
            <span className={`font-bold ${isOnline ? "text-cyber-cyan" : "text-cyber-alert"}`}>
              {latency !== null ? `${latency}ms` : "N/A"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}


