"use client";

import { useAuthContext } from "@/components/providers/AuthProvider";

export default function UserDashboardPage() {
  const { user, logout } = useAuthContext();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Background lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-10 space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-900 pb-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/15 border border-brand-primary/30 text-brand-secondary text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span> Portal Online
            </span>
            <h1 className="text-3xl font-black text-white tracking-wide uppercase font-mono">
              Hành Tinh Tri Thức
            </h1>
            <p className="text-sm text-gray-400 font-light">
              Chào mừng bạn trở lại, quản lý lộ trình học tập cá nhân của bạn.
            </p>
          </div>
          
          <button
            onClick={logout}
            className="px-5 py-2.5 rounded-xl bg-gray-800/80 hover:bg-red-900/20 hover:text-red-400 hover:border-red-500/30 border border-gray-700 text-sm font-bold text-gray-300 transition-all flex items-center gap-2"
          >
            Đăng xuất <i className="fa-solid fa-right-from-bracket text-xs" />
          </button>
        </div>

        {/* User Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="md:col-span-2 glow-border relative overflow-hidden rounded-2xl border border-gray-800 bg-brand-card/80 p-6 md:p-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-tr from-brand-primary to-brand-secondary flex items-center justify-center text-white text-2xl font-black font-mono shadow-lg shadow-brand-primary/20">
                {user.full_name ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "US"}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
                <span className="text-xs font-mono text-gray-500">{user.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 border-t border-gray-900 pt-6">
              <div>
                <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Vai trò hệ thống</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  {user.role === "student" ? (
                    <>
                      <i className="fa-solid fa-graduation-cap text-brand-secondary" /> Học sinh / Sinh viên
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-building-columns text-brand-accent" /> Đại diện trường đại học
                    </>
                  )}
                </span>
              </div>

              {user.current_grade && (
                <div>
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Lớp học hiện tại</span>
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    <i className="fa-solid fa-school text-brand-primary" /> Lớp {user.current_grade}
                  </span>
                </div>
              )}

              {user.university_id && (
                <div className="col-span-2">
                  <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Đại học liên kết</span>
                  <span className="text-sm font-semibold text-gray-300 flex items-center gap-1.5">
                    <i className="fa-solid fa-university text-brand-accent" /> {user.university_id}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Eco Points Card */}
          <div className="glow-border relative overflow-hidden rounded-2xl border border-gray-800 bg-brand-card/85 p-6 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="block text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Điểm tích lũy</span>
              <h3 className="text-lg font-bold text-white">Eco Points</h3>
            </div>
            
            <div className="my-6 flex items-baseline gap-2">
              <span className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-500 font-mono">
                {user.eco_points || 0}
              </span>
              <span className="text-xs font-bold text-green-400">PTS</span>
            </div>

            <p className="text-[11px] text-gray-500 font-light leading-relaxed">
              Tích lũy Eco Points bằng cách đăng tải các ghi chú tri thức chất lượng và được duyệt bởi quản trị viên.
            </p>
          </div>
        </div>

        {/* Feature status info */}
        <div className="rounded-2xl border border-gray-800 bg-brand-dark/50 p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
            <i className="fa-solid fa-circle-info text-lg" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Chế độ phân quyền hoạt động tốt</h4>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Bạn đang ở khu vực dành riêng cho Học sinh/Sinh viên. Dữ liệu của bạn được bảo mật đa tầng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
