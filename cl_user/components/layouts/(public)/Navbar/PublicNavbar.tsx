import Link from "next/link";

import BaseNavbar from "@/components/layouts/@base/Navbar/BaseNavbar";

export default function PublicNavbar() {
  return (
    <BaseNavbar
      brand={
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-11 h-11 rounded-xl bg-linear-to-tr from-brand-primary via-brand-accent to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/30 group-hover:rotate-185 transition-all duration-500">
            <i className="fa-solid fa-orbit text-white text-xl animate-spin" style={{ animationDuration: "15s" }}></i>
          </div>
          <span className="text-2xl font-black tracking-wider bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-400">
            EduPath
          </span>
        </Link>
      }
      action={
        <div className="flex items-center gap-4">
          <a
            href="#pricing"
            className="hidden sm:inline-flex text-sm font-bold text-gray-300 hover:text-white transition-colors"
          >
            Khám phá
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary text-sm font-bold text-white hover:opacity-90 shadow-lg shadow-brand-primary/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            Trải nghiệm ngay
          </a>
        </div>
      }
    >
      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-400">
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
