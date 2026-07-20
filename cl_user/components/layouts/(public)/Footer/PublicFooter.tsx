import BaseFooter from "@/components/layouts/@base/Footer/BaseFooter";

export default function PublicFooter() {
  return (
    <BaseFooter
      left={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-brand-primary to-brand-secondary flex items-center justify-center">
            <i className="fa-solid fa-orbit text-white text-base"></i>
          </div>
          <span className="text-xl font-black tracking-wider" style={{ color: "var(--heading)" }}>
            EduPath
          </span>
        </div>
      }
      right={
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          <p className="font-light tracking-wide">
            &copy; 2026 EduPath Enterprise System. Hợp nhất cấu trúc dữ liệu sạch production.
          </p>
          <div className="flex gap-6" style={{ color: "var(--body-muted)" }}>
            <a href="#" className="hover:text-brand-secondary transition-colors">
              <i className="fa-brands fa-github text-xl"></i>
            </a>
            <a href="#" className="hover:text-brand-secondary transition-colors">
              <i className="fa-brands fa-facebook text-xl"></i>
            </a>
            <a href="#" className="hover:text-brand-secondary transition-colors">
              <i className="fa-brands fa-discord text-xl"></i>
            </a>
          </div>
        </div>
      }
    />
  );
}
