"use client";

import { useState, useCallback } from "react";
import type { UniversityReview } from "@/components/pages/AdminDashboard/types";

export function useUniversityReviews(token: string | null) {
  const [reviews, setReviews] = useState<UniversityReview[]>([]);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:3000/university_reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải danh sách reviews.");
      const json = await res.json();
      const list = json.data || [];
      setReviews(list);
      setPendingReviewsCount(list.filter((x: UniversityReview) => !x.is_approved).length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createReview = async (universityId: string, reviewerId: string, ratingStars: number, comment: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch("http://localhost:3000/university_reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        university_id: universityId,
        reviewer_id: reviewerId,
        rating_stars: ratingStars,
        comment,
        is_approved: true,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi khi tạo đánh giá.");
    }
    await fetchReviews();
  };

  const updateReview = async (
    id: string,
    body: { rating_stars: number; comment: string; official_reply?: string | null; is_approved: boolean }
  ) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/university_reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Lỗi khi cập nhật đánh giá.");
    }
    await fetchReviews();
  };

  const toggleReviewApproval = async (id: string, currentStatus: boolean) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/university_reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_approved: !currentStatus }),
    });
    if (!res.ok) throw new Error("Không thể cập nhật trạng thái review.");
    await fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!token) return;
    setError(null);
    const res = await fetch(`http://localhost:3000/university_reviews/${id}?hardDelete=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Không thể xóa đánh giá.");
    await fetchReviews();
  };

  return {
    reviews,
    pendingReviewsCount,
    isLoading,
    error,
    fetchReviews,
    createReview,
    updateReview,
    toggleReviewApproval,
    deleteReview,
  };
}
