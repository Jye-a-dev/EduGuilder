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

  return {
    reviews,
    isLoading,
    error,
    fetchReviews,
  };
}
