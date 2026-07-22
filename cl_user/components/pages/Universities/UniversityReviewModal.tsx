"use client";

import type { FormEvent } from "react";
import type { University } from "@/hooks/useUniversities";
import type { UniversityReview } from "@/hooks/useUniversityReviews";
import { StarRating } from "./StarRating";
import { RatingsDisplay } from "./RatingsDisplay";
import { HTMLTextEditor } from "./HTMLTextEditor";
import { WordDocRender } from "./WordDocRender";

export interface UniversityReviewModalProps {
  selectedUni: University;
  myReview: UniversityReview | null | undefined;
  otherReviews: UniversityReview[];
  isEditing: boolean;
  isMyUniversity: (uniId: string) => boolean;
  modalSuccess: string | null;
  modalError: string | null;
  submittingReview: boolean;
  c1: number; c2: number; c3: number; c4: number;
  commentText: string;
  setC1: (v: number) => void;
  setC2: (v: number) => void;
  setC3: (v: number) => void;
  setC4: (v: number) => void;
  setCommentText: (v: string) => void;
  onClose: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSubmit: (e: FormEvent) => Promise<void>;
}

export function UniversityReviewModal({
  selectedUni,
  myReview,
  otherReviews,
  isEditing,
  isMyUniversity,
  modalSuccess,
  modalError,
  submittingReview,
  c1, c2, c3, c4,
  commentText,
  setC1, setC2, setC3, setC4,
  setCommentText,
  onClose,
  onStartEdit,
  onCancelEdit,
  onSubmit,
}: UniversityReviewModalProps) {
  const isOwn = isMyUniversity(selectedUni.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-brand-card border border-border-custom rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-sub hover:text-text-main transition-colors cursor-pointer text-base"
        >
          <i className="fa-solid fa-xmark" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black font-mono border ${
              isOwn
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-blue-500/10 text-blue-400 border-blue-500/20"
            }`}
          >
            {isOwn ? (
              <>
                <i className="fa-solid fa-graduation-cap" />
                ĐÁNH GIÁ NGƯỜI TRONG CUỘC (INSIDER)
              </>
            ) : (
              <>
                <i className="fa-solid fa-eye" />
                ĐÁNH GIÁ NGƯỜI NGOÀI CUỘC (OUTSIDER)
              </>
            )}
          </span>
          <h2 className="text-sm font-bold text-text-main tracking-tight leading-tight pr-6">
            Đánh giá: {selectedUni.name}
          </h2>
        </div>

        {/* Review Flow (Display existing vs Create/Edit Form) */}
        {myReview && !isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-brand-primary/5 p-4 rounded-xl border border-border-custom">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-text-sub font-mono uppercase">Đánh giá của bạn</span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-lg text-xs font-bold font-mono">
                    <span>{myReview.rating_stars}</span>
                    <i className="fa-solid fa-star text-[9px]" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-bold font-mono uppercase ${
                      myReview.is_approved
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}
                  >
                    {myReview.is_approved ? "Đã duyệt" : "Chờ duyệt"}
                  </span>
                </div>
              </div>
              <button
                onClick={onStartEdit}
                className="px-3.5 py-2 rounded-xl bg-linear-to-r from-brand-primary to-brand-secondary text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-xs hover:opacity-90 transition-all cursor-pointer"
              >
                Chỉnh sửa đánh giá
              </button>
            </div>

            <RatingsDisplay ratings={myReview.ratings} isInsider={isOwn} />

            <div className="space-y-1.5">
              <span className="block text-[10px] font-bold text-text-sub uppercase tracking-wider font-mono">
                Văn bản đánh giá (Định dạng Word)
              </span>
              <WordDocRender htmlContent={myReview.comment} />
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {modalSuccess && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-400">
                <i className="fa-solid fa-circle-check text-sm shrink-0" />
                <span className="font-mono">{modalSuccess}</span>
              </div>
            )}

            {modalError && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400">
                <i className="fa-solid fa-triangle-exclamation text-sm shrink-0" />
                <span className="font-mono">{modalError}</span>
              </div>
            )}

            {/* Criteria Ratings */}
            <div className="rounded-xl border border-border-custom bg-brand-primary/5 p-4 space-y-1">
              <span className="block text-[9px] font-black text-text-sub uppercase tracking-wider font-mono border-b border-border-custom pb-1.5 mb-2">
                Tiêu chí xếp hạng chất lượng
              </span>

              {isOwn ? (
                <>
                  <StarRating label="Chất lượng đào tạo" rating={c1} onChange={setC1} />
                  <StarRating label="Cơ sở vật chất" rating={c2} onChange={setC2} />
                  <StarRating label="Đội ngũ giảng viên" rating={c3} onChange={setC3} />
                  <StarRating label="Đời sống sinh viên" rating={c4} onChange={setC4} />
                </>
              ) : (
                <>
                  <StarRating label="Uy tín & Thương hiệu" rating={c1} onChange={setC1} />
                  <StarRating label="Học phí & Học bổng" rating={c2} onChange={setC2} />
                  <StarRating label="Vị trí & Khuôn viên" rating={c3} onChange={setC3} />
                  <StarRating label="Yêu cầu đầu vào" rating={c4} onChange={setC4} />
                </>
              )}
            </div>

            {/* Comment rich text */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-text-sub uppercase tracking-wider font-mono">
                Nội dung ý kiến đóng góp (Soạn thảo Word)
              </label>
              <HTMLTextEditor
                value={commentText}
                onChange={setCommentText}
                placeholder="Nhập nội dung nhận xét chi tiết về trường..."
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submittingReview}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-brand-primary to-brand-secondary py-3 px-4 font-mono text-[9px] font-black uppercase tracking-wider text-white shadow-md shadow-brand-primary/10 hover:opacity-95 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 transition-all cursor-pointer"
              >
                {submittingReview ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    {myReview ? "Lưu thay đổi" : "Gửi đánh giá"}
                    <i className="fa-solid fa-paper-plane text-[10px] ml-0.5" />
                  </>
                )}
              </button>
              {myReview && (
                <button
                  type="button"
                  onClick={onCancelEdit}
                  className="px-4 py-3 rounded-xl border border-border-custom text-text-sub hover:text-text-main font-mono text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Quay lại
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl border border-border-custom text-text-sub hover:text-text-main font-mono text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </form>
        )}

        {/* Other reviews listing */}
        {otherReviews.length > 0 && (
          <div className="pt-6 border-t border-border-custom space-y-3">
            <h3 className="text-xs font-bold text-text-main font-sans">Đánh giá khác từ người dùng</h3>
            <div className="space-y-4 max-h-62.5 overflow-y-auto custom-scrollbar pr-2">
              {otherReviews.map((rev) => {
                const isRevInsider =
                  rev.ratings && "isInsider" in rev.ratings
                    ? Boolean(rev.ratings.isInsider)
                    : isMyUniversity(selectedUni.id);
                return (
                  <div key={rev.id} className="space-y-2 bg-brand-primary/5 p-4 rounded-xl border border-border-custom/50">
                    <div className="flex items-center justify-between text-[10px] text-text-sub font-mono mb-2">
                      <span>Ẩn danh ({new Date(rev.created_at).toLocaleDateString("vi-VN")})</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono border ${
                            isRevInsider
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          }`}
                        >
                          {isRevInsider ? "Insider" : "Outsider"}
                        </span>
                        <div className="flex items-center gap-0.5 bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          <span>{rev.rating_stars}</span>
                          <i className="fa-solid fa-star text-[8px]" />
                        </div>
                      </div>
                    </div>

                    <RatingsDisplay ratings={rev.ratings} isInsider={isRevInsider} />
                    <WordDocRender htmlContent={rev.comment} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
