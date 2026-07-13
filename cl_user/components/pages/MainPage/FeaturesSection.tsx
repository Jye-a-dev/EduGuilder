export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative border-t border-gray-950 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-brand-secondary text-xs font-black uppercase tracking-widest block mb-3">Kiến trúc lõi</span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Trải Nghiệm Ghi Chép Chuẩn Obsidian</h2>
          <p className="text-gray-400 text-lg font-light">Không chỉ ghi lại, EduPath giúp bạn lưu trữ dữ liệu dưới dạng đồ thị liên kết thực thụ[cite: 101].</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-brand-card/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-900 hover:border-brand-primary/40 transition-all duration-300 group transform hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary text-2xl mb-6 group-hover:bg-linear-to-tr group-hover:from-brand-primary group-hover:to-brand-accent group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary/20 transition-all duration-300">
              <i className="fa-regular fa-file-lines"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Obsidian Editor</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">Soạn thảo văn bản dạng Markdown thô cực mượt[cite: 90]. Hệ thống tự động phân tách tiêu đề và nội dung để lưu trữ kết cấu sạch sẽ[cite: 127].</p>
          </div>
          <div className="bg-brand-card/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-900 hover:border-brand-accent/40 transition-all duration-300 group transform hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-accent/10 flex items-center justify-center text-brand-accent text-2xl mb-6 group-hover:bg-linear-to-tr group-hover:from-brand-accent group-hover:to-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-accent/20 transition-all duration-300">
              <i className="fa-solid fa-diagram-project"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">{"[[Internal Link]]"} Graph</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">Xây dựng liên kết liên môn bằng thẻ tag và link nội bộ[cite: 90]. Hỗ trợ vẽ và truy vết đồ thị tri thức 3D bằng cặp quan hệ logic[cite: 91, 101].</p>
          </div>
          <div className="bg-brand-card/40 backdrop-blur-sm p-8 rounded-2xl border border-gray-900 hover:border-brand-secondary/40 transition-all duration-300 group transform hover:-translate-y-2">
            <div className="w-14 h-14 rounded-2xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary text-2xl mb-6 group-hover:bg-linear-to-tr group-hover:from-brand-secondary group-hover:to-brand-primary group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-secondary/20 transition-all duration-300">
              <i className="fa-solid fa-file-export"></i>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Rendering Engine</h3>
            <p className="text-gray-400 text-sm leading-relaxed font-light">Xuất bản đa định dạng chuyên nghiệp gồm PDF, Word, Excel, PPT[cite: 117]. Phân tách bảng biểu và slide ngắt trang tự động chuẩn cấu trúc[cite: 126, 127].</p>
          </div>
        </div>
      </div>
    </section>
  );
}
