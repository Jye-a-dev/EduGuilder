"use client";

import { usePathname } from "next/navigation";

interface HeaderProps {
  universitiesCount: number;
}

export default function Header({ universitiesCount }: HeaderProps) {
  const pathname = usePathname();

  let title = "Dashboard Overview";
  let description = "Chỉ số vận hành hệ thống theo thời gian thực.";

  if (pathname.includes("/admin/verifications")) {
    title = "Xác thực thẻ Học Sinh";
    description = "Phê duyệt hoặc từ chối thẻ học sinh để cho phép đánh giá.";
  } else if (pathname.includes("/admin/reviews")) {
    title = "Kiểm duyệt Reviews";
    description = "Duyệt nội dung nhận xét và phản hồi học sinh.";
  } else if (pathname.includes("/admin/universities")) {
    title = "Quản lý Đại Học";
    description = "Danh sách và quản trị các đối tác trường đại học.";
  } else if (pathname.includes("/admin/audit")) {
    title = "Audit Logs hệ thống";
    description = "Nhật ký hành động truy vết bảo mật của hệ thống.";
  } else if (pathname.includes("/admin/accounts")) {
    title = "Quản lý Tài Khoản";
    description = "Danh sách, phân quyền và quản trị tài khoản người dùng.";
  }

  return (
    <header className="h-20 bg-cyber-bg/40 border-b border-gray-900 px-8 flex items-center justify-between shrink-0 select-none">
      <div>
        <h1 className="text-lg font-black font-mono text-white tracking-wider uppercase">
          {title}
        </h1>
        <p className="text-xs text-gray-500">
          {description}
        </p>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        <div className="text-right">
          <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-widest">
            Database Source
          </span>
          <span className="text-base font-black font-mono text-white block">
            PostgreSQL <span className="text-cyber-success text-xs font-normal"><i className="fa-solid fa-server" /></span>
          </span>
        </div>
        <div className="h-8 w-px bg-gray-800"></div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-gray-500 block uppercase tracking-widest">
            Partner Universities
          </span>
          <span className="text-base font-black font-mono text-cyber-cyan block">
            {universitiesCount}
          </span>
        </div>
      </div>
    </header>
  );
}
