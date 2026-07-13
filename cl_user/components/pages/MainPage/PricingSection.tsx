export default function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-linear-to-b from-brand-dark/20 via-black/40 to-brand-dark relative border-t border-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-secondary text-xs font-black uppercase tracking-widest block mb-3">Gói dịch vụ</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Mô Hình Tài Chính Thực Dụng</h2>
          <p className="text-gray-400 text-lg font-light">Tăng trưởng người dùng thần tốc với cơ chế Freemium linh hoạt[cite: 106].</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="p-8 md:p-10 rounded-3xl bg-brand-card/30 border border-gray-900 flex flex-col justify-between hover:border-gray-800 transition-all">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Gói Cơ Bản (Freemium)</h3>
                <p className="text-gray-400 text-sm font-light">Ghi chép và tra cứu trường học miễn phí trọn đời để tăng tốc tăng trưởng user[cite: 106].</p>
              </div>
              <div className="text-5xl font-black text-white tracking-tight">0đ <span className="text-sm font-normal text-gray-500 font-sans">/ mãi mãi</span></div>
              <ul className="space-y-4 text-sm text-gray-300 font-medium pt-2 border-t border-gray-900">
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-green-500 text-base"></i> Soạn thảo Markdown & Mạng lưới 3D [cite: 106]</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-green-500 text-base"></i> Tra cứu trường đại học & Điểm chuẩn [cite: 106]</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-green-500 text-base"></i> Quản lý sidebar thư mục đệ quy cá nhân</li>
              </ul>
            </div>
            <a href="#" className="w-full py-4 rounded-xl bg-gray-800/80 hover:bg-gray-800 text-white font-bold transition-all text-center block mt-8">Sử dụng ngay</a>
          </div>

          <div className="p-8 md:p-10 rounded-3xl bg-brand-card border border-brand-primary/80 relative flex flex-col justify-between shadow-[0_0_40px_rgba(99,102,241,0.15)] glow-border">
            <div className="absolute top-5 right-5 px-3 py-1 bg-linear-to-r from-brand-primary to-brand-accent text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-md">Bứt phá</div>
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Gói Premium (Mùa Thi)</h3>
                <p className="text-gray-400 text-sm font-light">Mở khóa phân tích sâu chỉ số phần trăm đỗ đại học dựa trên năng lực[cite: 107].</p>
              </div>
              <div className="text-5xl font-black text-white tracking-tight">200.000đ <span className="text-sm font-normal text-gray-500 font-sans">/ mùa thi</span></div>
              <ul className="space-y-4 text-sm text-gray-300 font-medium pt-2 border-t border-gray-900">
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base"></i> Toàn bộ quyền lợi của gói Cơ Bản</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base"></i> Mở khóa thuật toán AI phân tích tỷ lệ đỗ [cite: 107]</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base"></i> Xuất bản tài liệu PDF, Word, Excel tốc độ cao</li>
                <li className="flex items-center gap-3"><i className="fa-solid fa-check text-brand-secondary text-base"></i> Ưu tiên cập nhật dữ liệu điểm chuẩn mới nhất</li>
              </ul>
            </div>
            <a href="#" className="w-full py-4 rounded-xl bg-linear-to-r from-brand-primary via-brand-accent to-brand-secondary text-white font-black text-center block shadow-lg shadow-brand-primary/20 hover:opacity-95 transition-all transform hover:scale-[1.02] mt-8">Nâng cấp ngay</a>
          </div>
        </div>
      </div>
    </section>
  );
}
