"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

// Layout
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";

// Custom API Hooks
import { useUniversityReviews } from "@/hooks/useUniversityReviews";

// Sub-components
import ReviewsTab from "./ReviewsTab";
import CreateReviewModal from "./Modals/CreateReviewModal";
import EditReviewModal from "./Modals/EditReviewModal";

// Types
import type { UniversityReview, ModalType } from "../types";

export default function ReviewsPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Active Modals & Selected Edit Target
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalFeedback, setModalFeedback] = useState<string | null>(null);

  // Bind Hook
  const {
    reviews,
    fetchReviews,
    createReview,
    updateReview,
    toggleReviewApproval,
    deleteReview,
  } = useUniversityReviews(token);

  // --- FORM STATES ---
  const [newRevUniId, setNewRevUniId] = useState("");
  const [newRevReviewerId, setNewRevReviewerId] = useState("");
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevComment, setNewRevComment] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRevRating, setEditRevRating] = useState(5);
  const [editRevComment, setEditRevComment] = useState("");
  const [editRevOfficialReply, setEditRevOfficialReply] = useState("");
  const [editRevIsApproved, setEditRevIsApproved] = useState(false);

  // Authenticate user on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token");
    if (!storedToken) {
      router.push("/");
      return;
    }
    setTimeout(() => {
      setToken(storedToken);
    }, 0);
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [token, fetchReviews]);

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
      setNewRevUniId("");
      setNewRevReviewerId("");
      setNewRevRating(5);
      setNewRevComment("");
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
    try {
      await toggleReviewApproval(id, currentStatus);
    } catch {
      window.alert("Không thể cập nhật trạng thái.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đánh giá này?")) return;
    try {
      await deleteReview(id);
    } catch {
      window.alert("Không thể xóa bài đánh giá.");
    }
  };

  return (
    <DashboardSetup>
      <ReviewsTab
        reviews={reviews}
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
    </DashboardSetup>
  );
}
