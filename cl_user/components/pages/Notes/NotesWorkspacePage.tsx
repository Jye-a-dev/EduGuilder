"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { apiClient } from "@/libs/apiClient";
import SidebarFileTree from "./SidebarFileTree";
import MarkdownWorkspaceEditor from "./MarkdownWorkspaceEditor";
import GraphMiniView from "./GraphMiniView";
import NoteSearchPanel from "./NoteSearchPanel";

export interface FileNode {
  id: string;
  name: string;
  is_folder: boolean;
  parent_id: string | null;
  note_id: string | null;
  sort_order: number;
  children?: FileNode[];
}

export interface NoteTable {
  id?: string;
  table_index: number;
  headers: string[];
  rows: string[][];
}

export interface NoteSlide {
  id?: string;
  slide_index: number;
  slide_type: string;
  title: string;
  bullet_points: string[];
  background_color: string;
}

export interface NoteDetails {
  id: string;
  title: string;
  content: string;
  tags?: { id: string; name: string }[];
  tables?: NoteTable[];
  slides?: NoteSlide[];
}

function WorkspaceContent() {
  const { user, token } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeNoteId = searchParams.get("id");

  const [treeData, setTreeData] = useState<FileNode[]>([]);
  const [activeNote, setActiveNote] = useState<NoteDetails | null>(null);
  const [loadingNote, setLoadingNote] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchTree = useCallback(async () => {
    if (!user || !token) return;
    try {
      const tree = await apiClient.get<FileNode[]>(`/file_nodes/tree?student_id=${user.id}`, { token });
      setTreeData(tree || []);
    } catch (err) {
      console.error("Lỗi khi tải cây thư mục:", err);
    }
  }, [user, token]);

  const fetchActiveNote = useCallback(async (id: string) => {
    if (!token) return;
    setLoadingNote(true);
    try {
      const data = await apiClient.get<NoteDetails>(`/notes/${id}`, { token });
      setActiveNote(data);
    } catch (err) {
      console.error("Lỗi khi tải ghi chú:", err);
      setActiveNote(null);
    } finally {
      setLoadingNote(false);
    }
  }, [token]);

  useEffect(() => {
    const handle = setTimeout(() => {
      fetchTree();
    }, 0);
    return () => clearTimeout(handle);
  }, [fetchTree]);

  useEffect(() => {
    if (activeNoteId) {
      const handle = setTimeout(() => {
        fetchActiveNote(activeNoteId);
      }, 0);
      return () => clearTimeout(handle);
    } else {
      const handle = setTimeout(() => {
        setActiveNote(null);
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [activeNoteId, fetchActiveNote]);

  const selectNote = (noteId: string | null) => {
    if (noteId) {
      router.push(`/student/notes?id=${noteId}`);
    } else {
      router.push(`/student/notes`);
    }
  };

  const handleCreateNode = async (name: string, isFolder: boolean, parentId: string | null) => {
    if (!user || !token) return;
    try {
      let noteId: string | null = null;
      if (!isFolder) {
        const newNote = await apiClient.post<NoteDetails>("/notes", {
          student_id: user.id,
          title: name,
          content: "",
        }, { token });
        noteId = newNote.id;
      }

      await apiClient.post("/file_nodes", {
        student_id: user.id,
        name,
        is_folder: isFolder,
        parent_id: parentId,
        note_id: noteId,
      }, { token });

      await fetchTree();
      if (noteId) selectNote(noteId);
    } catch (err) {
      console.error("Lỗi khi tạo thư mục/tập tin:", err);
    }
  };

  const handleMoveNode = async (nodeId: string, parentId: string | null) => {
    if (!token) return;
    try {
      await apiClient.patch(`/file_nodes/${nodeId}`, { parent_id: parentId }, { token });
      await fetchTree();
    } catch (err) {
      console.error("Lỗi khi di chuyển node:", err);
    }
  };

  const handleDeleteNode = async (nodeId: string, noteId: string | null) => {
    if (!token) return;
    try {
      await apiClient.delete(`/file_nodes/${nodeId}`, { token });
      if (noteId) {
        await apiClient.delete(`/notes/${noteId}`, { token });
        if (activeNoteId === noteId) selectNote(null);
      }
      await fetchTree();
    } catch (err) {
      console.error("Lỗi khi xóa node:", err);
    }
  };

  const handleUpdateNote = async (id: string, updates: { title?: string; content?: string }) => {
    if (!token) return;
    try {
      const updated = await apiClient.patch<NoteDetails>(`/notes/${id}`, updates, { token });
      setActiveNote(updated);
      if (updates.title) {
        await fetchTree();
      }
    } catch (err) {
      console.error("Lỗi khi lưu ghi chú:", err);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-brand-dark/50 border border-border-custom rounded-2xl overflow-hidden relative backdrop-blur-md">
      {/* Sidebar Tree (Left) */}
      <SidebarFileTree
        treeData={treeData}
        activeNoteId={activeNoteId}
        onSelectNote={selectNote}
        onCreateNode={handleCreateNode}
        onMoveNode={handleMoveNode}
        onDeleteNode={handleDeleteNode}
      />

      {/* Editor Center Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-brand-sidebar/20 border-r border-border-custom relative">
        <div className="flex items-center justify-between px-6 py-3 border-b border-border-custom bg-brand-sidebar/30">
          <span className="text-[10px] font-bold text-text-sub uppercase font-mono tracking-wider">Workspace</span>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-card hover:bg-brand-primary/15 border border-border-custom text-[10px] font-bold text-text-sub hover:text-brand-primary font-mono transition-all cursor-pointer"
          >
            <i className="fa-solid fa-magnifying-glass" />
            Tìm kiếm FTS
          </button>
        </div>

        {activeNote ? (
          <div className="flex-1 overflow-hidden flex flex-col">
            <MarkdownWorkspaceEditor
              key={activeNote.id}
              activeNote={activeNote}
              onUpdateNote={handleUpdateNote}
              loading={loadingNote}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary">
              <i className="fa-solid fa-book-open text-2xl animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-text-main">Không có ghi chú nào đang mở</h4>
              <p className="text-[11px] text-text-sub font-light max-w-xs mt-1">Chọn ghi chú trên thanh bên trái hoặc tạo mới để bắt đầu học tập.</p>
            </div>
          </div>
        )}
      </div>

      {/* Localized Graph View (Right) */}
      {activeNote && (
        <GraphMiniView
          activeNoteId={activeNote.id}
          activeNoteTitle={activeNote.title}
          onSelectNote={selectNote}
        />
      )}

      {/* FTS Search Panel overlay */}
      {isSearchOpen && (
        <NoteSearchPanel
          onClose={() => setIsSearchOpen(false)}
          onSelectNote={(id) => {
            selectNote(id);
            setIsSearchOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default function NotesWorkspacePage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-brand-dark/50 border border-border-custom rounded-2xl">
        <div className="text-center text-xs text-text-sub">
          <i className="fa-solid fa-spinner animate-spin text-lg text-brand-primary mb-3 block" />
          Đang chuẩn bị không gian ghi chú...
        </div>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}
