"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";

// Custom API Hooks
import { useUniversities } from "@/hooks/useUniversities";
import { useStudentVerifications } from "@/hooks/useStudentVerifications";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";

// Sub-components
import DashboardTab from "./DashboardTab";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Bind Custom Hooks
  const {
    universities,
    fetchUniversities,
  } = useUniversities(token);

  const {
    pendingVerificationsCount,
    fetchVerifications,
  } = useStudentVerifications(token);

  const {
    pendingReviewsCount,
    fetchReviews,
  } = useUniversityReviews(token);

  // Authenticate user on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      router.push("/");
      return;
    }
    setTimeout(() => {
      setToken(storedToken);
    }, 0);
  }, [router]);

  // Load overview counts on mount or when token shifts
  useEffect(() => {
    if (!token) return;
    Promise.all([
      fetchVerifications(),
      fetchReviews(),
      fetchUniversities(),
    ]);
  }, [token, fetchVerifications, fetchReviews, fetchUniversities]);

  const mockSetActiveTab = (path: "dashboard" | "verifications" | "reviews" | "universities" | "audit") => {
    if (path === "dashboard") router.push("/admin");
    else router.push(`/admin/${path}`);
  };

  return (
    <DashboardSetup>
      <DashboardTab
        pendingVerificationsCount={pendingVerificationsCount}
        pendingReviewsCount={pendingReviewsCount}
        universitiesCount={universities.length}
        setActiveTab={mockSetActiveTab}
      />
    </DashboardSetup>
  );
}
