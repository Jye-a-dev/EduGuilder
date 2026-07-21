"use client";

import { useState, useEffect, type FormEvent } from "react";
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import { useDashboard } from "@/components/layouts/(dashboard)/DashboardContext";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";
import { useUniversities } from "@/hooks/useUniversities";
import { useAccounts } from "@/hooks/useAccounts";
import ReviewsTab from "./ReviewsTab";
import CriteriaTab from "./CriteriaTab";
import CreateReviewModal from "./Modals/CreateReviewModal";
import EditReviewModal from "./Modals/EditReviewModal";
import type { UniversityReview, ModalType } from "../types";

type ActiveTab = "reviews" | "criteria";

function ReviewsInner() {
  const { token } = useDashboard();
  const [activeTab, setActiveTab] = useState<ActiveTab>("reviews");

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const {
    reviews,
    isLoading: reviewsLoading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    toggleReviewApproval,
    deleteReview,
  } = useUniversityReviews(token);

  const { universities, fetchUniversities, isLoading: unisLoading } = useUniversities(token);
  const { accounts, fetchAccounts, isLoading: accountsLoading } = useAccounts(token);

  const isLoading = reviewsLoading || unisLoading || accountsLoading;

  const [newRevUniId, setNewRevUniId] = useState("");
  const [newRevReviewerId, setNewRevReviewerId] = useState("");
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState("");
  const [newRevRatings, setNewRevRatings] = useState<Record<string, number>>({ c1: 5, c2: 5, c3: 5, c4: 5 });
  const [newRevIsInsider, setNewRevIsInsider] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRevRating, setEditRevRating] = useState(5);
  const [editRevComment, setEditRevComment] = useState("");
  const [editRevOfficialReply, setEditRevOfficialReply] = useState("");
  const [editRevIsApproved, setEditRevIsApproved] = useState(false);
  const [editRevRatings, setEditRevRatings] = useState<Record<string, number | boolean>>({ c1: 5, c2: 5, c3: 5, c4: 5 });
  const [editIsInsider, setEditIsInsider] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchUniversities();
    fetchAccounts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const closeModal = () => {
    setActiveModal(null);
    setModalFeedback(null);
    setEditingId(null);
  };

  const handleCreateReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setModalFeedback(null);
    try {
      const avgRating = Math.round((newRevRatings.c1 + newRevRatings.c2 + newRevRatings.c3 + newRevRatings.c4) / 4) || newRevRating;
      const ratings = {
        ...newRevRatings,
        isInsider: newRevIsInsider,
      };
      await createReview(newRevUniId, newRevReviewerId, avgRating, newRevComment, ratings);
      setNewRevUniId(""); 
      setNewRevReviewerId(""); 
      setNewRevRating(5); 
      setNewRevComment("");
      setNewRevRatings({ c1: 5, c2: 5, c3: 5, c4: 5 });
      setNewRevIsInsider(true);
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const openEditReview = (r: UniversityReview) => {
    setEditingId(r.id);
    setEditRevRating(r.rating_stars);
    
    let cleanedComment = r.comment;
    if (r.comment.includes("Nội dung chi tiết:")) {
      const parts = r.comment.split("<strong>Nội dung chi tiết:</strong>");
      if (parts.length > 1) {
        cleanedComment = parts[1].replace(/<div>\s*([\s\S]*?)\s*<\/div>/, "$1").trim();
      }
    }
    setEditRevComment(cleanedComment);

    setEditRevOfficialReply(r.official_reply || "");
    setEditRevIsApproved(r.is_approved);
    
    const resolvedRatings = r.ratings || {
      c1: r.rating_stars,
      c2: r.rating_stars,
      c3: r.rating_stars,
      c4: r.rating_stars,
    };
    setEditRevRatings(resolvedRatings);
    
    const reviewer = accounts.find((a) => a.id === r.reviewer_id);
    const resolvedIsInsider = r.ratings && 'isInsider' in r.ratings ? Boolean(r.ratings.isInsider) : (reviewer?.university_id === r.university_id);
    setEditIsInsider(resolvedIsInsider);

    setActiveModal("edit-review");
  };

  const handleEditReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setModalFeedback(null);
    try {
      const c1 = Number(editRevRatings.c1 ?? editRevRating);
      const c2 = Number(editRevRatings.c2 ?? editRevRating);
      const c3 = Number(editRevRatings.c3 ?? editRevRating);
      const c4 = Number(editRevRatings.c4 ?? editRevRating);
      const calculatedAvg = Math.round((c1 + c2 + c3 + c4) / 4);

      await updateReview(editingId, {
        rating_stars: calculatedAvg,
        comment: editRevComment,
        official_reply: editRevOfficialReply || null,
        is_approved: editRevIsApproved,
        ratings: { c1, c2, c3, c4, isInsider: editIsInsider },
      });
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const handleToggleReviewApproval = async (id: string, currentStatus: boolean) => {
    try { await toggleReviewApproval(id, currentStatus); }
    catch { window.alert("Không thể cập nhật trạng thái."); }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đánh giá này?")) return;
    try { await deleteReview(id); }
    catch { window.alert("Không thể xóa bài đánh giá."); }
  };

  return (
    <>
      {/* Tab Header */}
      <div className="flex items-center gap-1 mb-6 bg-cyber-card/40 border border-gray-800 rounded-xl p-1 w-fit">
        {(["reviews", "criteria"] as const).map((tab) => {
          const isActive = activeTab === tab;
          const config = {
            reviews: { label: "Bài đánh giá", icon: "fa-comments" },
            criteria: { label: "Tiêu chí đánh giá", icon: "fa-list-check" },
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isActive
                  ? "bg-cyber-primary/20 text-cyber-cyan border border-cyber-primary/30 shadow"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <i className={`fa-solid ${config[tab].icon} text-[9px]`} />
              {config[tab].label}
            </button>
          );
        })}
      </div>

      {activeTab === "reviews" ? (
        <>
          <ReviewsTab
            reviews={reviews}
            universities={universities}
            accounts={accounts}
            isLoading={isLoading}
            error={error}
            onRetry={fetchReviews}
            handleToggleReviewApproval={handleToggleReviewApproval}
            openEditReview={openEditReview}
            handleDeleteReview={handleDeleteReview}
            setActiveModal={(modal: "create-review" | null) => setActiveModal(modal)}
          />
          <CreateReviewModal
            isOpen={activeModal === "create-review"}
            closeModal={closeModal}
            modalFeedback={modalFeedback}
            newRevUniId={newRevUniId}
            setNewRevUniId={setNewRevUniId}
            newRevReviewerId={newRevReviewerId}
            setNewRevReviewerId={setNewRevReviewerId}
            newRevRating={newRevRating}
            setNewRevRating={setNewRevRating}
            newRevComment={newRevComment}
            setNewRevComment={setNewRevComment}
            newRevRatings={newRevRatings}
            setNewRevRatings={setNewRevRatings}
            isInsider={newRevIsInsider}
            setIsInsider={setNewRevIsInsider}
            onSubmit={handleCreateReviewSubmit}
          />
          <EditReviewModal
            isOpen={activeModal === "edit-review"}
            closeModal={closeModal}
            modalFeedback={modalFeedback}
            editRevRating={editRevRating}
            setEditRevRating={setEditRevRating}
            editRevComment={editRevComment}
            setEditRevComment={setEditRevComment}
            editRevOfficialReply={editRevOfficialReply}
            setEditRevOfficialReply={setEditRevOfficialReply}
            editRevIsApproved={editRevIsApproved}
            setEditRevIsApproved={setEditRevIsApproved}
            editRevRatings={editRevRatings}
            setEditRevRatings={setEditRevRatings}
            isInsider={editIsInsider}
            setIsInsider={setEditIsInsider}
            onSubmit={handleEditReviewSubmit}
          />
        </>
      ) : (
        <CriteriaTab />
      )}
    </>
  );
}

export default function ReviewsPage() {
  return (
    <DashboardSetup>
      <ReviewsInner />
    </DashboardSetup>
  );
}
