"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { useNotes } from "@/hooks/useNotes";
import { useStudentGrades } from "@/hooks/useStudentGrades";
import { useStudentVerifications } from "@/hooks/useStudentVerifications";
import { useUniversities } from "@/hooks/useUniversities";
import { useUniversityReviews } from "@/hooks/useUniversityReviews";
import { useUniversityAdmissions } from "@/hooks/useUniversityAdmissions";

// Import split subcomponents
import UniversityDashboard from "./UniversityDashboard";
import StudentDashboard from "./StudentDashboard";
import StudentVerifyModal from "./StudentVerifyModal";

export default function UserDashboardPage() {
  const { user, token } = useAuthContext();

  // --- Student Specific Data Hooks ---
  const { notes, notesCount, fetchNotes, fetchNotesCount } = useNotes(token);
  const { grades, fetchGrades } = useStudentGrades(token);
  const { verification, fetchVerification, createVerification } = useStudentVerifications(token);

  // --- Student Verification form states ---
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [cardImageKey, setCardImageKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // --- University Specific Data Hooks ---
  const { singleUniversity, fetchUniversityById } = useUniversities(token);
  const { reviews, fetchReviews } = useUniversityReviews(token);
  const { admissions, fetchAdmissions } = useUniversityAdmissions(token);

  // Initial Unified Data Loader based on user role
  useEffect(() => {
    if (!token || !user) return;

    if (user.role === "student") {
      fetchNotes();
      fetchNotesCount();
      fetchGrades(user.id);
      fetchVerification(user.id);
    } else if (user.role === "uni" && user.university_id) {
      fetchUniversityById(user.university_id);
      fetchReviews(user.university_id);
      fetchAdmissions(user.university_id);
    }
  }, [token, user, fetchNotes, fetchNotesCount, fetchGrades, fetchVerification, fetchUniversityById, fetchReviews, fetchAdmissions]);

  if (!user) return null;

  // --- Student Computations ---
  const averageScore = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(2)
    : "N/A";

  const getVerificationColor = (status?: string) => {
    if (status === "approved") return "text-emerald-600 dark:text-emerald-400";
    if (status === "pending") return "text-amber-500";
    if (status === "rejected") return "text-rose-500";
    return "text-gray-400 dark:text-gray-500";
  };

  const getVerificationText = (status?: string) => {
    if (status === "approved") return "APPROVED";
    if (status === "pending") return "PENDING";
    if (status === "rejected") return "REJECTED";
    return "CHƯA XÁC THỰC";
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Vừa xong";
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${Math.floor(diffHours / 24)} ngày trước`;
  };

  // --- University Computations ---
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating_stars, 0) / reviews.length).toFixed(1)
    : "N/A";

  const handleVerifySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!cardImageKey.trim()) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await createVerification(user.id, cardImageKey);
      setIsVerifyModalOpen(false);
      setCardImageKey("");
      fetchVerification(user.id);
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Thao tác thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {user.role === "uni" ? (
        <UniversityDashboard
          user={user}
          singleUniversity={singleUniversity}
          reviews={reviews}
          admissions={admissions}
          averageRating={averageRating}
        />
      ) : (
        <StudentDashboard
          user={user}
          notes={notes}
          notesCount={notesCount}
          grades={grades}
          verification={verification}
          averageScore={averageScore}
          getVerificationColor={getVerificationColor}
          getVerificationText={getVerificationText}
          formatTimeAgo={formatTimeAgo}
          onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
        />
      )}

      {/* Student Verification Request Modal */}
      <StudentVerifyModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        cardImageKey={cardImageKey}
        setCardImageKey={setCardImageKey}
        isSubmitting={isSubmitting}
        modalError={modalError}
        onSubmit={handleVerifySubmit}
      />
    </>
  );
}
