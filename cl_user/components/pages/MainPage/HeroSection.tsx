import Link from "next/link";

export default function HeroSection() {
  return (
    <>
      {/* Decorative grid overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-200 bg-grid pointer-events-none z-0" />
      {/* Ambient glow orbs */}
      <div className="absolute top-[-5%] left-[-5%] w-150 h-150 rounded-full bg-brand-primary/15 blur-[150px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute top-[25%] right-[-5%] w-175 h-175 rounded-full bg-brand-accent/10 blur-[180px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-[60%] left-[10%] w-125 h-125 rounded-full bg-brand-secondary/10 blur-[130px] pointer-events-none z-0 animate-pulse-slow" />

      <section className="relative pt-24 pb-28 md:pt-32 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-brand-secondary text-xs font-bold tracking-widest uppercase mb-8 shadow-inner"
            style={{ background: "var(--badge-bg)", border: "1px solid var(--badge-border)" }}
          >
            <i className="fa-solid fa-sparkles text-brand-accent animate-pulse" />
            Kỷ nguyên hướng nghiệp thông minh 2026
          </span>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 max-w-5xl mx-auto leading-[1.1]"
            style={{ color: "var(--heading)" }}
          >
            Biến Ghi Chép Thành <br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-secondary via-brand-primary to-brand-accent drop-shadow-[0_0_35px_rgba(99,102,241,0.3)]">
              Hành Tinh Tri Thức 3D
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed font-light" style={{ color: "var(--body-muted)" }}>
            Nền tảng Quản lý tri thức cá nhân{" "}
            <span className="font-medium" style={{ color: "var(--heading)" }}>(PKM)</span>{" "}
            kết hợp Trò chơi hóa. Kết nối ghi chép thông minh để định hướng nghề nghiệp tự động vượt trội.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
            <Link
              href="/register"
              className="w-full sm:w-auto px-10 py-5 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary font-extrabold text-white shadow-xl shadow-brand-primary/20 hover:scale-105 transition-all text-center"
            >
              Bắt đầu miễn phí
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-10 py-5 rounded-xl font-extrabold flex items-center justify-center gap-3 backdrop-blur-sm transition-all card-hover-border"
              style={{
                background: "var(--btn-ghost-bg)",
                color: "var(--btn-ghost-text)",
                border: "1px solid var(--border-card)",
              }}
            >
              <i className="fa-solid fa-play text-xs text-brand-secondary" /> Xem cách hoạt động
            </a>
          </div>

          {/* Hero preview card */}
          <div
            className="relative max-w-5xl mx-auto rounded-3xl p-1.5 shadow-[0_0_50px_rgba(99,102,241,0.12)] glow-border overflow-hidden"
            style={{ border: "1px solid var(--glow-line)", background: "var(--surface-1)" }}
          >
            <div
              className="w-full rounded-2xl relative p-8 md:p-14 text-left flex flex-col lg:flex-row items-center justify-between gap-12 min-h-105"
              style={{ background: "var(--surface-hero)" }}
            >
              {/* Dot pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(var(--tw-color-brand-accent,#8B5CF6)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none" />
              <div className="absolute -top-16 -left-16 w-72 h-72 bg-brand-secondary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

              {/* Left stats */}
              <div className="relative z-10 max-w-xl space-y-6 flex-1">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-brand-secondary shadow-md"
                  style={{ background: "var(--surface-1)", border: "1px solid var(--border-card)" }}
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  Live Stats 2026
                </div>
                <h3 className="text-3xl sm:text-4xl font-black leading-tight" style={{ color: "var(--heading)" }}>
                  Sẵn sàng làm chủ <br />Hành Tinh Tri Thức của bạn?
                </h3>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--body-muted)" }}>
                  Gia nhập cùng hơn{" "}
                  <strong className="font-semibold" style={{ color: "var(--heading)" }}>50.000+ học sinh</strong>{" "}
                  đang biến các chuỗi bài học khô khan thành tài sản tri thức có cấu thức độc bản.
                </p>

                <div className="grid grid-cols-3 gap-6 pt-6" style={{ borderTop: "1px solid var(--border-subtle)" }}>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: "var(--heading)" }}>2.5M+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--stat-label)" }}>Ghi chú tạo ra</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-brand-secondary tracking-tight">94.2%</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--stat-label)" }}>Độ chuẩn xác AI</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-brand-accent tracking-tight">120+</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--stat-label)" }}>Đại Học Đối Tác</div>
                  </div>
                </div>
              </div>

              {/* Right signup widget */}
              <div
                className="relative z-10 w-full lg:w-auto min-w-75 sm:min-w-90 backdrop-blur-md p-8 rounded-2xl space-y-5 shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                style={{
                  background: "var(--input-widget-bg)",
                  border: "1px solid var(--border-card)",
                  boxShadow: "0 25px 50px rgba(0,0,0,0.12)",
                }}
              >
                <div className="space-y-1 text-center lg:text-left">
                  <div className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Khởi động hành tinh</div>
                  <div className="text-xl font-bold" style={{ color: "var(--heading)" }}>Tạo tài khoản EduPath</div>
                </div>

                <div className="space-y-3">
                  <a
                    href="#"
                    className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-3 transition-all transform active:scale-95"
                    style={{
                      background: "var(--surface-1)",
                      color: "var(--heading)",
                      border: "1px solid var(--border-card)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    <i className="fa-brands fa-google text-base" /> Đăng nhập bằng Google
                  </a>
                  <Link
                    href="/login"
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      background: "var(--btn-ghost-bg)",
                      color: "var(--btn-ghost-text)",
                      border: "1px solid var(--border-card)",
                    }}
                  >
                    Đăng nhập tài khoản <i className="fa-solid fa-arrow-right text-xs ml-1 text-brand-secondary" />
                  </Link>
                </div>

                <div className="text-center pt-2">
                  <span className="text-[10px] font-mono tracking-wider" style={{ color: "var(--stat-label)" }}>
                    <i className="fa-solid fa-shield-halved text-brand-primary mr-1" />
                    Bảo mật hệ thống multi-tenant mã hóa
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
