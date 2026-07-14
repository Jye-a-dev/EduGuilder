"use client";

interface DashboardTabProps {
  pendingVerificationsCount: number;
  pendingReviewsCount: number;
  universitiesCount: number;
  setActiveTab: (tab: "dashboard" | "verifications" | "reviews" | "universities" | "audit") => void;
}

export default function DashboardTab({
  pendingVerificationsCount,
  pendingReviewsCount,
  universitiesCount,
  setActiveTab,
}: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          onClick={() => setActiveTab("verifications")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-cyan/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Yêu cầu xác thực thẻ
            </span>
            <span className="text-3xl font-black font-mono text-white mt-1 block">
              {pendingVerificationsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan/30 flex items-center justify-center text-cyber-cyan text-xl">
            <i className="fa-solid fa-user-check"></i>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("reviews")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-warning/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Bài viết Review chờ duyệt
            </span>
            <span className="text-3xl font-black font-mono text-white mt-1 block">
              {pendingReviewsCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-warning/10 border border-cyber-warning/30 flex items-center justify-center text-cyber-warning text-xl">
            <i className="fa-solid fa-comment-medical"></i>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("universities")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-primary/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Tổng số trường Đại Học
            </span>
            <span className="text-3xl font-black font-mono text-white mt-1 block">
              {universitiesCount}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-primary/10 border border-cyber-primary/30 flex items-center justify-center text-cyber-primary text-xl">
            <i className="fa-solid fa-school"></i>
          </div>
        </div>

        <div
          onClick={() => setActiveTab("audit")}
          className="p-6 rounded-2xl bg-cyber-card/60 border border-gray-800/80 flex items-center justify-between hover:border-cyber-success/50 cursor-pointer transition-all duration-300"
        >
          <div>
            <span className="text-xs font-mono text-gray-500 block uppercase tracking-widest">
              Bảo mật logs máy chủ
            </span>
            <span className="text-[10px] font-mono text-cyber-success mt-1 block uppercase tracking-wider font-bold">
              <i className="fa-solid fa-circle-check animate-pulse mr-1"></i> secure tracking
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyber-success/10 border border-cyber-success/30 flex items-center justify-center text-cyber-success text-xl">
            <i className="fa-solid fa-receipt"></i>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border border-gray-850 bg-cyber-card/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-primary/10 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-sm font-bold text-white mb-2">Trung tâm bảo mật thiết bị đầu cuối</h3>
        <p className="text-xs text-gray-400 font-light leading-relaxed max-w-3xl">
          Chào mừng Operator đến với Command Dashboard. Sử dụng thanh menu bên trái để điều khiển tài nguyên, duyệt các đối tác sinh viên và kiểm duyệt nhận xét. Tất cả hành vi của bạn sẽ tự động ghi dấu vết trong phần Nhật ký sự kiện máy chủ.
        </p>
      </div>
    </div>
  );
}
