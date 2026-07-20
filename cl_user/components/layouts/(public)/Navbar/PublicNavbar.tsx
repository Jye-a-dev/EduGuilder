"use client";

import Link from "next/link";
import BaseNavbar from "@/components/layouts/@base/Navbar/BaseNavbar";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useTheme } from "@/components/providers/ThemeProvider";

export default function PublicNavbar() {
  const { user, logout } = useAuthContext();
  const { theme, toggle } = useTheme();

  return (
    <BaseNavbar
      brand={
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-brand-primary via-brand-accent to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/30 group-hover:rotate-185 transition-all duration-500">
            <i className="fa-solid fa-orbit text-white text-xl animate-spin" style={{ animationDuration: "15s" }}></i>
          </div>
          <span className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary">
            EduPath
          </span>
        </Link>
      }
      action={
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={theme === "dark" ? "Chuyển sang Light mode" : "Chuyển sang Dark mode"}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-(--body-muted) hover:text-(--heading) hover:bg-(--btn-ghost-bg) transition-all cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <i className="fa-solid fa-sun text-base" />
            ) : (
              <i className="fa-solid fa-moon text-base" />
            )}
          </button>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex text-sm font-bold text-(--nav-link) hover:text-(--nav-link-hover) transition-colors"
              >
                Xin chào, {user.full_name.split(" ").pop()}
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-linear-to-r from-brand-primary to-brand-secondary text-sm font-bold text-white hover:opacity-90 shadow-lg shadow-brand-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Dashboard <i className="fa-solid fa-gauge ml-1.5 text-xs" />
              </Link>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="text-(--body-muted) hover:text-red-400 p-2 transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-right-from-bracket text-base" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex text-sm font-bold text-(--nav-link) hover:text-(--nav-link-hover) transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary text-sm font-bold text-white hover:opacity-90 shadow-lg shadow-brand-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Trải nghiệm ngay
              </Link>
            </>
          )}
        </div>
      }
    >
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-(--nav-link)">
        <a
          href="#features"
          className="hover:text-brand-secondary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-brand-secondary hover:after:w-full after:transition-all"
        >
          Tính năng cốt lõi
        </a>
        <a
          href="#ecosystem"
          className="hover:text-brand-secondary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-brand-secondary hover:after:w-full after:transition-all"
        >
          Hệ sinh thái
        </a>
        <a
          href="#gamification"
          className="hover:text-brand-secondary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-brand-secondary hover:after:w-full after:transition-all"
        >
          Gamification
        </a>
        <a
          href="#pricing"
          className="hover:text-brand-secondary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-brand-secondary hover:after:w-full after:transition-all"
        >
          Bảng giá
        </a>
      </nav>
    </BaseNavbar>
  );
}
