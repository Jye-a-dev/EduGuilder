export default function GamificationSection() {
  return (
    <section id="gamification" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-brand-accent font-black text-xs uppercase tracking-widest block">Octalysis Gamification Framework</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.15]">Biến Việc Ghi Chép <br />Thành Tựa Game Tiến Hóa</h2>
            <p className="text-gray-400 leading-relaxed font-light text-lg">
              Không còn rào cản hành chính ép buộc, học sinh tự giác mở app hàng ngày vì động lực tự thân muốn nuôi dưỡng và nhìn ngắm hành tinh tri thức của mình phát triển sinh động[cite: 105].
            </p>
            <div className="p-5 rounded-2xl bg-brand-card/40 border border-gray-900 flex gap-4 backdrop-blur-sm">
              <div className="text-brand-secondary text-3xl mt-0.5"><i className="fa-solid fa-bolt-lightning animate-pulse"></i></div>
              <div>
                <h4 className="font-bold text-white text-lg mb-1">Thuật toán khớp nối tự động</h4>
                <p className="text-gray-400 text-sm font-light leading-relaxed">Hệ thống quét mật độ, tần suất từ khóa/tag trong mạng lưới ghi chép để trả về kết quả định hướng nghề nghiệp tự động cực kỳ chính xác[cite: 102].</p>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-full max-w-md aspect-square bg-linear-to-tr from-brand-primary/10 via-brand-accent/5 to-brand-secondary/10 rounded-[2.5rem] border border-gray-800/60 flex items-center justify-center p-8 relative overflow-hidden shadow-2xl shadow-brand-primary/5 group hover:border-brand-secondary/40 transition-all duration-500">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.15)_0,transparent_60%)]"></div>

              <div className="absolute w-72 h-72 rounded-full border border-dashed border-gray-700/50 animate-spin" style={{ animationDuration: "25s" }}></div>

              <div className="text-center space-y-4 relative z-10 animate-float">
                <div className="w-36 h-36 mx-auto rounded-full bg-linear-to-tr from-brand-secondary via-brand-primary to-brand-accent flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.4)] relative">
                  <i className="fa-solid fa-planet-ringed text-white text-6xl"></i>
                  <span className="absolute top-2 right-2 w-4 h-4 bg-brand-accent rounded-full shadow-[0_0_10px_#A855F7]"></span>
                </div>
                <div className="space-y-1 pt-2">
                  <h4 className="text-xl font-black text-white tracking-wide">Hành tinh Cấp độ 12</h4>
                  <p className="text-xs text-brand-secondary font-mono font-bold uppercase tracking-widest">+1,420 Eco-Points tích lũy [cite: 92]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
