import type { University } from "@/hooks/useUniversities";

export interface UniversityCardProps {
  uni: University;
  isOwn: boolean;
  averageRating: string;
  reviewsCount: number;
  onOpenModal: (uni: University) => void;
}

export function UniversityCard({
  uni,
  isOwn,
  averageRating,
  reviewsCount,
  onOpenModal,
}: UniversityCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-brand-card p-5 space-y-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
        isOwn
          ? "border-brand-primary/40 shadow-xs shadow-brand-primary/5"
          : "border-border-custom"
      }`}
    >
      <div className="space-y-3">
        {/* Header/Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-text-sub font-mono uppercase tracking-wider">
            Mã: {uni.code}
          </span>
          {isOwn && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black font-mono bg-linear-to-r from-brand-primary to-brand-secondary text-white shadow-xs">
              <i className="fa-solid fa-graduation-cap text-[8px]" />
              TRƯỜNG CỦA TÔI
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-text-main leading-tight truncate-2">
          {uni.name}
        </h3>

        {/* Metadata fields */}
        <div className="space-y-1.5 pt-1 text-[11px] font-light text-text-sub">
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-map-location-dot text-brand-primary text-[10px] shrink-0" />
            Khu vực: {uni.region || "Chưa thiết lập"}
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-money-bill-wave text-brand-secondary text-[10px] shrink-0" />
            Học phí: {uni.tuition_fees || "Chưa thiết lập"}
          </div>
          <div className="flex items-center gap-1.5">
            <i className="fa-solid fa-building-columns text-purple-400 text-[10px] shrink-0" />
            Loại hình: <span className="capitalize">{uni.type || "Chưa thiết lập"}</span>
          </div>
          {uni.website_url && (
            <div className="flex items-center gap-1.5">
              <i className="fa-solid fa-globe text-blue-400 text-[10px] shrink-0" />
              Website:{" "}
              <a
                href={uni.website_url.startsWith("http") ? uni.website_url : `https://${uni.website_url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline font-medium inline-flex items-center gap-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                Trang chủ <i className="fa-solid fa-arrow-up-right-from-square text-[8px]" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Rating & Actions */}
      <div className="pt-4 border-t border-border-custom flex items-center justify-between mt-auto">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <i className="fa-solid fa-star text-[10px] text-amber-500" />
            <span className="text-xs font-black text-text-main font-mono">{averageRating}</span>
          </div>
          <span className="text-[10px] text-text-sub font-mono">({reviewsCount} đánh giá)</span>
        </div>

        <button
          onClick={() => onOpenModal(uni)}
          className={`px-3.5 py-2 rounded-xl font-mono text-[9px] font-black uppercase tracking-wider text-white shadow-xs hover:opacity-95 active:scale-[0.97] transition-all cursor-pointer ${
            isOwn
              ? "bg-linear-to-r from-brand-primary to-brand-secondary"
              : "bg-gray-100/10 hover:bg-gray-100/20 text-text-main border border-border-custom"
          }`}
        >
          Đánh giá trường
        </button>
      </div>
    </div>
  );
}
