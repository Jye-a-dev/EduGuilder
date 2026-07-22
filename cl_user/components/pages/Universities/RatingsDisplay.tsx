export interface RatingsDisplayProps {
  ratings: Record<string, number | boolean> | null | undefined;
  isInsider: boolean;
}

export function RatingsDisplay({ ratings, isInsider }: RatingsDisplayProps) {
  if (
    !ratings ||
    (ratings.c1 === undefined &&
      ratings.c2 === undefined &&
      ratings.c3 === undefined &&
      ratings.c4 === undefined)
  ) {
    return null;
  }

  const c1Label = isInsider ? "Chất lượng đào tạo" : "Uy tín & Thương hiệu";
  const c2Label = isInsider ? "Cơ sở vật chất" : "Học phí & Học bổng";
  const c3Label = isInsider ? "Đội ngũ giảng viên" : "Vị trí & Khuôn viên";
  const c4Label = isInsider ? "Đời sống sinh viên" : "Yêu cầu đầu vào";

  const items = [
    { label: c1Label, val: Number(ratings.c1 ?? 0) },
    { label: c2Label, val: Number(ratings.c2 ?? 0) },
    { label: c3Label, val: Number(ratings.c3 ?? 0) },
    { label: c4Label, val: Number(ratings.c4 ?? 0) },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-3.5 bg-brand-primary/5 p-4 rounded-xl border border-border-custom/50 text-[11px] mb-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-text-sub">
            <span className="font-medium text-xs">{item.label}</span>
            <span className="font-bold text-text-main font-mono">{item.val || 0}/5 ⭐</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(item.val || 0) * 20}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
