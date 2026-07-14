"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminUser } from "@/components/pages/AdminDashboard/types";

interface SidebarProps {
  currentUser: AdminUser;
  pendingVerificationsCount: number;
  pendingReviewsCount: number;
  isDbOnline: boolean;
  handleLogout: () => void;
}

export default function Sidebar({
  currentUser,
  pendingVerificationsCount,
  pendingReviewsCount,
  isDbOnline,
  handleLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const initials = currentUser.full_name
    ? currentUser.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-full md:w-64 bg-cyber-card/90 border-r border-gray-900 flex flex-col justify-between z-30 shrink-0 select-none">
      <div>
        <div className="h-20 px-6 flex items-center gap-3 border-b border-gray-900">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-cyber-primary to-cyber-cyan flex items-center justify-center">
            <i className="fa-solid fa-shield-halved text-white text-sm"></i>
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-white uppercase font-mono block">EDUPATH</span>
            <span className="text-[10px] font-mono text-cyber-cyan tracking-wider block">CORE ADMIN v2.0</span>
          </div>
        </div>

        <div className="p-4 mx-3 my-4 rounded-xl bg-cyber-bg/50 border border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyber-primary/20 border border-cyber-primary/40 flex items-center justify-center text-cyber-cyan font-bold font-mono">
              {initials}
            </div>
            <div>
              <span className="text-xs font-bold text-white block truncate max-w-25">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] font-mono text-cyber-success block">
                <i className="fa-solid fa-circle text-[8px] animate-pulse mr-1"></i> Operator
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="text-gray-500 hover:text-cyber-alert transition-colors p-1"
          >
            <i className="fa-solid fa-right-from-bracket text-sm"></i>
          </button>
        </div>

        <nav className="px-2 space-y-1">
          <Link
            href="/admin"
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${
              isActive("/admin") && !isActive("/admin/verifications") && !isActive("/admin/reviews") && !isActive("/admin/universities") && !isActive("/admin/audit") && !isActive("/admin/accounts")
                ? "bg-linear-to-r from-cyber-primary/15 via-cyber-cyan/5 to-transparent border-l-4 border-cyber-cyan text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <i className="fa-solid fa-chart-line text-sm w-5"></i> Dashboard Overview
          </Link>

          <Link
            href="/admin/verifications"
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${
              isActive("/admin/verifications")
                ? "bg-linear-to-r from-cyber-primary/15 via-cyber-cyan/5 to-transparent border-l-4 border-cyber-cyan text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <i className="fa-solid fa-id-card text-sm w-5"></i> Xác thực thẻ SV
            {pendingVerificationsCount > 0 && (
              <span className="ml-auto text-[10px] font-mono bg-cyber-alert/15 text-cyber-alert px-1.5 py-0.5 rounded-full border border-cyber-alert/20 font-bold">
                {pendingVerificationsCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/reviews"
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${
              isActive("/admin/reviews")
                ? "bg-linear-to-r from-cyber-primary/15 via-cyber-cyan/5 to-transparent border-l-4 border-cyber-cyan text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <i className="fa-solid fa-comments text-sm w-5"></i> Kiểm duyệt Review
            {pendingReviewsCount > 0 && (
              <span className="ml-auto text-[10px] font-mono bg-cyber-warning/15 text-cyber-warning px-1.5 py-0.5 rounded-full border border-cyber-warning/20 font-bold">
                {pendingReviewsCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/universities"
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${
              isActive("/admin/universities")
                ? "bg-linear-to-r from-cyber-primary/15 via-cyber-cyan/5 to-transparent border-l-4 border-cyber-cyan text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <i className="fa-solid fa-school text-sm w-5"></i> Quản lý Đại Học
          </Link>

          <Link
            href="/admin/audit"
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${
              isActive("/admin/audit")
                ? "bg-linear-to-r from-cyber-primary/15 via-cyber-cyan/5 to-transparent border-l-4 border-cyber-cyan text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <i className="fa-solid fa-receipt text-sm w-5"></i> Audit Logs
          </Link>

          <Link
            href="/admin/accounts"
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${
              isActive("/admin/accounts")
                ? "bg-linear-to-r from-cyber-primary/15 via-cyber-cyan/5 to-transparent border-l-4 border-cyber-cyan text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-800/40"
            }`}
          >
            <i className="fa-solid fa-users text-sm w-5"></i> Quản lý Tài Khoản
          </Link>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-900 bg-cyber-bg/30">
        <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
          <span>DATABASE STATUS</span>
          <span className={isDbOnline ? "text-cyber-success font-bold" : "text-cyber-alert font-bold"}>
            {isDbOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        <div className="w-full bg-gray-900 h-1 rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isDbOnline ? "bg-cyber-success w-full" : "bg-cyber-alert w-[0%]"
            }`}
          ></div>
        </div>
      </div>
    </aside>
  );
}
