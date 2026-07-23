"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useNotifications } from "@/hooks/useNotifications";
import { useUniversities } from "@/hooks/useUniversities";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const { user, logout, token } = useAuthContext();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load sidebar preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      const handle = setTimeout(() => {
        setIsCollapsed(true);
      }, 0);
      return () => clearTimeout(handle);
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  // Validate parameter role matches authenticated user role
  useEffect(() => {
    if (user && params.role && params.role !== user.role) {
      router.replace(`/${user.role}/dashboard`);
    }
  }, [user, params.role, router]);

  // Close sidebar on path change (mobile) during render to prevent cascading renders in useEffect
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsSidebarOpen(false);
  }

  const {
    notifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications(token);

  const { universities, fetchUniversities } = useUniversities(token);

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    fetchNotifications();
    fetchUniversities();
  }, [fetchNotifications, fetchUniversities]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = user
    ? [
      { href: `/${user.role}/dashboard`, label: "Tổng quan", icon: "fa-solid fa-compass" },
      ...(user.role === "student"
        ? [{ href: "/student/notes", label: "Workspace", icon: "fa-solid fa-note-sticky" }]
        : []),
      { href: `/${user.role}/knowledge`, label: "Đồ thị tri thức", icon: "fa-solid fa-circle-nodes" },
      {
        href: `/${user.role}/universities`,
        label: user.role === "uni" ? "Đánh giá từ sinh viên" : "Đánh giá từ học sinh",
        icon: "fa-solid fa-building-columns"
      },
      { href: `/${user.role}/exports`, label: "Tài liệu đã xuất", icon: "fa-solid fa-file-export" },
      { href: `/${user.role}/profile`, label: "Hồ sơ cá nhân", icon: "fa-solid fa-id-card-clip" },
      { href: `/${user.role}/settings`, label: "Cài đặt hệ thống", icon: "fa-solid fa-gears" },
    ]
    : [];

  if (!user) return null;

  // Format name to NV (e.g. Văn A Nguyễn -> NV)
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Find user's associated university name
  const userUni = universities.find((u) => u.id === user.university_id);
  const uniName = userUni
    ? userUni.name
    : (user.role === "student" ? `Học sinh Lớp ${user.current_grade || "12"}` : "Đại diện Trường");

  return (
    <div className="min-h-screen flex bg-brand-dark text-text-main font-sans relative overflow-hidden transition-colors duration-200">
      {/* Background radial glow */}
      <div className="absolute top-[-40%] left-[-20%] w-[80vw] h-[80vw] rounded-full bg-brand-primary/5 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-40%] right-[-20%] w-[80vw] h-[80vw] rounded-full bg-brand-secondary/5 blur-[150px] pointer-events-none z-0" />

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-screen
        bg-brand-sidebar border-r border-border-custom
        flex flex-col justify-between py-6 px-4
        transition-all duration-300 ease-out
        ${isSidebarOpen ? "translate-x-0 w-68" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed && !isSidebarOpen ? "w-20" : "w-68"}
      `}>
        {/* Toggle Collapse Button for Desktop */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex absolute top-6 -right-3.5 w-7 h-7 rounded-full border border-border-custom bg-brand-card hover:bg-white/5 items-center justify-center text-text-sub hover:text-text-main shadow-md transition-colors cursor-pointer z-50"
          title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
        >
          <i className={`fa-solid ${isCollapsed ? "fa-chevron-right" : "fa-chevron-left"} text-[10px]`} />
        </button>

        <div className="space-y-8">
          {/* Logo brand */}
          <div className={`flex items-center gap-3 px-3 transition-all ${isCollapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 shrink-0">
              <i className="fa-solid fa-rocket text-white text-lg animate-pulse" />
            </div>
            {!isCollapsed && (
              <span className="font-extrabold text-xl tracking-wider text-text-main font-mono uppercase animate-in fade-in duration-200">
                EduPath
              </span>
            )}
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            <ul className="space-y-1 list-none">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`
                        group flex items-center rounded-xl text-sm font-semibold transition-all duration-200
                        ${isCollapsed ? "justify-center p-3" : "gap-3.5 px-4 py-3"}
                        ${isActive
                          ? "bg-brand-primary/10 text-brand-primary shadow-xs"
                          : "text-text-sub hover:text-text-main hover:bg-gray-100/50 dark:hover:bg-gray-800/40"
                        }
                      `}
                      title={isCollapsed ? link.label : undefined}
                    >
                      <i className={`
                        ${link.icon} text-lg transition-transform duration-300 group-hover:scale-110 shrink-0
                        ${isActive ? "text-brand-primary" : "text-text-sub group-hover:text-text-main"}
                      `} />
                      {!isCollapsed && (
                        <span className="tracking-wide animate-in fade-in duration-200">{link.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Footer Profile Box & Logout */}
        <div className="space-y-4 pt-4 border-t border-border-custom">
          {/* User profile card matching screenshot - subtext role removed to prevent conflict */}
          <div className={`flex items-center rounded-2xl bg-brand-primary/5 border border-brand-primary/10 ${isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"}`}>
            <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center font-bold text-sm text-white uppercase font-mono shrink-0">
              {getInitials(user.full_name)}
            </div>
            {!isCollapsed && (
              <div className="truncate min-w-0 animate-in fade-in duration-200">
                <span className="block text-xs font-bold text-text-main truncate">{user.full_name}</span>
              </div>
            )}
          </div>

          <button
            onClick={logout}
            className={`flex items-center rounded-xl text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200 ${isCollapsed ? "justify-center p-3 w-full" : "w-full gap-3.5 px-4 py-2.5"
              }`}
            title={isCollapsed ? "Đăng xuất" : undefined}
          >
            <i className="fa-solid fa-right-from-bracket text-base shrink-0" />
            {!isCollapsed && (
              <span className="animate-in fade-in duration-200">Đăng xuất</span>
            )}
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col min-h-screen relative z-10 w-full overflow-hidden">
        {/* --- TOPBAR --- */}
        <header className="sticky top-0 z-30 h-18 bg-brand-dark/75 backdrop-blur-md border-b border-border-custom flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Trigger */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg bg-brand-card border border-border-custom hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main transition-colors md:hidden"
            >
              <i className="fa-solid fa-bars-staggered text-lg" />
            </button>

            {/* Search Bar matching screenshot */}
            <div className="relative hidden sm:block w-72">
              <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
              <input
                type="text"
                placeholder="Tìm trường, bài viết..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-brand-card border border-border-custom text-text-main placeholder-text-sub outline-hidden transition-all duration-300 focus:border-brand-primary/60 focus:bg-brand-card focus:shadow-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Interactive Notifications Panel */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`
                  relative w-10 h-10 rounded-xl bg-brand-card border border-border-custom flex items-center justify-center text-text-sub hover:text-text-main transition-all
                  ${isNotifOpen ? "text-text-main border-brand-primary/40 shadow-xs" : ""}
                `}
              >
                <i className="fa-regular fa-bell text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-brand-card border border-border-custom shadow-2xl p-4 space-y-3 z-50">
                  <div className="flex items-center justify-between border-b border-border-custom pb-2">
                    <span className="text-xs font-bold text-text-main uppercase tracking-wider font-mono">Thông báo gần đây</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => user && markAllAsRead(user.id)}
                        className="text-[10px] font-medium text-brand-primary hover:underline"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2.5">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-text-sub">
                        Không có thông báo mới.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.is_read && markAsRead(notif.id)}
                          className={`
                            p-2.5 rounded-xl border transition-colors flex gap-2.5 cursor-pointer
                            ${notif.is_read ? "bg-transparent border-transparent" : "bg-brand-primary/5 border-brand-primary/10"}
                          `}
                        >
                          <div className={`
                            w-7.5 h-7.5 rounded-full flex items-center justify-center shrink-0 text-xs
                            ${notif.type === "upload" ? "bg-blue-500/10 text-blue-400" : ""}
                            ${notif.type === "update" ? "bg-orange-500/10 text-orange-400" : ""}
                            ${notif.type === "comment" ? "bg-green-500/10 text-green-400" : "bg-purple-500/10 text-purple-400"}
                          `}>
                            <i className={`
                              ${notif.type === "upload" ? "fa-solid fa-cloud-arrow-up" : ""}
                              ${notif.type === "update" ? "fa-solid fa-circle-info" : ""}
                              ${notif.type === "comment" ? "fa-regular fa-comment-dots" : "fa-solid fa-bell"}
                            `} />
                          </div>
                          <div>
                            <p className={`text-[11px] leading-relaxed ${notif.is_read ? "text-text-sub" : "text-text-main font-medium"}`}>
                              {notif.title}
                            </p>
                            {notif.content && <p className="text-[10px] text-text-sub mt-0.5">{notif.content}</p>}
                            <span className="text-[9px] text-text-sub block mt-0.5">
                              {new Date(notif.created_at).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - {new Date(notif.created_at).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-brand-primary to-brand-secondary p-0.5 shadow-md shadow-brand-primary/10 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-full h-full rounded-[10px] bg-brand-card flex items-center justify-center font-bold text-sm text-text-main uppercase font-mono">
                    {getInitials(user.full_name)}
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="text-xs font-semibold text-text-main group-hover:text-brand-primary transition-colors truncate max-w-30">
                    {user.full_name}
                  </div>
                  <div className="text-[10px] text-text-sub font-mono truncate max-w-30">
                    {uniName}
                  </div>
                </div>
                <i className={`fa-solid fa-chevron-down text-[10px] text-text-sub transition-transform duration-300 group-hover:text-text-main ${isProfileOpen ? "rotate-180" : ""}`} />
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-brand-card border border-border-custom shadow-2xl p-2.5 space-y-1 z-50">
                  <div className="px-3 py-2 border-b border-border-custom mb-1">
                    <span className="block text-[9px] font-mono text-text-sub uppercase">Đang đăng nhập</span>
                    <span className="block text-xs font-bold text-text-main truncate">{user.email}</span>
                  </div>
                  <Link
                    href={`/${user.role}/profile`}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-text-sub hover:text-text-main hover:bg-gray-100/50 dark:hover:bg-gray-800/40 transition-colors"
                  >
                    <i className="fa-regular fa-user text-sm" /> Thiết lập tài khoản
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-red-500 hover:text-red-400 hover:bg-red-500/10 transition-colors text-left"
                  >
                    <i className="fa-solid fa-right-from-bracket text-sm" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* --- DYNAMIC CHILD PAGES --- */}
        <main className="flex-1 overflow-y-auto px-6 md:px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
