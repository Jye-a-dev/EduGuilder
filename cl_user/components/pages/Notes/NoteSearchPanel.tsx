"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { apiClient } from "@/libs/apiClient";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

interface NoteSearchPanelProps {
  onClose: () => void;
  onSelectNote: (id: string) => void;
}

export default function NoteSearchPanel({
  onClose,
  onSelectNote,
}: NoteSearchPanelProps) {
  const { token } = useAuthContext();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const delayDebounce = setTimeout(async () => {
      if (!token) return;
      setIsLoading(true);
      try {
        const res = await apiClient.get<{ data: SearchResult[] }>(`/notes?search=${encodeURIComponent(query)}`, { token });
        setResults(res.data || []);
      } catch (err) {
        console.error("Lỗi khi tìm kiếm:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce for search query

    return () => clearTimeout(delayDebounce);
  }, [query, token]);

  const displayResults = query.trim() ? results : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border-custom bg-brand-card shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header Search Field */}
        <div className="p-4 border-b border-border-custom flex items-center gap-3 bg-brand-sidebar/20">
          <i className="fa-solid fa-magnifying-glass text-text-sub text-sm" />
          <input
            type="text"
            autoFocus
            placeholder="Tìm kiếm nội dung ghi chú (Full-Text Search)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-xs text-text-main placeholder-text-sub outline-none"
          />
          <button
            onClick={onClose}
            className="text-text-sub hover:text-text-main transition-colors cursor-pointer text-xs"
          >
            Đóng
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-40">
          {isLoading && (
            <div className="py-8 text-center text-xs text-text-sub">
              <i className="fa-solid fa-spinner animate-spin text-brand-primary mr-2" />
              Đang lục tìm dữ liệu...
            </div>
          )}

          {!isLoading && displayResults.length === 0 && query.trim() !== "" && (
            <div className="py-8 text-center text-xs text-text-sub">
              Không tìm thấy ghi chú nào khớp với từ khóa.
            </div>
          )}

          {!isLoading && displayResults.length === 0 && query.trim() === "" && (
            <div className="py-8 text-center text-[10px] font-mono text-text-sub uppercase tracking-wider">
              Nhập từ khóa để tìm kiếm Full-Text Search.
            </div>
          )}

          {!isLoading && displayResults.length > 0 && (
            <div className="space-y-2.5">
              {displayResults.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onSelectNote(note.id)}
                  className="p-3.5 rounded-xl border border-border-custom bg-brand-dark/20 hover:border-brand-primary/40 hover:bg-brand-primary/5 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-text-main hover:text-brand-primary transition-colors">{note.title}</span>
                    <span className="text-[9px] text-text-sub font-mono">{new Date(note.created_at).toLocaleDateString("vi-VN")}</span>
                  </div>
                  {/* Extract a small snippet from content */}
                  <p className="text-[11px] text-text-sub font-light line-clamp-2 leading-relaxed">
                    {note.content.replace(/[#*`[\]]/g, "")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
