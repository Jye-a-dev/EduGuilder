"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

// Layout components
import Sidebar from "./Sidebar";
import Header from "./Header";

// Custom API Hooks
import { useStudentVerifications } from "@/hooks/useStudentVerifications";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";
import { useUniversities } from "@/hooks/useUniversities";

// Types
import type { AdminUser } from "@/components/pages/AdminDashboard/types";

interface DashboardSetupProps {
  children: ReactNode;
}

export default function DashboardSetup({ children }: DashboardSetupProps) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [isDbOnline, setIsDbOnline] = useState(true);

  // Bind Hooks for metadata
  const {
    pendingVerificationsCount,
    fetchVerifications,
  } = useStudentVerifications(token);

  const {
    pendingReviewsCount,
    fetchReviews,
  } = useUniversityReviews(token);

  const {
    universities,
    fetchUniversities,
  } = useUniversities(token);

  // Authenticate user on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    const storedUser = localStorage.getItem("admin_user");

    if (!storedToken || !storedUser) {
      router.push("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== "admin") {
        router.push("/");
        return;
      }
      setTimeout(() => {
        setToken(storedToken);
        setCurrentUser(parsedUser);
      }, 0);
    } catch {
      router.push("/");
    }
  }, [router]);

  // Load sidebar counts on mount or when token shifts
  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetchVerifications(),
      fetchReviews(),
      fetchUniversities(),
    ])
      .then(() => {
        setIsDbOnline(true);
      })
      .catch(() => {
        setIsDbOnline(false);
      });
  }, [token, fetchVerifications, fetchReviews, fetchUniversities]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/");
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-cyber-bg text-gray-400 font-mono text-sm">
        <i className="fa-solid fa-spinner animate-spin mr-2" /> Đang xác minh quyền điều hành...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-cyber-bg text-gray-100 font-sans antialiased overflow-hidden">
      <Sidebar
        currentUser={currentUser}
        pendingVerificationsCount={pendingVerificationsCount}
        pendingReviewsCount={pendingReviewsCount}
        isDbOnline={isDbOnline}
        handleLogout={handleLogout}
      />
      <div className="grow flex flex-col h-screen overflow-hidden relative">
        <Header universitiesCount={universities.length} />
        <main className="grow p-6 sm:p-8 overflow-y-auto custom-scrollbar bg-cyber-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
