"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";

export interface StudentGrade {
  id: string;
  student_id: string;
  semester: string;
  subject_name: string;
  score: number;
  created_at: string;
}

export function useStudentGrades(token: string | null) {
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async (userId?: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: StudentGrade[]; total: number }>("/student_grades", { 
        token,
        params: userId ? { student_id: userId } : {}
      });
      setGrades(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải tiến trình học tập.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createGrade = async (studentId: string, payload: { semester: string; subject_name: string; score: number }) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const newGrade = await apiClient.post<StudentGrade>("/student_grades", {
        student_id: studentId,
        ...payload
      }, { token });
      setGrades(prev => [newGrade, ...prev]);
      return newGrade;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi tạo tiến trình học tập.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateGrade = async (id: string, payload: { semester?: string; subject_name?: string; score?: number }) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const updated = await apiClient.patch<StudentGrade>(`/student_grades/${id}`, payload, { token });
      setGrades(prev => prev.map(g => g.id === id ? updated : g));
      return updated;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi cập nhật điểm môn học.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteGrade = async (id: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete(`/student_grades/${id}`, { token });
      setGrades(prev => prev.filter(g => g.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi xóa điểm môn học.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    grades,
    isLoading,
    error,
    fetchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
  };
}
