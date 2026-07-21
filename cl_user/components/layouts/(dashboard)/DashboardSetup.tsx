"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";

interface DashboardSetupProps {
  children: ReactNode;
}

function LoadingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.reload();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-brand-dark flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-brand-secondary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="absolute inset-4 rounded-full bg-brand-primary/20 border border-brand-primary/40 animate-pulse flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
        </div>
      </div>
      <div className="mt-6 text-center z-10 space-y-1">
        <span className="block text-[10px] font-mono text-brand-secondary uppercase tracking-[0.25em] animate-pulse">
          Đang khởi tạo hệ thống...
        </span>
        <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest">
          EduGuilder Portal v1.0
        </span>
      </div>
    </div>
  );
}

export default function DashboardSetup({ children }: DashboardSetupProps) {
  const { token, user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!token || !user) {
        router.push("/login");
      } else if (user.role === "admin") {
        router.push("/");
      }
    }
  }, [isLoading, token, user, router]);

  if (isLoading || !token || !user || user.role === "admin") {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
