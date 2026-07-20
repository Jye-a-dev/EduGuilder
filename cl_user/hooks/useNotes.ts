"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/libs/apiClient";

export interface Note {
  id: string;
  title: string;
  content: string;
  subject?: string;
  eco_points: number;
  created_at: string;
  user_id: string;
}

export function useNotes(token: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesCount, setNotesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ data: Note[]; total: number }>("/notes", { token });
      setNotes(res.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể tải danh sách tài liệu.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const fetchNotesCount = useCallback(async () => {
    if (!token) return;
    try {
      const { count } = await apiClient.get<{ count: number }>("/notes/count", { token });
      setNotesCount(count);
    } catch (err: unknown) {
      console.error("Lỗi khi tải số lượng tài liệu:", err);
    }
  }, [token]);

  const createNote = async (payload: { title: string; content: string; subject?: string }) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const newNote = await apiClient.post<Note>("/notes", payload, { token });
      setNotes(prev => [newNote, ...prev]);
      setNotesCount(prev => prev + 1);
      return newNote;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi tạo tài liệu mới.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      await apiClient.delete<void>(`/notes/${id}`, { token });
      setNotes(prev => prev.filter(n => n.id !== id));
      setNotesCount(prev => Math.max(0, prev - 1));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi xóa tài liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notes,
    notesCount,
    isLoading,
    error,
    fetchNotes,
    fetchNotesCount,
    createNote,
    deleteNote,
  };
}
