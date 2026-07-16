"use client";

import { createContext, useContext } from "react";
import type { AdminUser } from "@/components/pages/AdminDashboard/types";

interface DashboardContextValue {
  token: string;
  currentUser: AdminUser;
  handleLogout: () => void;
}

export const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used inside DashboardSetup");
  }
  return ctx;
}
