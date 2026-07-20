"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";

export default function DashboardRedirect() {
  const { user, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace(`/${user.role}/dashboard`);
      } else {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router]);

  return null;
}
