"use client";

import { useMemo } from "react";
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

function renderDashboardComment(rev: UniversityReview) {
  const ratings = rev.ratings;
  const isInsider = ratings && 'isInsider' in ratings ? Boolean(ratings.isInsider) : rev.comment.includes("--- ĐÁNH GIÁ NGƯỜI TRONG CUỘC ---");

  // Clean comment text from legacy HTML headers
  let cleanedComment = rev.comment;
  if (cleanedComment.includes("Nội dung chi tiết:")) {
    const parts = cleanedComment.split("<strong>Nội dung chi tiết:</strong>");
    if (parts.length > 1) {
      cleanedComment = parts[1].replace(/<div>\s*([\s\S]*?)\s*<\/div>/, "$1").trim();
    }
  }
  const textOnly = cleanedComment.replace(/<[^>]*>/g, "").trim();

  // Determine criteria ratings values
  const c1Val = ratings?.c1 !== undefined ? Number(ratings.c1) : undefined;
  const c2Val = ratings?.c2 !== undefined ? Number(ratings.c2) : undefined;
  const c3Val = ratings?.c3 !== undefined ? Number(ratings.c3) : undefined;
  const c4Val = ratings?.c4 !== undefined ? Number(ratings.c4) : undefined;

  const c1Label = isInsider ? "Chất lượng đào tạo" : "Uy tín & Thương hiệu";
  const c2Label = isInsider ? "Cơ sở vật chất" : "Học phí & Học bổng";
  const c3Label = isInsider ? "Đội ngũ giảng viên" : "Vị trí & Khuôn viên";
  const c4Label = isInsider ? "Đời sống sinh viên" : "Yêu cầu đầu vào";

  const items = [
    { label: c1Label, val: c1Val ?? rev.rating_stars },
    { label: c2Label, val: c2Val ?? rev.rating_stars },
    { label: c3Label, val: c3Val ?? rev.rating_stars },
    { label: c4Label, val: c4Val ?? rev.rating_stars },
  ];

  return (
    <div className="space-y-3 mt-1 text-xs text-text-main">
      {/* Criteria ratings grid */}
      <div className="grid grid-cols-2 gap-2 text-[10px] bg-brand-primary/5 p-2.5 rounded-lg border border-border-custom/40">
        {items.map((item, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-text-sub">
              <span className="truncate max-w-28 font-medium">{item.label}</span>
              <span className="text-amber-500 font-bold font-mono">{item.val}/5 ★</span>
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

      {/* Detailed comment text */}
      {textOnly && (
        <p className="text-xs italic leading-relaxed text-text-main border-l-2 border-brand-primary/40 pl-2.5 py-0.5">
          &quot;{textOnly}&quot;
        </p>
      )}
    </div>
  );
}

export default function UniversityDashboard({
  user,
  singleUniversity,
  reviews,
  admissions,
  averageRating,
}: UniversityDashboardProps) {
  // Filter reviews by insider vs outsider perspective using ratings.isInsider or legacy text check
  const insiderReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (r.ratings && 'isInsider' in r.ratings) {
        return Boolean(r.ratings.isInsider);
      }
      return r.comment.includes("--- ĐÁNH GIÁ NGƯỜI TRONG CUỘC ---");
    });
  }, [reviews]);

  const outsiderReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (r.ratings && 'isInsider' in r.ratings) {
        return !Boolean(r.ratings.isInsider);
      }
      return !r.comment.includes("--- ĐÁNH GIÁ NGƯỜI TRONG CUỘC ---");
    });
  }, [reviews]);

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
            <span className="text-[10px] text-text-sub font-light font-mono">Tổng số phản hồi</span>
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
          {/* Đánh giá từ sinh viên (Insider) */}
          <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center justify-between w-full">
                <span>Đánh giá từ sinh viên (Insider)</span>
                <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {insiderReviews.length}
                </span>
              </h3>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {insiderReviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-sub">Chưa nhận được phản hồi từ sinh viên.</div>
              ) : (
                insiderReviews.map((rev) => (
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
                    {renderDashboardComment(rev)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Đánh giá từ học sinh (Outsider) */}
          <div className="rounded-2xl border border-border-custom bg-brand-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-text-main flex items-center justify-between w-full">
                <span>Đánh giá từ học sinh (Outsider)</span>
                <span className="text-[9px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono font-bold">
                  {outsiderReviews.length}
                </span>
              </h3>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {outsiderReviews.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-sub">Chưa nhận được phản hồi từ học sinh.</div>
              ) : (
                outsiderReviews.map((rev) => (
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
                    {renderDashboardComment(rev)}
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
