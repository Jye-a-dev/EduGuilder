export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="py-32 bg-linear-to-b from-brand-dark/40 via-[#03050B] to-brand-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-brand-accent text-xs font-black uppercase tracking-widest block mb-3">Bảo mật đa hệ thống</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Cách Ly Dữ Liệu Tuyệt Đối</h2>
          <p className="text-gray-400 text-lg font-light">Sử dụng phân quyền cứng để cô lập và xử lý luồng dữ liệu chuẩn xác cho từng vai trò[cite: 103].</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="p-8 md:p-10 rounded-3xl bg-linear-to-br from-brand-card via-[#0F1629] to-brand-dark border border-gray-900 shadow-2xl relative overflow-hidden group hover:border-gray-800 transition-all">
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand-secondary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-secondary/10 transition-all"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 rounded-full bg-brand-secondary shadow-[0_0_10px_#06B6D4]"></div>
              <h3 className="text-2xl font-bold text-white">Không Gian Học Sinh / Sinh Viên</h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed font-light">Giao diện độc lập phục vụ nhu cầu ghi chép cá nhân, tương tác tiến hóa hành tinh tri thức và đo lường lộ trình điểm số học tập[cite: 90, 92].</p>
            <ul className="space-y-4 text-sm text-gray-300 font-medium">
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-secondary text-base"></i> Tự nhập & quản lý điểm số theo học kỳ [cite: 58]</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-secondary text-base"></i> Tải minh chứng thẻ sinh viên viết bài đánh giá [cite: 59]</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-secondary text-base"></i> Quản lý cây thư mục đệ quy và sơ đồ tư duy [cite: 63]</li>
            </ul>
          </div>

          <div className="p-8 md:p-10 rounded-3xl bg-linear-to-br from-brand-card via-[#0F1629] to-brand-dark border border-gray-900 shadow-2xl relative overflow-hidden group hover:border-gray-800 transition-all">
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-primary/10 transition-all"></div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_10px_#6366F1]"></div>
              <h3 className="text-2xl font-bold text-white">Không Gian Trường Đại Học</h3>
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-8 leading-relaxed font-light">Dành riêng cho đối tác nhà trường thực hiện số hóa thông tin tuyển sinh công khai và phản hồi giải đáp thắc mắc của sinh viên[cite: 68].</p>
            <ul className="space-y-4 text-sm text-gray-300 font-medium">
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-primary text-base"></i> Cập nhật chỉ tiêu, mã ngành, điểm chuẩn hàng năm [cite: 72]</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-primary text-base"></i> Viết phản hồi chính thức dưới bài review đã duyệt [cite: 73]</li>
              <li className="flex items-center gap-3"><i className="fa-solid fa-square-check text-brand-primary text-base"></i> Xem biểu đồ real-time học sinh đặt mục tiêu vào trường [cite: 96]</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
