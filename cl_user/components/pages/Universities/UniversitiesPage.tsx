"use client";

import { useEffect, useState, useMemo, type FormEvent } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useUniversities, type University } from "@/hooks/useUniversities";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";
import { UniversityCard } from "./UniversityCard";
import { UniversityReviewModal } from "./UniversityReviewModal";

export default function UniversitiesPage() {
  const { user, token } = useAuthContext();
  const { universities, fetchUniversities, isLoading: loadingUnis } = useUniversities(token);
  const { reviews, fetchReviews, createReview, updateReview, isLoading: loadingReviews } = useUniversityReviews(token);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Review rating criteria
  const [c1, setC1] = useState(5);
  const [c2, setC2] = useState(5);
  const [c3, setC3] = useState(5);
  const [c4, setC4] = useState(5);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchUniversities();
    fetchReviews();
  }, [fetchUniversities, fetchReviews]);

  // Dynamic titles based on user role
  const pageTitle = user?.role === "uni" ? "Đánh giá từ sinh viên" : "Đánh giá từ học sinh";
  const pageSubtitle =
    user?.role === "uni"
      ? "Xem phản hồi, chất lượng đánh giá từ sinh viên đang học tập tại trường."
      : "Tìm kiếm các trường đại học và thực hiện đánh giá dưới góc nhìn học sinh phổ thông.";

  const getAverageRating = (uniId: string) => {
    const uniReviews = reviews.filter((r) => r.university_id === uniId && r.is_approved);
    if (uniReviews.length === 0) return "N/A";
    const sum = uniReviews.reduce((acc, r) => acc + r.rating_stars, 0);
    return (sum / uniReviews.length).toFixed(1);
  };

  const getReviewsCount = (uniId: string) =>
    reviews.filter((r) => r.university_id === uniId && r.is_approved).length;

  const filteredUnis = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMyUniversity = (uniId: string) => {
    if (user?.role === "student") return false;
    return user?.university_id === uniId;
  };

  const myReview = useMemo(() => {
    if (!selectedUni || !user) return null;
    return reviews.find((r) => r.university_id === selectedUni.id && r.reviewer_id === user.id);
  }, [selectedUni, reviews, user]);

  const otherReviews = useMemo(() => {
    if (!selectedUni) return [];
    return reviews.filter(
      (r) => r.university_id === selectedUni.id && r.is_approved && r.reviewer_id !== user?.id
    );
  }, [selectedUni, reviews, user]);

  const parseExistingComment = (comment: string) => {
    if (comment.includes("Nội dung chi tiết:")) {
      const parts = comment.split("<strong>Nội dung chi tiết:</strong>");
      if (parts.length > 1) {
        return parts[1].replace(/<div>\s*([\s\S]*?)\s*<\/div>/, "$1").trim();
      }
    }
    return comment;
  };

  const openReviewModal = (uni: University) => {
    setSelectedUni(uni);
    setModalSuccess(null);
    setModalError(null);
    setIsEditing(false);

    const existing = reviews.find((r) => r.university_id === uni.id && r.reviewer_id === user?.id);
    if (existing) {
      setC1(Number(existing.ratings?.c1 ?? existing.rating_stars ?? 5));
      setC2(Number(existing.ratings?.c2 ?? existing.rating_stars ?? 5));
      setC3(Number(existing.ratings?.c3 ?? existing.rating_stars ?? 5));
      setC4(Number(existing.ratings?.c4 ?? existing.rating_stars ?? 5));
      setCommentText(parseExistingComment(existing.comment));
    } else {
      setC1(5); setC2(5); setC3(5); setC4(5);
      setCommentText("");
    }
  };

  const startEditMode = () => {
    if (!myReview) return;
    setIsEditing(true);
    setC1(Number(myReview.ratings?.c1 ?? myReview.rating_stars ?? 5));
    setC2(Number(myReview.ratings?.c2 ?? myReview.rating_stars ?? 5));
    setC3(Number(myReview.ratings?.c3 ?? myReview.rating_stars ?? 5));
    setC4(Number(myReview.ratings?.c4 ?? myReview.rating_stars ?? 5));
    setCommentText(parseExistingComment(myReview.comment));
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUni) return;

    setSubmittingReview(true);
    setModalSuccess(null);
    setModalError(null);

    const isInsider = isMyUniversity(selectedUni.id);
    const avgRating = Math.round((c1 + c2 + c3 + c4) / 4);

    try {
      if (myReview) {
        await updateReview(myReview.id, {
          rating_stars: avgRating,
          comment: commentText,
          ratings: { c1, c2, c3, c4, isInsider },
        });
        setModalSuccess("Cập nhật bài đánh giá thành công!");
      } else {
        await createReview({
          university_id: selectedUni.id,
          reviewer_id: user.id,
          rating_stars: avgRating,
          comment: commentText,
          ratings: { c1, c2, c3, c4, isInsider },
        });
        setModalSuccess("Gửi đánh giá thành công! Đang chờ phê duyệt từ Ban quản trị.");
      }

      setTimeout(() => {
        setSelectedUni(null);
        fetchReviews();
      }, 1800);
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu đánh giá.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight font-sans">
            {pageTitle} 🏫
          </h1>
          <p className="text-xs text-text-sub font-light mt-0.5">{pageSubtitle}</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-text-sub text-sm" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-brand-card border border-border-custom text-text-main placeholder-text-sub outline-hidden focus:border-brand-primary/60 transition-all"
          />
        </div>
      </div>

      {/* Grid of Universities */}
      {(loadingUnis || loadingReviews) && universities.length === 0 ? (
        <div className="py-20 text-center text-xs text-text-sub">
          <i className="fa-solid fa-spinner animate-spin text-lg text-brand-primary mb-3 block" />
          Đang tải dữ liệu trường học...
        </div>
      ) : filteredUnis.length === 0 ? (
        <div className="py-20 text-center text-xs text-text-sub bg-brand-card rounded-2xl border border-border-custom">
          Không tìm thấy trường đại học nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnis.map((uni) => (
            <UniversityCard
              key={uni.id}
              uni={uni}
              isOwn={isMyUniversity(uni.id)}
              averageRating={getAverageRating(uni.id)}
              reviewsCount={getReviewsCount(uni.id)}
              onOpenModal={openReviewModal}
            />
          ))}
        </div>
      )}

      {/* Evaluation Modal */}
      {selectedUni && (
        <UniversityReviewModal
          selectedUni={selectedUni}
          myReview={myReview}
          otherReviews={otherReviews}
          isEditing={isEditing}
          isMyUniversity={isMyUniversity}
          modalSuccess={modalSuccess}
          modalError={modalError}
          submittingReview={submittingReview}
          c1={c1} c2={c2} c3={c3} c4={c4}
          commentText={commentText}
          setC1={setC1} setC2={setC2} setC3={setC3} setC4={setC4}
          setCommentText={setCommentText}
          onClose={() => setSelectedUni(null)}
          onStartEdit={startEditMode}
          onCancelEdit={() => setIsEditing(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
