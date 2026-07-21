"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";
import type { UniversityReview } from "@/components/pages/AdminDashboard/types";

interface ReviewsPage {
  data: UniversityReview[];
  total: number;
}

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
      const json = await apiClient.get<ReviewsPage>("/university_reviews", {
        token,
        params: { limit: 100 },
      });
      const list = json.data || [];
      setReviews(list);
      setPendingReviewsCount(list.filter((x: UniversityReview) => !x.is_approved).length);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách reviews.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createReview = async (
    universityId: string,
    reviewerId: string,
    ratingStars: number,
    comment: string,
    ratings?: Record<string, number | boolean | string | undefined | null>
  ) => {
    if (!token) return;
    setError(null);
    await apiClient.post(
      "/university_reviews",
      {
        university_id: universityId,
        reviewer_id: reviewerId,
        rating_stars: ratingStars,
        comment,
        is_approved: true,
        ratings,
      },
      { token }
    );
    await fetchReviews();
  };

  const updateReview = async (
    id: string,
    body: {
      rating_stars: number;
      comment: string;
      official_reply?: string | null;
      is_approved: boolean;
      ratings?: Record<string, number | boolean | string | undefined | null>;
    }
  ) => {
    if (!token) return;
    setError(null);
    await apiClient.patch(`/university_reviews/${id}`, body, { token });
    await fetchReviews();
  };

  const toggleReviewApproval = async (id: string, currentStatus: boolean) => {
    if (!token) return;
    setError(null);
    await apiClient.patch(`/university_reviews/${id}`, { is_approved: !currentStatus }, { token });
    await fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!token) return;
    setError(null);
    await apiClient.delete(`/university_reviews/${id}`, {
      token,
      params: { hardDelete: true },
    });
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
