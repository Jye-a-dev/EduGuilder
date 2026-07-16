"use client";

import { useState, useEffect, type FormEvent } from "react";
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";
import { useDashboard } from "@/components/layouts/(dashboard)/DashboardContext";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";
import ReviewsTab from "./ReviewsTab";
import CreateReviewModal from "./Modals/CreateReviewModal";
import EditReviewModal from "./Modals/EditReviewModal";
import type { UniversityReview, ModalType } from "../types";

function ReviewsInner() {
  const { token } = useDashboard();

  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  const {
    reviews,
    isLoading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    toggleReviewApproval,
    deleteReview,
  } = useUniversityReviews(token);

  const [newRevUniId, setNewRevUniId] = useState("");
  const [newRevReviewerId, setNewRevReviewerId] = useState("");
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRevRating, setEditRevRating] = useState(5);
  const [editRevComment, setEditRevComment] = useState("");
  const [editRevOfficialReply, setEditRevOfficialReply] = useState("");
  const [editRevIsApproved, setEditRevIsApproved] = useState(false);

  useEffect(() => {
    fetchReviews();
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
      await createReview(newRevUniId, newRevReviewerId, newRevRating, newRevComment);
      setNewRevUniId(""); setNewRevReviewerId(""); setNewRevRating(5); setNewRevComment("");
      closeModal();
    } catch (err: unknown) {
      setModalFeedback(err instanceof Error ? err.message : "Thao tác thất bại.");
    }
  };

  const openEditReview = (r: UniversityReview) => {
    setEditingId(r.id);
    setEditRevRating(r.rating_stars);
    setEditRevComment(r.comment);
    setEditRevOfficialReply(r.official_reply || "");
    setEditRevIsApproved(r.is_approved);
    setActiveModal("edit-review");
  };

  const handleEditReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setModalFeedback(null);
    try {
      await updateReview(editingId, {
        rating_stars: editRevRating,
        comment: editRevComment,
        official_reply: editRevOfficialReply || null,
        is_approved: editRevIsApproved,
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
      <ReviewsTab
        reviews={reviews}
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
        onSubmit={handleEditReviewSubmit}
      />
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
