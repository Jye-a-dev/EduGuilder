"use client";

import { useEffect, useState, useRef, useMemo, type FormEvent } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useUniversities, type University } from "@/hooks/useUniversities";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";
import { useTheme } from "@/components/providers/ThemeProvider";

// Star rating interactive helper component
interface StarRatingProps {
  label: string;
  rating: number;
  onChange: (rating: number) => void;
}

function StarRating({ label, rating, onChange }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-between py-2 border-b border-border-custom last:border-0">
      <span className="text-xs font-medium text-text-sub">{label}</span>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            className="focus:outline-none transition-transform active:scale-90 cursor-pointer text-base"
          >
            <i
              className={`fa-solid fa-star ${
                star <= (hoverRating ?? rating)
                  ? "text-amber-500"
                  : "text-gray-300 dark:text-gray-700"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Custom rich HTML text editor component styled like Microsoft Word with dark/light mode
interface HTMLTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function HTMLTextEditor({ value, onChange, placeholder }: HTMLTextEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize internal HTML with outer state changes once on mount/edit load
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCmd = (command: string, arg = "") => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`rounded-xl border shadow-xs overflow-hidden flex flex-col font-sans ${
      theme === "dark" ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
    }`}>
      {/* Editor Toolbar */}
      <div className={`flex flex-wrap items-center gap-1 border-b p-2 text-xs ${
        theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-gray-50 border-gray-200 text-gray-700"
      }`}>
        <button
          type="button"
          onClick={() => execCmd("bold")}
          className={`w-7 h-7 flex items-center justify-center rounded font-bold transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="In đậm (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCmd("italic")}
          className={`w-7 h-7 flex items-center justify-center rounded italic transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCmd("underline")}
          className={`w-7 h-7 flex items-center justify-center rounded underline transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Gạch chân (Ctrl+U)"
        >
          U
        </button>
        <div className={`w-px h-5 mx-1 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
        <button
          type="button"
          onClick={() => execCmd("insertUnorderedList")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Danh sách dấu chấm"
        >
          <i className="fa-solid fa-list-ul" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("insertOrderedList")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Danh sách số"
        >
          <i className="fa-solid fa-list-ol" />
        </button>
        <div className={`w-px h-5 mx-1 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
        <button
          type="button"
          onClick={() => execCmd("justifyLeft")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Canh lề trái"
        >
          <i className="fa-solid fa-align-left" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("justifyCenter")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Canh lề giữa"
        >
          <i className="fa-solid fa-align-center" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("justifyRight")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Canh lề phải"
        >
          <i className="fa-solid fa-align-right" />
        </button>
      </div>

      {/* Editor Page Container styled like a premium Word Page */}
      <div className={`p-4 min-h-55 overflow-y-auto custom-scrollbar flex justify-center ${
        theme === "dark" ? "bg-zinc-950" : "bg-gray-100"
      }`}>
        <div 
          ref={editorRef}
          contentEditable
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          data-placeholder={placeholder}
          className={`w-full max-w-[21cm] border shadow-xs p-6 outline-none min-h-45 text-xs leading-relaxed text-left ${
            theme === "dark" 
              ? "bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700" 
              : "bg-white border-gray-300 text-gray-900 focus:ring-brand-primary"
          }`}
          style={{
            fontFamily: "Times New Roman, Times, serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word"
          }}
        />
      </div>
    </div>
  );
}

// Word Document styled render block
interface WordDocRenderProps {
  htmlContent: string;
}

function WordDocRender({ htmlContent }: WordDocRenderProps) {
  const { theme } = useTheme();
  
  // Convert standard newlines to paragraphs if it doesn't contain HTML markup
  const cleanHtml = useMemo(() => {
    if (!htmlContent.includes("<") && !htmlContent.includes(">")) {
      return htmlContent.split("\n").map(p => `<p class="mb-2">${p}</p>`).join("");
    }
    return htmlContent;
  }, [htmlContent]);

  return (
    <div 
      className={`border shadow-xs p-5 text-xs text-left overflow-x-auto max-h-75 ${
        theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-gray-300 text-gray-900"
      }`}
      style={{
        fontFamily: "Times New Roman, Times, serif",
        lineHeight: "1.6",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "break-word"
      }}
    >
      <div 
        className={`prose prose-sm max-w-none prose-headings:font-serif prose-p:my-1 prose-ul:list-disc prose-ol:list-decimal pl-4 ${
          theme === "dark" ? "prose-invert text-zinc-100" : "text-gray-900"
        }`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}

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

  // Review states based on Insider/Outsider
  const [c1, setC1] = useState(5); // Insider: Training quality | Outsider: Reputation
  const [c2, setC2] = useState(5); // Insider: Facilities | Outsider: Tuition fees
  const [c3, setC3] = useState(5); // Insider: Lecturers | Outsider: Campus
  const [c4, setC4] = useState(5); // Insider: Student life | Outsider: Admission
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchUniversities();
    fetchReviews();
  }, [fetchUniversities, fetchReviews]);

  // Dynamic titles based on user role
  const pageTitle = user?.role === "uni" ? "Đánh giá từ sinh viên" : "Đánh giá từ học sinh";
  const pageSubtitle = user?.role === "uni" 
    ? "Xem phản hồi, chất lượng đánh giá từ sinh viên đang học tập tại trường."
    : "Tìm kiếm các trường đại học và thực hiện đánh giá dưới góc nhìn học sinh phổ thông.";

  // Compute stats for universities
  const getAverageRating = (uniId: string) => {
    const uniReviews = reviews.filter((r) => r.university_id === uniId && r.is_approved);
    if (uniReviews.length === 0) return "N/A";
    const sum = uniReviews.reduce((acc, r) => acc + r.rating_stars, 0);
    return (sum / uniReviews.length).toFixed(1);
  };

  const getReviewsCount = (uniId: string) => {
    return reviews.filter((r) => r.university_id === uniId && r.is_approved).length;
  };

  // Filtered universities list
  const filteredUnis = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMyUniversity = (uniId: string) => {
    return user?.university_id === uniId;
  };

  // Identify if user has already reviewed the selected university
  const myReview = useMemo(() => {
    if (!selectedUni || !user) return null;
    return reviews.find((r) => r.university_id === selectedUni.id && r.reviewer_id === user.id);
  }, [selectedUni, reviews, user]);

  // Filter out other reviews for the current school
  const otherReviews = useMemo(() => {
    if (!selectedUni) return [];
    return reviews.filter((r) => r.university_id === selectedUni.id && r.is_approved && r.reviewer_id !== user?.id);
  }, [selectedUni, reviews, user]);

  const openReviewModal = (uni: University) => {
    setSelectedUni(uni);
    setModalSuccess(null);
    setModalError(null);
    setIsEditing(false);

    // If my review exists, load its parameters into edit state as fallback
    const existing = reviews.find((r) => r.university_id === uni.id && r.reviewer_id === user?.id);
    if (existing) {
      setC1(5); setC2(5); setC3(5); setC4(5);
      setCommentText(existing.comment);
    } else {
      setC1(5); setC2(5); setC3(5); setC4(5);
      setCommentText("");
    }
  };

  const startEditMode = () => {
    if (!myReview) return;
    setIsEditing(true);
    // Parse existing scores if possible (or default to 5)
    setC1(myReview.rating_stars);
    setC2(myReview.rating_stars);
    setC3(myReview.rating_stars);
    setC4(myReview.rating_stars);
    setCommentText(myReview.comment);
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !selectedUni) return;

    setSubmittingReview(true);
    setModalSuccess(null);
    setModalError(null);

    const isInsider = isMyUniversity(selectedUni.id);
    const avgRating = Math.round((c1 + c2 + c3 + c4) / 4);

    const header = isInsider ? "--- ĐÁNH GIÁ NGƯỜI TRONG CUỘC ---" : "--- ĐÁNH GIÁ NGƯỜI NGOÀI CUỘC ---";
    const c1Label = isInsider ? "Chất lượng đào tạo" : "Uy tín & Thương hiệu";
    const c2Label = isInsider ? "Cơ sở vật chất" : "Học phí & Học bổng";
    const c3Label = isInsider ? "Đội ngũ giảng viên" : "Vị trí & Khuôn viên";
    const c4Label = isInsider ? "Đời sống sinh viên" : "Yêu cầu đầu vào";

    const formattedComment = `
<p style="font-weight: bold; text-align: center;">${header}</p>
<p>- ${c1Label}: ${c1}/5 ⭐</p>
<p>- ${c2Label}: ${c2}/5 ⭐</p>
<p>- ${c3Label}: ${c3}/5 ⭐</p>
<p>- ${c4Label}: ${c4}/5 ⭐</p>
<p><strong>Nội dung chi tiết:</strong></p>
<div>${commentText}</div>
    `.trim();

    try {
      if (myReview) {
        // Edit existing review
        await updateReview(myReview.id, {
          rating_stars: avgRating,
          comment: formattedComment,
        });
        setModalSuccess("Cập nhật bài đánh giá thành công!");
      } else {
        // Create new review
        await createReview({
          university_id: selectedUni.id,
          reviewer_id: user.id,
          rating_stars: avgRating,
          comment: formattedComment,
        });
        setModalSuccess("Gửi đánh giá thành công! Đang chờ phê duyệt từ Ban quản trị.");
      }

      setTimeout(() => {
        setSelectedUni(null);
        fetchReviews(); // reload reviews
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
          <p className="text-xs text-text-sub font-light mt-0.5">
            {pageSubtitle}
          </p>
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
          {filteredUnis.map((uni) => {
            const isOwn = isMyUniversity(uni.id);
            const avg = getAverageRating(uni.id);
            const count = getReviewsCount(uni.id);

            return (
              <div
                key={uni.id}
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
                  </div>
                </div>

                {/* Rating & Actions */}
                <div className="pt-4 border-t border-border-custom flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <i className="fa-solid fa-star text-[10px] text-amber-500" />
                      <span className="text-xs font-black text-text-main font-mono">{avg}</span>
                    </div>
                    <span className="text-[10px] text-text-sub font-mono">({count} đánh giá)</span>
                  </div>

                  <button
                    onClick={() => openReviewModal(uni)}
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
          })}
        </div>
      )}

      {/* --- EVALUATION MODAL --- */}
      {selectedUni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-brand-card border border-border-custom rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Close */}
            <button
              onClick={() => setSelectedUni(null)}
              className="absolute top-4 right-4 text-text-sub hover:text-text-main transition-colors cursor-pointer text-base"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black font-mono border ${
                  isMyUniversity(selectedUni.id)
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}
              >
                {isMyUniversity(selectedUni.id) ? (
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
                    onClick={startEditMode}
                    className="px-3.5 py-2 rounded-xl bg-linear-to-r from-brand-primary to-brand-secondary text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-xs hover:opacity-90 transition-all cursor-pointer"
                  >
                    Chỉnh sửa đánh giá
                  </button>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-text-sub uppercase tracking-wider font-mono">Văn bản đánh giá (Định dạng Word)</span>
                  <WordDocRender htmlContent={myReview.comment} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
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

                  {isMyUniversity(selectedUni.id) ? (
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
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-3 rounded-xl border border-border-custom text-text-sub hover:text-text-main font-mono text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Quay lại
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedUni(null)}
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
                  {otherReviews.map((rev) => (
                    <div key={rev.id} className="space-y-2 bg-brand-primary/5 p-3 rounded-xl border border-border-custom/50">
                      <div className="flex items-center justify-between text-[10px] text-text-sub font-mono">
                        <span>Ẩn danh ({new Date(rev.created_at).toLocaleDateString("vi-VN")})</span>
                        <div className="flex items-center gap-0.5 bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded text-[9px] font-bold">
                          <span>{rev.rating_stars}</span>
                          <i className="fa-solid fa-star text-[8px]" />
                        </div>
                      </div>
                      <WordDocRender htmlContent={rev.comment} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
