"use client";

import type { User } from "@/components/providers/AuthProvider";
import type { University } from "@/hooks/useUniversities";
import type { UniversityReview } from "@/hooks/useUniversityReviews";
import type { UniversityAdmission } from "@/hooks/useUniversityAdmissions";

interface UniversityDashboardProps {
  user: User;
  singleUniversity: University | null;
  reviews: UniversityReview[];
  admissions: UniversityAdmission[];
  averageRating: string;
}

export default function UniversityDashboard({
  user,
  singleUniversity,
  reviews,
  admissions,
  averageRating,
}: UniversityDashboardProps) {
  return (
    <div className="space-y-6 relative">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight font-sans">
            Bảng điều khiển Trường học 🏫
          </h1>
          <p className="text-xs text-text-sub font-light mt-0.5">
            Đại diện tuyển sinh: {singleUniversity?.name || "Đại học hệ thống"} ({singleUniversity?.code || "Mã trường"})
          </p>
        </div>
      </div>

      {/* --- STATS GRID (UNI) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* EDU-POINTS */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Điểm Eco-Points</span>
            <span className="block text-2xl font-black text-text-main font-sans tracking-tight">
              {user.eco_points.toLocaleString("vi-VN")}
            </span>
            <span className="text-[10px] text-text-sub font-light font-mono">Điểm đại diện trường</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-100/50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500 shrink-0">
            <i className="fa-solid fa-leaf text-lg" />
          </div>
        </div>

        {/* TOTAL REVIEWS */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Đánh giá nhận được</span>
            <span className="block text-2xl font-black text-text-main font-sans tracking-tight">{reviews.length}</span>
            <span className="text-[10px] text-text-sub font-light font-mono">Phản hồi từ sinh viên</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500 shrink-0">
            <i className="fa-regular fa-comments text-lg" />
          </div>
        </div>

        {/* RATING STARS AVERAGE */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Điểm đánh giá TB</span>
            <span className="block text-2xl font-black text-text-main font-sans tracking-tight">{averageRating} / 5.0</span>
            <span className="text-[10px] text-amber-500 font-bold flex items-center gap-1 font-mono">
              <i className="fa-solid fa-star text-[8px]" /> Chất lượng trường
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-100/50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500 shrink-0">
            <i className="fa-solid fa-star text-lg" />
          </div>
        </div>

        {/* UNIVERSITY VERIFICATION STATUS */}
        <div className="rounded-2xl border border-border-custom bg-brand-card p-5 flex items-center justify-between">
          <div className="space-y-1.5">
            <span className="block text-[9px] font-bold text-text-sub uppercase tracking-wider font-mono">Trạng thái xác thực</span>
            <span
              className={`block text-xl font-black font-sans tracking-tight ${
                singleUniversity?.is_verified ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"
              }`}
            >
              {singleUniversity?.is_verified ? "VERIFIED" : "UNVERIFIED"}
            </span>
            <span className="text-[10px] text-text-sub font-light font-mono">
              {singleUniversity?.is_verified ? "Hồ sơ công khai" : "Đang chờ duyệt"}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-100/50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 shrink-0">
            <i className="fa-solid fa-building-circle-check text-lg" />
          </div>
        </div>
      </div>

      {/* --- MAIN GRID CONTENT (UNI) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Admissions Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main">Chỉ tiêu & Điểm chuẩn tuyển sinh</h3>
              <span className="text-xs text-text-sub font-mono">Năm 2024</span>
            </div>

            <div className="divide-y divide-border-custom max-h-96 overflow-y-auto pr-1">
              {admissions.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-sub">Chưa thiết lập chỉ tiêu tuyển sinh nào.</div>
              ) : (
                admissions.map((adm) => (
                  <div key={adm.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1 pr-4">
                      <span className="block text-xs font-semibold text-text-main truncate">{adm.major_name}</span>
                      <span className="text-[10px] text-text-sub font-mono block mt-1">
                        Mã ngành: {adm.major_code} • Tổ hợp: {adm.group_code}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="block text-[10px] text-text-sub font-mono">Chỉ tiêu</span>
                        <span className="block text-xs font-bold text-text-main font-mono">{adm.quota} HS</span>
                      </div>
                      <div className="text-right pl-4 border-l border-border-custom">
                        <span className="block text-[10px] text-text-sub font-mono">Điểm chuẩn</span>
                        <span className="block text-xs font-black text-brand-primary font-mono">{adm.benchmark_score} đ</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Reviews & Comments */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main">Đánh giá từ học sinh</h3>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {reviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-sub">Chưa nhận được phản hồi/đánh giá nào.</div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-gray-50/30 dark:bg-gray-900/30 border border-border-custom space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa-solid fa-star text-[9px] ${
                              i < rev.rating_stars ? "text-amber-500" : "text-gray-300 dark:text-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] text-text-sub font-mono">{rev.is_approved ? "Đã duyệt" : "Chờ duyệt"}</span>
                    </div>
                      <p className="text-xs text-text-main font-light leading-relaxed">{rev.comment}</p>
                    {rev.official_reply && (
                      <div className="pt-2 mt-2 border-t border-border-custom/50 text-[10px] text-brand-primary">
                        <span className="font-bold">Trường phản hồi:</span> {rev.official_reply}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
