export default function EcosystemSection() {
  return (
    <section
      id="ecosystem"
      className="py-32 relative"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-brand-accent text-xs font-black uppercase tracking-widest block mb-3">Bảo mật đa hệ thống</span>
          <h2 className="text-4xl sm:text-5xl font-black mb-4" style={{ color: "var(--heading)" }}>
            Cách Ly Dữ Liệu Tuyệt Đối
          </h2>
          <p className="text-lg font-light" style={{ color: "var(--body-muted)" }}>
            Sử dụng phân quyền cứng để cô lập và xử lý luồng dữ liệu chuẩn xác cho từng vai trò.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Student space */}
          <div
            className="p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group card-hover-border transition-all"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-card)" }}
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-secondary/10 transition-all" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 rounded-full bg-brand-secondary shadow-[0_0_10px_#06B6D4]" />
              <h3 className="text-2xl font-bold" style={{ color: "var(--heading)" }}>Không Gian Học Sinh / Sinh Viên</h3>
            </div>
            <p className="text-sm md:text-base mb-8 leading-relaxed font-light" style={{ color: "var(--body-muted)" }}>
              Giao diện độc lập phục vụ nhu cầu ghi chép cá nhân, tương tác tiến hóa hành tinh tri thức và đo lường lộ trình điểm số học tập.
            </p>
            <ul className="space-y-4 text-sm font-medium" style={{ color: "var(--heading-muted)" }}>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-secondary text-base" /> Tự nhập &amp; quản lý điểm số theo học kỳ</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-secondary text-base" /> Tải minh chứng thẻ sinh viên viết bài đánh giá</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-secondary text-base" /> Quản lý cây thư mục đệ quy và sơ đồ tư duy</li>
            </ul>
          </div>

          {/* University space */}
          <div
            className="p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden group card-hover-border transition-all"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border-card)" }}
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all" />
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_10px_#3B82F6]" />
              <h3 className="text-2xl font-bold" style={{ color: "var(--heading)" }}>Không Gian Trường Đại Học</h3>
            </div>
            <p className="text-sm md:text-base mb-8 leading-relaxed font-light" style={{ color: "var(--body-muted)" }}>
              Dành riêng cho đối tác nhà trường thực hiện số hóa thông tin tuyển sinh công khai và phản hồi giải đáp thắc mắc của sinh viên.
            </p>
            <ul className="space-y-4 text-sm font-medium" style={{ color: "var(--heading-muted)" }}>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-primary text-base" /> Cập nhật chỉ tiêu, mã ngành, điểm chuẩn hàng năm</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-primary text-base" /> Viết phản hồi chính thức dưới bài review đã duyệt</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-primary text-base" /> Xem biểu đồ real-time học sinh đặt mục tiêu vào trường</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
