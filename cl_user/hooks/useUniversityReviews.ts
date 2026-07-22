"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";

export interface UniversityReview {
  id: string;
  university_id: string;
  reviewer_id: string;
  rating_stars: number;
  comment: string;
  official_reply?: string | null;
  is_approved: boolean;
  ratings?: Record<string, number | boolean> | null;
  created_at: string;
}

export function useUniversityReviews(token: string | null) {
  const [reviews, setReviews] = useState<UniversityReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (universityId?: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: UniversityReview[]; total: number }>("/university_reviews", {
        token,
        params: universityId ? { university_id: universityId } : {}
      });
      setReviews(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách đánh giá.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createReview = async (payload: {
    university_id: string;
    reviewer_id: string;
    rating_stars: number;
    comment: string;
    ratings?: Record<string, number | boolean>;
  }) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post<UniversityReview>("/university_reviews", payload, { token });
      setReviews((prev) => [res, ...prev]);
      return res;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi gửi đánh giá.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (id: string, payload: {
    rating_stars: number;
    comment: string;
    ratings?: Record<string, number | boolean>;
  }) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.patch<UniversityReview>(`/university_reviews/${id}`, payload, { token });
      setReviews((prev) => prev.map((r) => (r.id === id ? res : r)));
      return res;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật đánh giá.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
    createReview,
    updateReview,
  };
}
