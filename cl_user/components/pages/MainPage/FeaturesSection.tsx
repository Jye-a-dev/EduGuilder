export default function FeaturesSection() {
  const cards = [
    {
      icon: "fa-regular fa-file-lines",
      title: "Obsidian Editor",
      body: "Soạn thảo văn bản dạng Markdown thô cực mượt. Hệ thống tự động phân tách tiêu đề và nội dung để lưu trữ kết cấu sạch sẽ.",
      accentClass: "text-brand-primary",
      hoverClass: "card-hover-border card-hover-border-primary",
    },
    {
      icon: "fa-solid fa-diagram-project",
      title: "[[Internal Link]] Graph",
      body: "Xây dựng liên kết liên môn bằng thẻ tag và link nội bộ. Hỗ trợ vẽ và truy vết đồ thị tri thức 3D bằng cặp quan hệ logic.",
      accentClass: "text-brand-accent",
      hoverClass: "card-hover-border card-hover-border-accent",
    },
    {
      icon: "fa-solid fa-file-export",
      title: "Rendering Engine",
      body: "Xuất bản đa định dạng chuyên nghiệp gồm PDF, Word, Excel, PPT. Phân tách bảng biểu và slide ngắt trang tự động chuẩn cấu trúc.",
      accentClass: "text-brand-secondary",
      hoverClass: "card-hover-border card-hover-border-secondary",
    },
  ];

  return (
    <section
      id="features"
      className="py-32 relative"
      style={{ borderTop: "1px solid var(--border-subtle)", background: "var(--surface-2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-secondary text-xs font-black uppercase tracking-widest block mb-3">Kiến trúc lõi</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--heading)" }}>
            Trải Nghiệm Ghi Chép Chuẩn Obsidian
          </h2>
          <p className="text-lg font-light" style={{ color: "var(--body-muted)" }}>
            Không chỉ ghi lại, EduPath giúp bạn lưu trữ dữ liệu dưới dạng đồ thị liên kết thực thụ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`backdrop-blur-sm p-8 rounded-2xl transition-all duration-300 group transform hover:-translate-y-2 ${card.hoverClass}`}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-card)",
              }}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.accentClass} text-2xl mb-6 transition-all duration-300`}
                style={{ background: "var(--feature-icon-bg)" }}
              >
                <i className={card.icon} />
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--heading)" }}>{card.title}</h3>
              <p className="text-sm leading-relaxed font-light" style={{ color: "var(--body-muted)" }}>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
