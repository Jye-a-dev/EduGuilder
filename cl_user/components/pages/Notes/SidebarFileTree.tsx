"use client";

import { useState } from "react";
import { FileNode } from "./NotesWorkspacePage";

interface SidebarFileTreeProps {
  treeData: FileNode[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string | null) => void;
  onCreateNode: (name: string, isFolder: boolean, parentId: string | null) => Promise<void>;
  onMoveNode: (nodeId: string, parentId: string | null) => Promise<void>;
  onDeleteNode: (nodeId: string, noteId: string | null) => Promise<void>;
}

export default function SidebarFileTree({
  treeData,
  activeNoteId,
  onSelectNote,
  onCreateNode,
  onMoveNode,
  onDeleteNode,
}: SidebarFileTreeProps) {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [creationTarget, setCreationTarget] = useState<{ parentId: string | null; isFolder: boolean } | null>(null);
  const [newNodeName, setNewNodeName] = useState("");
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    nodeId: string;
    noteId: string | null;
    name: string;
    isFolder: boolean;
  } | null>(null);

  const toggleFolder = (folderId: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleStartCreate = (parentId: string | null, isFolder: boolean) => {
    setCreationTarget({ parentId, isFolder });
    setNewNodeName("");
  };

  const handleConfirmCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim() || !creationTarget) return;
    await onCreateNode(newNodeName.trim(), creationTarget.isFolder, creationTarget.parentId);
    setCreationTarget(null);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    e.dataTransfer.setData("text/plain", nodeId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string | null) => {
    e.preventDefault();
    if (dragOverId !== targetId) {
      setDragOverId(targetId);
    }
  };

  const handleDrop = async (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    setDragOverId(null);
    const sourceNodeId = e.dataTransfer.getData("text/plain");
    if (sourceNodeId && sourceNodeId !== targetFolderId) {
      await onMoveNode(sourceNodeId, targetFolderId);
    }
  };

  // Recursive node renderer
  const renderNode = (node: FileNode, depth = 0) => {
    const isFolder = node.is_folder;
    const isCollapsed = collapsedFolders[node.id];
    const isActive = node.note_id === activeNoteId;

    return (
      <div key={node.id} className="space-y-0.5 select-none">
        {/* Node Label Row */}
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragOver={(e) => handleDragOver(e, isFolder ? node.id : (node.parent_id || "root"))}
          onDragLeave={() => {
            setDragOverId((prev) => (prev === (isFolder ? node.id : (node.parent_id || "root")) ? null : prev));
          }}
          onDrop={(e) => handleDrop(e, isFolder ? node.id : node.parent_id)}
          style={{ paddingLeft: `${depth * 14 + 12}px` }}
          className={`
            group flex items-center justify-between py-1.5 pr-3 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150
            ${isActive
              ? "bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary pl-2.5"
              : "text-text-sub hover:text-text-main hover:bg-gray-100/50 dark:hover:bg-gray-800/40"
            }
            ${dragOverId === node.id && isFolder ? "bg-brand-primary/20 text-brand-primary border border-brand-primary/30 scale-[1.01] pl-2.5" : ""}
          `}
          onClick={() => {
            if (isFolder) {
              toggleFolder(node.id);
            } else if (node.note_id) {
              onSelectNote(node.note_id);
            }
          }}
        >
          <div className="flex items-center gap-2 min-w-0 pointer-events-none">
            {isFolder ? (
              <>
                <i className={`fa-solid fa-chevron-right text-[9px] shrink-0 text-text-sub transition-transform duration-200 ${!isCollapsed ? "rotate-90" : ""}`} />
                <i className="fa-solid fa-folder text-brand-primary shrink-0 text-sm" />
              </>
            ) : (
              <>
                <span className="w-2.25" /> {/* spacing mock chevron */}
                <i className="fa-regular fa-file-lines text-brand-secondary shrink-0 text-sm" />
              </>
            )}
            <span className="truncate">{node.name}</span>
          </div>

          {/* Node Actions on Hover */}
          <div className="hidden group-hover:flex items-center gap-1.5 ml-2">
            {isFolder && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartCreate(node.id, false);
                  }}
                  className="text-[10px] text-text-sub hover:text-brand-secondary p-0.5"
                  title="Thêm ghi chú"
                >
                  <i className="fa-solid fa-file-circle-plus" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartCreate(node.id, true);
                  }}
                  className="text-[10px] text-text-sub hover:text-brand-primary p-0.5"
                  title="Thêm thư mục"
                >
                  <i className="fa-solid fa-folder-plus" />
                </button>
              </>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteConfirmation({
                  nodeId: node.id,
                  noteId: node.note_id,
                  name: node.name,
                  isFolder: isFolder,
                });
              }}
              className="text-[10px] text-text-sub hover:text-red-500 p-0.5"
              title="Xóa"
            >
              <i className="fa-solid fa-trash-can" />
            </button>
          </div>
        </div>

        {/* Children Render block (indented recursion) */}
        {isFolder && !isCollapsed && node.children && (
          <div className="space-y-0.5">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside
      onDragOver={(e) => handleDragOver(e, "root")}
      onDragLeave={() => setDragOverId((prev) => (prev === "root" ? null : prev))}
      onDrop={(e) => handleDrop(e, null)}
      className="w-64 bg-brand-sidebar border-r border-border-custom flex flex-col justify-between shrink-0"
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header toolbar */}
        <div className="p-4 border-b border-border-custom flex items-center justify-between">
          <span className="text-xs font-bold text-text-main font-mono uppercase tracking-wider">Thư mục ghi chú</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleStartCreate(null, false)}
              className="w-7 h-7 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/40 flex items-center justify-center text-text-sub hover:text-brand-secondary transition-colors cursor-pointer text-xs"
              title="Thêm tập tin gốc"
            >
              <i className="fa-solid fa-file-circle-plus" />
            </button>
            <button
              onClick={() => handleStartCreate(null, true)}
              className="w-7 h-7 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-800/40 flex items-center justify-center text-text-sub hover:text-brand-primary transition-colors cursor-pointer text-xs"
              title="Thêm thư mục gốc"
            >
              <i className="fa-solid fa-folder-plus" />
            </button>
          </div>
        </div>

        {/* Folder/Files tree container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar relative">
          {dragOverId === "root" && (
            <div className="absolute inset-2 border border-dashed border-brand-primary/40 bg-brand-primary/5 rounded-xl pointer-events-none z-10 flex items-center justify-center">
              <span className="text-[9px] font-mono font-bold text-brand-primary uppercase tracking-wider">Thả để đưa ra gốc</span>
            </div>
          )}
          {creationTarget && creationTarget.parentId === null && (
            <form onSubmit={handleConfirmCreate} className="flex items-center gap-2 p-1.5 bg-brand-primary/5 rounded-lg border border-brand-primary/20 mb-2">
              <input
                type="text"
                autoFocus
                required
                placeholder={creationTarget.isFolder ? "Tên thư mục mới..." : "Tên ghi chú mới..."}
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-text-main outline-none placeholder-text-sub"
              />
              <button type="submit" className="text-emerald-500 hover:text-emerald-400 text-xs font-bold shrink-0 cursor-pointer">Lưu</button>
              <button
                type="button"
                onClick={() => setCreationTarget(null)}
                className="text-text-sub hover:text-text-main text-xs shrink-0 cursor-pointer"
              >
                Hủy
              </button>
            </form>
          )}

          {treeData.length === 0 ? (
            <div className="py-8 text-center text-[10px] text-text-sub font-mono">Trống. Tạo tập tin gốc để bắt đầu.</div>
          ) : (
            treeData.map((node) => renderNode(node, 0))
          )}
        </div>
      </div>

      {/* Floating folder creation modal input inside tree nodes */}
      {creationTarget && creationTarget.parentId !== null && (
        <div className="p-3 border-t border-border-custom bg-brand-dark/25">
          <form onSubmit={handleConfirmCreate} className="space-y-2">
            <span className="block text-[9px] font-mono text-text-sub uppercase">Tạo mới trong thư mục</span>
            <div className="flex gap-2">
              <input
                type="text"
                autoFocus
                required
                placeholder={creationTarget.isFolder ? "Tên thư mục..." : "Tên ghi chú..."}
                value={newNodeName}
                onChange={(e) => setNewNodeName(e.target.value)}
                className="flex-1 rounded-lg border border-border-custom bg-brand-dark px-2 py-1 text-xs text-text-main placeholder-text-sub outline-none focus:border-brand-primary"
              />
              <button type="submit" className="px-2 py-1 bg-brand-primary rounded-lg text-[10px] font-mono font-bold text-white hover:opacity-90 cursor-pointer shrink-0">Lưu</button>
              <button
                type="button"
                onClick={() => setCreationTarget(null)}
                className="px-2 py-1 border border-border-custom rounded-lg text-[10px] font-mono font-bold text-text-sub hover:text-text-main cursor-pointer shrink-0"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Modal: Xác nhận xóa node */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-custom bg-brand-card shadow-2xl overflow-hidden flex flex-col p-6 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                <i className="fa-solid fa-triangle-exclamation text-xl" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-main font-mono uppercase">Xác nhận xóa</h3>
              <p className="text-[11px] text-text-sub font-light mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa {deleteConfirmation.isFolder ? "thư mục" : "ghi chú"} <strong className="text-text-main font-semibold">&ldquo;{deleteConfirmation.name}&rdquo;</strong>? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border border-border-custom rounded-lg text-xs font-mono font-bold text-text-sub hover:text-text-main cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (deleteConfirmation) {
                    await onDeleteNode(deleteConfirmation.nodeId, deleteConfirmation.noteId);
                    setDeleteConfirmation(null);
                  }
                }}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-xs font-mono font-bold text-white transition-colors cursor-pointer"
              >
                Xóa bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
