"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import { useDashboard } from "@/components/layouts/(dashboard)/DashboardContext";
import { useUniversities } from "@/hooks/useUniversities";
import { useStudentVerifications } from "@/hooks/useStudentVerifications";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";
import DashboardTab from "./DashboardTab";

function DashboardInner() {
  const { token } = useDashboard();
  const router = useRouter();

  const { universities, fetchUniversities } = useUniversities(token);
  const { pendingVerificationsCount, fetchVerifications } = useStudentVerifications(token);
  const { pendingReviewsCount, fetchReviews } = useUniversityReviews(token);

  useEffect(() => {
    Promise.all([fetchVerifications(), fetchReviews(), fetchUniversities()]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const setActiveTab = (path: "dashboard" | "verifications" | "reviews" | "universities" | "audit") => {
    if (path === "dashboard") router.push("/admin");
    else router.push(`/admin/${path}`);
  };

  return (
    <DashboardTab
      pendingVerificationsCount={pendingVerificationsCount}
      pendingReviewsCount={pendingReviewsCount}
      universitiesCount={universities.length}
      setActiveTab={setActiveTab}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <DashboardSetup>
      <DashboardInner />
    </DashboardSetup>
  );
}
