"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";

interface AuthRedirectGuardProps {
  children: ReactNode;
}

export default function AuthRedirectGuard({ children }: AuthRedirectGuardProps) {
  const { token, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && token) {
      router.replace("/dashboard");
    }
  }, [token, isLoading, router]);

  if (isLoading) {
    return (
      <div
        className="min-h-screen w-full flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: "var(--bg-dark)" }}
      >
        <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-brand-primary via-brand-accent to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/30 animate-pulse">
          <i className="fa-solid fa-orbit text-white text-xl animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <span className="text-xs font-mono" style={{ color: "var(--body-muted)" }}>
          Đang xác thực phiên làm việc...
        </span>
      </div>
    );
  }

  // Prevent flash of login/register contents if token exists and redirecting
  if (token) {
    return null;
  }

  return <>{children}</>;
}
