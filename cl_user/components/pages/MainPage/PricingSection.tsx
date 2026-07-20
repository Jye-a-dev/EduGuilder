export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-32 relative"
      style={{ background: "var(--surface-1)", borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-secondary text-xs font-black uppercase tracking-widest block mb-3">Gói dịch vụ</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--heading)" }}>
            Mô Hình Tài Chính Thực Dụng
          </h2>
          <p className="text-lg font-light" style={{ color: "var(--body-muted)" }}>
            Tăng trưởng người dùng thần tốc với cơ chế Freemium linh hoạt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free tier */}
          <div
            className="p-8 md:p-10 rounded-3xl flex flex-col justify-between card-hover-border transition-all"
            style={{ background: "var(--pricing-free-bg)", border: "1px solid var(--border-card)" }}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--heading)" }}>Gói Cơ Bản (Freemium)</h3>
                <p className="text-sm font-light" style={{ color: "var(--body-muted)" }}>Ghi chép và tra cứu trường học miễn phí trọn đời để tăng tốc tăng trưởng user.</p>
              </div>
              <div className="text-5xl font-black tracking-tight" style={{ color: "var(--heading)" }}>
                0đ <span className="text-sm font-normal font-sans" style={{ color: "var(--body-muted)" }}>/ mãi mãi</span>
              </div>
              <ul
                className="space-y-4 text-sm font-medium pt-2"
                style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--heading-muted)" }}
              >
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-green-500 text-base" /> Soạn thảo Markdown &amp; Mạng lưới 3D</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-green-500 text-base" /> Tra cứu trường đại học &amp; Điểm chuẩn</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-green-500 text-base" /> Quản lý sidebar thư mục đệ quy cá nhân</li>
              </ul>
            </div>
            <a
              href="#"
              className="w-full py-4 rounded-xl font-bold transition-all text-center block mt-8"
              style={{
                background: "var(--btn-ghost-bg)",
                color: "var(--btn-ghost-text)",
                border: "1px solid var(--border-card)",
              }}
            >
              Sử dụng ngay
            </a>
          </div>

          {/* Premium tier */}
          <div
            className="p-8 md:p-10 rounded-3xl relative flex flex-col justify-between shadow-[0_0_40px_rgba(99,102,241,0.15)] glow-border"
            style={{ background: "var(--surface-1)", border: "1px solid rgba(59,130,246,0.5)" }}
          >
            <div className="absolute top-5 right-5 px-3 py-1 bg-linear-to-r from-brand-primary to-brand-accent text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">
              Bứt phá
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: "var(--heading)" }}>Gói Premium (Mùa Thi)</h3>
                <p className="text-sm font-light" style={{ color: "var(--body-muted)" }}>Mở khóa phân tích sâu chỉ số phần trăm đỗ đại học dựa trên năng lực.</p>
              </div>
              <div className="text-5xl font-black tracking-tight" style={{ color: "var(--heading)" }}>
                200.000đ <span className="text-sm font-normal font-sans" style={{ color: "var(--body-muted)" }}>/ mùa thi</span>
              </div>
              <ul
                className="space-y-4 text-sm font-medium pt-2"
                style={{ borderTop: "1px solid var(--border-subtle)", color: "var(--heading-muted)" }}
              >
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base" /> Toàn bộ quyền lợi của gói Cơ Bản</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base" /> Mở khóa thuật toán AI phân tích tỷ lệ đỗ</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base" /> Xuất bản tài liệu PDF, Word, Excel tốc độ cao</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base" /> Ưu tiên cập nhật dữ liệu điểm chuẩn mới nhất</li>
              </ul>
            </div>
            <a
              href="#"
              className="w-full py-4 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary text-white font-black text-center block shadow-lg shadow-brand-primary/20 hover:opacity-95 transition-all transform hover:scale-[1.02] mt-8"
            >
              Nâng cấp ngay
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
