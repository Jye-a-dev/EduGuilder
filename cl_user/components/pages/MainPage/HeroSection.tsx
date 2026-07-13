export default function HeroSection() {
  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-200 bg-grid pointer-events-none z-0"></div>
      <div className="absolute top-[-5%] left-[-5%] w-150 h-150 rounded-full bg-brand-primary/15 blur-[150px] pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="absolute top-[25%] right-[-5%] w-175 h-175 rounded-full bg-brand-accent/10 blur-[180px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: "2s" }}></div>
      <div className="absolute top-[60%] left-[10%] w-125 h-125 rounded-full bg-brand-secondary/10 blur-[130px] pointer-events-none z-0 animate-pulse-slow"></div>

      <section className="relative pt-24 pb-28 md:pt-32 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-brand-primary/10 to-brand-accent/10 border border-brand-accent/30 text-brand-secondary text-xs font-bold tracking-widest uppercase mb-8 shadow-inner">
            <i className="fa-solid fa-sparkles text-brand-accent animate-pulse"></i> Kỷ nguyên hướng nghiệp thông minh 2026
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 max-w-5xl mx-auto leading-[1.1]">
            Biến Ghi Chép Thành <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-secondary via-brand-primary to-brand-accent drop-shadow-[0_0_35px_rgba(99,102,241,0.3)]">Hành Tinh Tri Thức 3D</span>
          </h1>
          <p className="text-lg sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
            Nền tảng Quản lý tri thức cá nhân <span className="text-white font-medium">(PKM)</span> kết hợp Trò chơi hóa[cite: 87]. Kết nối ghi chép thông minh để định hướng nghề nghiệp tự động vượt trội[cite: 88].
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
            <a href="#" className="w-full sm:w-auto px-10 py-5 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary font-extrabold text-white shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all text-center">
              Bắt đầu miễn phí
            </a>
            <a href="#features" className="w-full sm:w-auto px-10 py-5 rounded-xl bg-brand-card/60 border border-gray-800 font-extrabold text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-700 transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
              <i className="fa-solid fa-play text-xs text-brand-secondary"></i> Xem cách hoạt động
            </a>
          </div>

          <div className="relative max-w-5xl mx-auto rounded-3xl border border-gray-800 bg-brand-dark/90 p-1.5 shadow-[0_0_50px_rgba(99,102,241,0.15)] glow-border overflow-hidden">
            <div className="w-full rounded-2xl bg-linear-to-br from-[#0A0F1D] via-[#0D1527] to-[#04060C] relative p-8 md:p-14 text-left flex flex-col lg:flex-row items-center justify-between gap-12 min-h-105">

              <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#6366F1_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"></div>
              <div className="absolute -top-16 -left-16 w-72 h-72 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 max-w-xl space-y-6 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-card/80 border border-gray-800 text-xs font-mono font-bold text-brand-secondary shadow-md">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span> Live Stats 2026
                </div>
                <h3 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Sẵn sàng làm chủ <br />Hành Tinh Tri Thức của bạn?
                </h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                  Gia nhập cùng hơn <strong className="text-white font-semibold">50.000+ học sinh</strong> đang biến các chuỗi bài học khô khan thành tài sản tri thức có cấu thức độc bản[cite: 87, 88].
                </p>

                <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-800/80">
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">2.5M+</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Ghi chú tạo ra</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-brand-secondary tracking-tight">94.2%</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Độ chuẩn xác AI</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-brand-accent tracking-tight">120+</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Đại Học Đối Tác</div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 w-full lg:w-auto min-w-75 sm:min-w-90 bg-brand-card/70 backdrop-blur-md border border-gray-800/80 p-8 rounded-2xl space-y-5 shadow-2xl shadow-black/50 transform hover:scale-[1.02] transition-all duration-300">
                <div className="space-y-1 text-center lg:text-left">
                  <div className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Khởi động hành tinh</div>
                  <div className="text-xl font-bold text-white">Tạo tài khoản EduPath</div>
                </div>

                <div className="space-y-3">
                  <a href="#" className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-gray-950 font-extrabold text-sm flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg shadow-white/5">
                    <i className="fa-brands fa-google text-base"></i> Đăng nhập bằng Google
                  </a>
                  <a href="#" className="w-full py-3.5 px-4 rounded-xl bg-gray-800/80 hover:bg-gray-800 text-gray-200 font-bold text-sm flex items-center justify-center gap-2 transition-all border border-gray-700">
                    Sử dụng Email học sinh <i className="fa-solid fa-arrow-right text-xs ml-1 text-brand-secondary"></i>
                  </a>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider"><i className="fa-solid fa-shield-halved text-brand-primary mr-1"></i> Bảo mật hệ thống multi-tenant mã hóa [cite: 124]</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
