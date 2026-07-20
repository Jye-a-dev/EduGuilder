"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

export default function RegisterVisualPanel() {
  const { theme } = useTheme();

  return (
    <div
      className="hidden lg:flex flex-col items-center justify-center flex-1 relative overflow-hidden"
      style={{ background: "var(--auth-panel-bg)" }}
    >
      {/* Ambient orbs */}
      <div className="absolute top-[-15%] right-[-5%] w-96 h-96 rounded-full bg-brand-accent/15 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full bg-brand-primary/20 blur-[100px] pointer-events-none animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-secondary/10 blur-[80px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-lg px-12 text-center space-y-8">

        {/* Badge */}
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-brand-secondary text-xs font-bold tracking-widest uppercase shadow-inner"
          style={{ background: "var(--badge-bg)", border: "1px solid var(--badge-border)" }}
        >
          <i className="fa-solid fa-sparkles text-brand-accent animate-pulse" />
          Kỷ nguyên hướng nghiệp 2026
        </span>

        {/* Headline */}
        <div>
          <h2 className="text-4xl font-black leading-[1.2] mb-4" style={{ color: "var(--auth-panel-text)" }}>
            Không chỉ ghi chép —<br />
            <span className="bg-clip-text text-transparent bg-linear-to-r from-brand-secondary via-brand-primary to-brand-accent">
              Xây dựng vũ trụ
            </span>
            {" "}của bạn
          </h2>
          <p className="text-base font-light leading-relaxed" style={{ color: "var(--auth-panel-sub)" }}>
            Mỗi ghi chú là một vì sao. Mỗi liên kết là một hành tinh. Nền tảng PKM thế hệ mới giúp tri thức của bạn{" "}
            <strong style={{ color: "var(--auth-panel-text)" }}>tự tổ chức và phát triển</strong>.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-2 gap-4 text-left">
          {[
            {
              icon: "fa-solid fa-file-lines",
              title: "Obsidian Editor",
              desc: "Markdown thô cực mượt với liên kết nội bộ",
              color: "#3B82F6",
            },
            {
              icon: "fa-solid fa-diagram-project",
              title: "Knowledge Graph",
              desc: "Đồ thị tri thức 3D kết nối đa chiều",
              color: "#8B5CF6",
            },
            {
              icon: "fa-solid fa-trophy",
              title: "Gamification",
              desc: "Hành tinh tiến hóa theo thành tích học tập",
              color: "#06B6D4",
            },
            {
              icon: "fa-solid fa-robot",
              title: "AI Matching",
              desc: "Gợi ý ngành nghề dựa trên năng lực thực",
              color: "#10B981",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-4 rounded-2xl flex flex-col gap-2"
              style={{
                background: theme === "dark" ? "rgba(13,19,36,0.5)" : "rgba(255,255,255,0.55)",
                border: "1px solid var(--border-card)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm"
                style={{ background: f.color + "1A", color: f.color }}
              >
                <i className={f.icon} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: "var(--auth-panel-text)" }}>{f.title}</div>
                <div className="text-xs font-light mt-0.5" style={{ color: "var(--auth-panel-sub)" }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof */}
        <div
          className="flex items-center justify-center gap-4 py-4 px-6 rounded-2xl"
          style={{
            background: theme === "dark" ? "rgba(13,19,36,0.6)" : "rgba(255,255,255,0.6)",
            border: "1px solid var(--border-card)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Avatar stack */}
          <div className="flex -space-x-3">
            {["#3B82F6", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"].map((c, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-white text-[10px] font-black"
                style={{ backgroundColor: c, borderColor: "var(--auth-card-bg)" }}
              >
                {["NV", "TL", "MH", "BT", "PA"][i]}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="text-sm font-black" style={{ color: "var(--auth-panel-text)" }}>50.000+ học sinh</div>
            <div className="text-xs" style={{ color: "var(--auth-panel-sub)" }}>đang làm chủ tri thức</div>
          </div>
          <div className="flex text-yellow-400 text-sm ml-2">
            {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
          </div>
        </div>

      </div>
    </div>
  );
}
