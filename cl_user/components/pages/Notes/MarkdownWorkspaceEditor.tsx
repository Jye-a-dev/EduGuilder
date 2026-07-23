"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { NoteDetails, NoteTable, NoteSlide } from "./NotesWorkspacePage";
import { useAuthContext } from "@/components/providers/AuthProvider";
import { apiClient } from "@/libs/apiClient";

interface XLSXUtils {
  sheet_to_json: (worksheet: unknown, options: { header: number }) => unknown[][];
}
interface XLSXLibrary {
  read: (data: Uint8Array, options: { type: string }) => { SheetNames: string[]; Sheets: Record<string, unknown> };
  utils: XLSXUtils;
}
interface JSZipLibrary {
  loadAsync: (data: ArrayBuffer) => Promise<{ files: Record<string, { async: (type: "text") => Promise<string> }> }>;
}

interface DocumentExport {
  id: string;
  format: "pdf" | "word";
  storage_key: string;
  created_at: string;
}

interface MarkdownWorkspaceEditorProps {
  activeNote: NoteDetails;
  onUpdateNote: (id: string, updates: { title?: string; content?: string }) => Promise<void>;
  loading: boolean;
}

export default function MarkdownWorkspaceEditor({
  activeNote,
  onUpdateNote,
  loading,
}: MarkdownWorkspaceEditorProps) {
  const { token } = useAuthContext();
  const [title, setTitle] = useState(activeNote.title);
  const [content, setContent] = useState(activeNote.content);
  const [activeTab, setActiveTab] = useState<"editor" | "preview" | "tables" | "slides" | "export">("editor");

  // Local lists for tables/slides/exports
  const [tables, setTables] = useState<NoteTable[]>(activeNote.tables || []);
  const [slides, setSlides] = useState<NoteSlide[]>(activeNote.slides || []);
  const [exports, setExports] = useState<DocumentExport[]>([]);
  const [exportModal, setExportModal] = useState<{
    isOpen: boolean;
    format: "pdf" | "word" | null;
    status: "idle" | "loading" | "success" | "error";
    message?: string;
  }>({
    isOpen: false,
    format: null,
    status: "idle",
  });

  // States to add new slide or table
  const [addingTable, setAddingTable] = useState(false);
  const [newTableHeaders, setNewTableHeaders] = useState("Môn học, Điểm số, Đánh giá");
  const [newTableRows, setNewTableRows] = useState("Toán, 9.0, Xuất sắc\nVăn, 8.5, Giỏi");



  // Slide Carousel index
  const [slideCarouselIdx, setSlideCarouselIdx] = useState(0);

  const excelInputRef = useRef<HTMLInputElement>(null);
  const pptxInputRef = useRef<HTMLInputElement>(null);

  const [tableIdToDelete, setTableIdToDelete] = useState<string | null>(null);
  const [slideIdToDelete, setSlideIdToDelete] = useState<string | null>(null);

  // Load XLSX and JSZip CDNs dynamically
  useEffect(() => {
    const scripts = [
      { id: "xlsx-cdn", src: "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js" },
      { id: "jszip-cdn", src: "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" }
    ];

    scripts.forEach(s => {
      if (!document.getElementById(s.id)) {
        const script = document.createElement("script");
        script.id = s.id;
        script.src = s.src;
        script.async = true;
        document.body.appendChild(script);
      }
    });
  }, []);

  const getColType = (colIdx: number, dataRows: string[][]) => {
    let hasNumber = false;
    let hasDate = false;
    let hasBoolean = false;
    let total = 0;

    for (const row of dataRows) {
      const val = row[colIdx]?.trim();
      if (!val) continue;
      total++;

      if (val.toLowerCase() === "true" || val.toLowerCase() === "false" || val.toLowerCase() === "yes" || val.toLowerCase() === "no") {
        hasBoolean = true;
        continue;
      }

      if (!isNaN(Number(val))) {
        hasNumber = true;
        continue;
      }

      if (!isNaN(Date.parse(val)) && val.length > 5 && (val.includes("-") || val.includes("/"))) {
        hasDate = true;
        continue;
      }
    }

    if (total === 0) return "String";
    if (hasBoolean && !hasNumber && !hasDate) return "Boolean";
    if (hasNumber && !hasDate && !hasBoolean) return "Number";
    if (hasDate && !hasNumber && !hasBoolean) return "Date";
    return "String";
  };

  const parseHeader = (rawHeader: string) => {
    if (rawHeader && rawHeader.includes("||")) {
      const parts = rawHeader.split("||");
      return { sheetName: parts[0] || "Bảng", name: parts[1] || "", type: parts[2] || "String" };
    }
    return { sheetName: "Bảng", name: rawHeader || "", type: "String" };
  };

  const confirmDeleteTable = async () => {
    if (!tableIdToDelete || !token) return;
    try {
      await apiClient.delete(`/notes/${activeNote.id}/tables/${tableIdToDelete}`, { token });
      setTables(prev => prev.filter(t => t.id !== tableIdToDelete));
      setTableIdToDelete(null);
    } catch (err) {
      console.error("Lỗi khi xóa bảng:", err);
      alert("Không thể xóa bảng.");
    }
  };

  const confirmDeleteSlide = async () => {
    if (!slideIdToDelete || !token) return;
    try {
      await apiClient.delete(`/notes/${activeNote.id}/slides/${slideIdToDelete}`, { token });
      setSlides(prev => prev.filter(s => s.id !== slideIdToDelete));
      setSlideIdToDelete(null);
      setSlideCarouselIdx(0);
    } catch (err) {
      console.error("Lỗi khi xóa slide:", err);
      alert("Không thể xóa slide.");
    }
  };

  // Excel File Import Handler
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const XLSX = (window as unknown as { XLSX: XLSXLibrary }).XLSX;
        if (!XLSX) {
          alert("Thư viện Excel đang tải, vui lòng thử lại sau.");
          return;
        }
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        
        const newlyImported: NoteTable[] = [];

        for (let sIdx = 0; sIdx < workbook.SheetNames.length; sIdx++) {
          const sheetName = workbook.SheetNames[sIdx];
          const worksheet = workbook.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];
          if (rows.length === 0) continue;

          const dataRows = rows.slice(1).map(row => row.map(cell => String(cell ?? "")));
          const rawHeaders = (rows[0] || []).map(h => String(h || ""));

          const formattedHeaders = rawHeaders.map((h, cIdx) => {
            const colType = getColType(cIdx, dataRows);
            return `${sheetName}||${h || `Cột ${cIdx + 1}`}||${colType}`;
          });

          const newTable = await apiClient.post<NoteTable>(`/notes/${activeNote.id}/tables`, {
            table_index: tables.length + newlyImported.length,
            headers: formattedHeaders,
            rows: dataRows
          }, { token });

          newlyImported.push(newTable);
        }

        if (newlyImported.length === 0) {
          alert("Không tìm thấy dữ liệu nào để nhập.");
          return;
        }

        setTables(prev => [...prev, ...newlyImported]);
        alert(`Nhập thành công ${newlyImported.length} bảng từ các sheet Excel! 🎉`);
      } catch (err) {
        console.error("Lỗi import Excel:", err);
        alert("Lỗi khi đọc tệp Excel. Vui lòng kiểm tra lại định dạng.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // PPTX File Import Handler
  const handlePptxImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const JSZip = (window as unknown as { JSZip: JSZipLibrary }).JSZip;
        if (!JSZip) {
          alert("Thư viện PPTX đang tải, vui lòng thử lại sau.");
          return;
        }

        const zip = await JSZip.loadAsync(evt.target?.result as ArrayBuffer);
        const slideFiles = Object.keys(zip.files).filter(name => 
          name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
        );

        if (slideFiles.length === 0) {
          alert("Không tìm thấy slide nào trong tệp PPTX.");
          return;
        }

        slideFiles.sort((a, b) => {
          const numA = parseInt(a.replace(/[^0-9]/g, ""), 10);
          const numB = parseInt(b.replace(/[^0-9]/g, ""), 10);
          return numA - numB;
        });

        const parser = new DOMParser();
        const importedSlides: NoteSlide[] = [];

        for (let i = 0; i < slideFiles.length; i++) {
          const xmlText = await zip.files[slideFiles[i]].async("text");
          const xmlDoc = parser.parseFromString(xmlText, "text/xml");
          
          const textElements = xmlDoc.getElementsByTagName("a:t");
          const texts = Array.from(textElements).map(el => el.textContent || "").filter(Boolean);

          const title = texts[0] || `Slide ${i + 1}`;
          const bulletPoints = texts.slice(1).filter(t => t.trim().length > 1);

          const newSlide = await apiClient.post<NoteSlide>(`/notes/${activeNote.id}/slides`, {
            slide_index: slides.length + i,
            slide_type: "content",
            title,
            bullet_points: bulletPoints,
            background_color: "#0a0a0f"
          }, { token });

          importedSlides.push(newSlide);
        }

        setSlides(prev => [...prev, ...importedSlides]);
        setSlideCarouselIdx(0);
        alert(`Đã nhập thành công ${importedSlides.length} slide từ PPTX! 🎬`);
      } catch (err) {
        console.error("Lỗi import PPTX:", err);
        alert("Lỗi khi đọc tệp PPTX. Vui lòng kiểm tra lại định dạng.");
      }
    };
    reader.readAsArrayBuffer(file);
  };



  // Debounced auto-save effect
  useEffect(() => {
    if (content === activeNote.content && title === activeNote.title) return;

    const handler = setTimeout(() => {
      onUpdateNote(activeNote.id, { title, content });
    }, 800); // 800ms debounce auto-save

    return () => clearTimeout(handler);
  }, [content, title, activeNote.id, onUpdateNote, activeNote.content, activeNote.title]);

  // Fetch exports
  const fetchExports = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiClient.get<{ data: DocumentExport[] }>(`/document_exports?student_id=${activeNote.id}`, { token });
      setExports(res.data || []);
    } catch {
      // Fail silently
    }
  }, [token, activeNote.id]);

  useEffect(() => {
    if (activeTab === "export") {
      const handle = setTimeout(() => {
        fetchExports();
      }, 0);
      return () => clearTimeout(handle);
    }
  }, [activeTab, fetchExports]);

  // Simple Markdown parsing for preview
  const renderMarkdown = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, index) => {
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith("### ")) {
        return <h3 key={index} className="text-sm font-bold text-text-main mt-4 mb-2">{trimmed.slice(4)}</h3>;
      }
      if (trimmed.startsWith("## ")) {
        return <h2 key={index} className="text-base font-bold text-text-main mt-4 mb-2">{trimmed.slice(3)}</h2>;
      }
      if (trimmed.startsWith("# ")) {
        return <h1 key={index} className="text-lg font-black text-text-main mt-5 mb-3 border-b border-border-custom pb-1">{trimmed.slice(2)}</h1>;
      }

      // Unordered lists
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        return (
          <ul key={index} className="list-disc pl-5 text-xs text-text-sub font-light space-y-1">
            <li>{renderInlineElements(trimmed.slice(2))}</li>
          </ul>
        );
      }

      // Empty line
      if (!trimmed) {
        return <div key={index} className="h-2" />;
      }

      // Paragraph
      return <p key={index} className="text-xs text-text-sub leading-relaxed font-light mb-2">{renderInlineElements(line)}</p>;
    });
  };

  const renderInlineElements = (text: string) => {
    // Regex for wiki-links [[target]] and tags #tag
    const tokenRegex = /(\[\[.*?\]\]|#\w+)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, i) => {
      if (part.startsWith("[[") && part.endsWith("]]")) {
        const title = part.slice(2, -2).trim();
        return (
          <span
            key={i}
            className="text-brand-secondary font-semibold hover:underline cursor-pointer transition-all"
            onClick={() => {
              // Open this note or find it
            }}
          >
            {title}
          </span>
        );
      }
      if (part.startsWith("#")) {
        return (
          <span key={i} className="text-brand-primary font-bold font-mono">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Add table item
  const handleAddTable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      const headersArr = newTableHeaders.split(",").map(h => `Bảng||${h.trim()}||String`);
      const rowsArr = newTableRows.split("\n").map(row => row.split(",").map(cell => cell.trim()));
      
      const newTable = await apiClient.post<NoteTable>(`/notes/${activeNote.id}/tables`, {
        table_index: tables.length,
        headers: headersArr,
        rows: rowsArr
      }, { token });

      setTables(prev => [...prev, newTable]);
      setAddingTable(false);
    } catch (err) {
      console.error("Lỗi khi thêm bảng:", err);
    }
  };



  // Trigger export modal
  const triggerExportModal = (format: "pdf" | "word") => {
    setExportModal({
      isOpen: true,
      format,
      status: "idle",
    });
  };

  const confirmExport = async () => {
    const { format } = exportModal;
    if (!token || !format) return;
    setExportModal(prev => ({ ...prev, status: "loading" }));
    try {
      await apiClient.post("/document_exports", {
        student_id: activeNote.id,
        source_note_id: activeNote.id,
        format,
        storage_key: `exports/${activeNote.id}_${Date.now()}.${format === "pdf" ? "pdf" : "docx"}`,
      }, { token });
      await fetchExports();
      setExportModal(prev => ({ ...prev, status: "success" }));
    } catch (err) {
      console.error("Lỗi khi xuất bản tài liệu:", err);
      setExportModal(prev => ({ ...prev, status: "error", message: "Đã xảy ra lỗi khi tạo tệp xuất bản." }));
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-brand-dark/20 relative">
      {/* Pane tabs header */}
      <div className="flex items-center justify-between border-b border-border-custom bg-brand-sidebar/20 px-6 py-2">
        <div className="flex items-center gap-1">
          {([
            { id: "editor", label: "Soạn thảo", icon: "fa-solid fa-pen-to-square" },
            { id: "preview", label: "Xem trước", icon: "fa-regular fa-eye" },
            { id: "tables", label: `Bảng (${tables.length})`, icon: "fa-solid fa-table" },
            { id: "slides", label: `Slide (${slides.length})`, icon: "fa-solid fa-images" },
            { id: "export", label: "Xuất bản", icon: "fa-solid fa-file-export" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all duration-150 flex items-center gap-1.5 cursor-pointer
                ${activeTab === tab.id
                  ? "bg-brand-primary/10 border-brand-primary/20 text-brand-primary"
                  : "bg-transparent border-transparent text-text-sub hover:text-text-main hover:bg-gray-100/50 dark:hover:bg-gray-800/40"
                }
              `}
            >
              <i className={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {loading && (
          <span className="text-[9px] font-mono text-brand-primary animate-pulse">
            Đang tải dữ liệu...
          </span>
        )}
      </div>

      {/* Pane content container */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {activeTab === "editor" && (
          <div className="h-full flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Tên ghi chú..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-none text-base font-black text-text-main focus:outline-hidden placeholder-text-sub py-1 font-sans border-b border-border-custom/50"
            />
            <RichTextEditor
              value={content}
              onChange={(val) => setContent(val)}
              placeholder="Nhập nội dung ghi chú ở định dạng Word-like HTML... Sử dụng #tags và [[WikiLinks]] để kết nối thông tin."
            />
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-4 max-w-2xl mx-auto bg-brand-card/40 border border-border-custom/60 rounded-2xl p-6 shadow-xs">
            <h1 className="text-xl font-black text-text-main tracking-tight font-sans mb-1">{title}</h1>
            <div className="divide-y divide-border-custom/30 space-y-3">
              {isHTML(content) ? (
                <div 
                  className="text-xs text-text-sub leading-relaxed font-light font-sans space-y-2 rich-text-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                renderMarkdown(content)
              )}
            </div>
          </div>
        )}

        {activeTab === "tables" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between border-b border-border-custom pb-2">
              <h3 className="text-xs font-bold text-text-main uppercase font-mono tracking-wider">Note Tables (note_tables)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={excelInputRef}
                  onChange={handleExcelImport}
                  accept=".xlsx, .xls"
                  className="hidden"
                />
                <button
                  onClick={() => excelInputRef.current?.click()}
                  className="px-3 py-1.5 bg-brand-secondary/10 hover:bg-brand-secondary/20 border border-brand-secondary/20 hover:border-brand-secondary/45 rounded-lg text-[10px] font-mono font-bold text-brand-secondary transition-all cursor-pointer flex items-center gap-1"
                >
                  <i className="fa-solid fa-file-excel" /> Nhập Excel
                </button>
                <button
                  onClick={() => setAddingTable(true)}
                  className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 hover:border-brand-primary/45 rounded-lg text-[10px] font-mono font-bold text-brand-primary transition-all cursor-pointer"
                >
                  + Thêm bảng
                </button>
              </div>
            </div>

            {tables.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-sub">Không tìm thấy bảng nào được lưu trong ghi chú này.</div>
            ) : (
              <div className="space-y-6">
                {tables.map((t, idx) => {
                  const firstHeaderParsed = parseHeader(t.headers?.[0] || "");
                  const sheetName = firstHeaderParsed.sheetName;
                  return (
                    <div key={t.id || idx} className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-xs font-bold text-brand-secondary font-mono">Sheet: {sheetName}</span>
                        <button
                          onClick={() => setTableIdToDelete(t.id || null)}
                          className="p-1.5 text-text-sub hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer text-xs"
                          title="Xóa bảng này"
                        >
                          <i className="fa-regular fa-trash-can" />
                        </button>
                      </div>
                      <div className="w-full overflow-visible rounded-xl border border-border-custom bg-brand-card/30 p-2">
                        <table className="w-full text-left border-collapse table-auto whitespace-normal break-all">
                          <thead>
                            <tr className="border-b border-border-custom bg-brand-sidebar/40 font-mono text-[9px] font-bold uppercase tracking-wider text-text-sub">
                              {t.headers?.map((h: string, i: number) => {
                                const parsed = parseHeader(h);
                                return (
                                  <th key={i} className="p-3">
                                    <div className="flex flex-col gap-1">
                                      <span className="text-text-main">{parsed.name}</span>
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase w-fit ${
                                        parsed.type === "Number" ? "bg-blue-500/15 text-blue-400" :
                                        parsed.type === "Boolean" ? "bg-purple-500/15 text-purple-400" :
                                        parsed.type === "Date" ? "bg-emerald-500/15 text-emerald-400" :
                                        "bg-gray-500/15 text-text-sub"
                                      }`}>
                                        {parsed.type}
                                      </span>
                                    </div>
                                  </th>
                                );
                              })}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-custom/50 text-xs">
                            {t.rows?.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-gray-100/50 dark:hover:bg-gray-800/40 text-text-main font-light">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="p-3 whitespace-normal break-all">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "slides" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between border-b border-border-custom pb-2">
              <h3 className="text-xs font-bold text-text-main uppercase font-mono tracking-wider">Note Slides (note_slides)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={pptxInputRef}
                  onChange={handlePptxImport}
                  accept=".pptx"
                  className="hidden"
                />
                <button
                  onClick={() => pptxInputRef.current?.click()}
                  className="px-3 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 border border-brand-primary/20 hover:border-brand-primary/45 rounded-lg text-[10px] font-mono font-bold text-brand-primary transition-all cursor-pointer flex items-center gap-1"
                >
                  <i className="fa-solid fa-file-powerpoint" /> Nhập PPTX
                </button>
              </div>
            </div>

            {slides.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-sub">Không tìm thấy slide nào được thiết lập.</div>
            ) : (
              <div className="space-y-4">
                {/* Visual Slide Carousel */}
                <div
                  className="h-72 rounded-2xl border border-border-custom flex flex-col justify-between p-8 text-center transition-all duration-300 relative shadow-lg"
                  style={{ backgroundColor: slides[slideCarouselIdx]?.background_color || "#0a0a0f" }}
                >
                  <span className="absolute top-4 left-4 text-[9px] font-mono text-text-sub uppercase">SLIDE {slideCarouselIdx + 1} / {slides.length}</span>
                  <button
                    onClick={() => setSlideIdToDelete(slides[slideCarouselIdx]?.id || null)}
                    className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-xs"
                    title="Xóa slide này"
                  >
                    <i className="fa-regular fa-trash-can" />
                  </button>
                  <div className="my-auto space-y-4">
                    <h2 className="text-base font-extrabold text-white tracking-wide">{slides[slideCarouselIdx]?.title}</h2>
                    <div className="flex flex-col items-center gap-1.5">
                      {slides[slideCarouselIdx]?.bullet_points?.map((bullet: string, i: number) => (
                        <p key={i} className="text-xs text-gray-300 font-light">• {bullet}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center justify-between">
                  <button
                    disabled={slideCarouselIdx === 0}
                    onClick={() => setSlideCarouselIdx(prev => prev - 1)}
                    className="px-3 py-1 bg-brand-card hover:bg-gray-100/10 border border-border-custom rounded-lg text-[10px] font-mono font-bold text-text-main disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Trang trước
                  </button>
                  <span className="text-[10px] font-mono text-text-sub">{slideCarouselIdx + 1} of {slides.length}</span>
                  <button
                    disabled={slideCarouselIdx === slides.length - 1}
                    onClick={() => setSlideCarouselIdx(prev => prev + 1)}
                    className="px-3 py-1 bg-brand-card hover:bg-gray-100/10 border border-border-custom rounded-lg text-[10px] font-mono font-bold text-text-main disabled:opacity-40 transition-all cursor-pointer"
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "export" && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="border-b border-border-custom pb-2">
              <h3 className="text-xs font-bold text-text-main uppercase font-mono tracking-wider">Xuất Bản & Chia Sẻ Tài Liệu</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                disabled={exportModal.status === "loading"}
                onClick={() => triggerExportModal("pdf")}
                className="p-5 rounded-2xl border border-border-custom bg-brand-card hover:bg-brand-primary/5 hover:border-brand-primary/40 flex flex-col items-center gap-3 transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 transition-transform duration-300 group-hover:scale-105">
                  <i className="fa-solid fa-file-pdf text-xl" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-text-main">Xuất bản tệp PDF</span>
                  <span className="text-[10px] text-text-sub block mt-0.5 font-light">Tải ghi chú dạng PDF đóng gói</span>
                </div>
              </button>

              <button
                disabled={exportModal.status === "loading"}
                onClick={() => triggerExportModal("word")}
                className="p-5 rounded-2xl border border-border-custom bg-brand-card hover:bg-brand-secondary/5 hover:border-brand-secondary/40 flex flex-col items-center gap-3 transition-all cursor-pointer text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 transition-transform duration-300 group-hover:scale-105">
                  <i className="fa-solid fa-file-word text-xl" />
                </div>
                <div>
                  <span className="block text-xs font-bold text-text-main">Xuất bản tệp Word</span>
                  <span className="text-[10px] text-text-sub block mt-0.5 font-light">Tải ghi chú dạng tài liệu DOCX</span>
                </div>
              </button>
            </div>

            {/* List of Exports */}
            <div className="pt-4 space-y-3">
              <span className="block text-[10px] font-bold text-text-sub uppercase font-mono tracking-wider">Lịch sử xuất bản</span>
              <div className="divide-y divide-border-custom border border-border-custom rounded-xl bg-brand-card/20 overflow-hidden text-xs">
                {exports.length === 0 ? (
                  <div className="p-4 text-center text-text-sub">Không tìm thấy tệp đã xuất bản.</div>
                ) : (
                  exports.map((exp) => (
                    <div key={exp.id} className="p-3 flex items-center justify-between hover:bg-gray-100/5 dark:hover:bg-gray-800/20 transition-colors">
                      <div className="flex items-center gap-2">
                        <i className={`fa-solid text-sm ${exp.format === "pdf" ? "fa-file-pdf text-red-500" : "fa-file-word text-blue-500"}`} />
                        <div>
                          <span className="block text-xs font-bold text-text-main">{exp.storage_key.split("/").pop()}</span>
                          <span className="text-[9px] text-text-sub font-mono">{new Date(exp.created_at).toLocaleString("vi-VN")}</span>
                        </div>
                      </div>
                      <a
                        href={`http://localhost:3000/uploads/${exp.storage_key}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-mono font-bold text-brand-primary hover:underline cursor-pointer"
                      >
                        Tải xuống
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {/* Modal: Thêm bảng */}
      {addingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border-custom bg-brand-card shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-border-custom bg-brand-sidebar/20 flex justify-between items-center">
              <span className="text-xs font-bold text-text-main font-mono uppercase">Tạo bảng mới</span>
              <button
                type="button"
                onClick={() => setAddingTable(false)}
                className="text-text-sub hover:text-text-main transition-colors cursor-pointer text-xs"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
            <form onSubmit={handleAddTable} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-text-sub uppercase mb-1.5 font-bold">Cột tiêu đề (phân cách bằng dấu phẩy)</label>
                <input
                  type="text"
                  required
                  value={newTableHeaders}
                  onChange={(e) => setNewTableHeaders(e.target.value)}
                  className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main outline-hidden focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono text-text-sub uppercase mb-1.5 font-bold">Dòng dữ liệu (mỗi cột cách nhau bằng dấu phẩy, dòng mới cho hàng mới)</label>
                <textarea
                  required
                  value={newTableRows}
                  onChange={(e) => setNewTableRows(e.target.value)}
                  className="w-full rounded-lg border border-border-custom bg-brand-dark px-3 py-2 text-xs text-text-main outline-hidden focus:border-brand-primary h-24 resize-none font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddingTable(false)}
                  className="px-4 py-2 border border-border-custom rounded-lg text-xs font-mono font-bold text-text-sub hover:text-text-main cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-primary rounded-lg text-xs font-mono font-bold text-white hover:opacity-90 cursor-pointer"
                >
                  Tạo bảng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal: Xuất bản PDF / Word */}
      {exportModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-custom bg-brand-card shadow-2xl overflow-hidden flex flex-col p-6 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center">
              {exportModal.status === "loading" && (
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary animate-spin">
                  <i className="fa-solid fa-spinner text-xl" />
                </div>
              )}
              {exportModal.status === "success" && (
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <i className="fa-solid fa-circle-check text-xl" />
                </div>
              )}
              {exportModal.status === "error" && (
                <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                  <i className="fa-solid fa-circle-xmark text-xl" />
                </div>
              )}
              {exportModal.status === "idle" && (
                <div className="w-12 h-12 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <i className="fa-solid fa-file-export text-xl" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-main font-mono uppercase">
                {exportModal.status === "idle" && "Xác nhận xuất bản"}
                {exportModal.status === "loading" && "Đang xuất bản tài liệu"}
                {exportModal.status === "success" && "Xuất bản thành công"}
                {exportModal.status === "error" && "Lỗi xuất bản"}
              </h3>
              <p className="text-[11px] text-text-sub font-light mt-1.5 leading-relaxed">
                {exportModal.status === "idle" && `Bạn có chắc chắn muốn xuất bản ghi chú này dưới định dạng ${exportModal.format === "pdf" ? "PDF" : "Word (DOCX)"}?`}
                {exportModal.status === "loading" && "Hệ thống đang đóng gói và kết xuất định dạng phù hợp..."}
                {exportModal.status === "success" && "Tệp của bạn đã được lưu trữ thành công vào lịch sử xuất bản!"}
                {exportModal.status === "error" && (exportModal.message || "Đã xảy ra lỗi không xác định.")}
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              {exportModal.status === "idle" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setExportModal(prev => ({ ...prev, isOpen: false }))}
                    className="px-4 py-2 border border-border-custom rounded-lg text-xs font-mono font-bold text-text-sub hover:text-text-main cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={confirmExport}
                    className="px-4 py-2 bg-brand-primary rounded-lg text-xs font-mono font-bold text-white hover:opacity-90 cursor-pointer"
                  >
                    Bắt đầu
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={exportModal.status === "loading"}
                  onClick={() => setExportModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 bg-brand-card hover:bg-white/5 border border-border-custom rounded-lg text-xs font-mono font-bold text-text-main disabled:opacity-50 cursor-pointer"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xác nhận xóa bảng */}
      {tableIdToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-custom bg-brand-card shadow-2xl overflow-hidden flex flex-col p-6 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                <i className="fa-solid fa-triangle-exclamation text-xl" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-main font-mono uppercase">Xác nhận xóa bảng</h3>
              <p className="text-[11px] text-text-sub font-light mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa bảng dữ liệu này? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTableIdToDelete(null)}
                className="px-4 py-2 border border-border-custom rounded-lg text-xs font-mono font-bold text-text-sub hover:text-text-main cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDeleteTable}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-xs font-mono font-bold text-white transition-colors cursor-pointer"
              >
                Xóa bỏ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Xác nhận xóa slide */}
      {slideIdToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-custom bg-brand-card shadow-2xl overflow-hidden flex flex-col p-6 text-center space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400">
                <i className="fa-solid fa-triangle-exclamation text-xl" />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-text-main font-mono uppercase">Xác nhận xóa slide</h3>
              <p className="text-[11px] text-text-sub font-light mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa slide này? Hành động này không thể hoàn tác.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSlideIdToDelete(null)}
                className="px-4 py-2 border border-border-custom rounded-lg text-xs font-mono font-bold text-text-sub hover:text-text-main cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={confirmDeleteSlide}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-xs font-mono font-bold text-white transition-colors cursor-pointer"
              >
                Xóa bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
const isHTML = (str: string) => /<[a-z][\s\S]*>/i.test(str);

// Word-like HTML Rich Text Editor Component
interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Initialize and synchronize content
  useEffect(() => {
    if (editorRef.current) {
      if (isFirstRender.current || editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
        isFirstRender.current = false;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, val: string = "") => {
    document.execCommand(command, false, val);
    handleInput();
  };

  return (
    <div className="flex-1 flex flex-col border border-border-custom/50 rounded-2xl overflow-hidden bg-brand-card/20 backdrop-blur-xs min-h-75">
      <style>{`
        .rich-editor-body:empty::before {
          content: attr(data-placeholder);
          color: var(--text-sub, #9CA3AF);
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>
      {/* Rich Text Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-brand-sidebar/40 border-b border-border-custom/50">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="In đậm (Ctrl+B)"
        >
          <i className="fa-solid fa-bold" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="In nghiêng (Ctrl+I)"
        >
          <i className="fa-solid fa-italic" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Gạch chân (Ctrl+U)"
        >
          <i className="fa-solid fa-underline" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("strikeThrough")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Gạch ngang"
        >
          <i className="fa-solid fa-strikethrough" />
        </button>

        <div className="w-px h-4 bg-border-custom/50 mx-1" />

        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Căn trái"
        >
          <i className="fa-solid fa-align-left" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Căn giữa"
        >
          <i className="fa-solid fa-align-center" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Căn phải"
        >
          <i className="fa-solid fa-align-right" />
        </button>

        <div className="w-px h-4 bg-border-custom/50 mx-1" />

        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Danh sách dấu chấm"
        >
          <i className="fa-solid fa-list-ul" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Danh sách số"
        >
          <i className="fa-solid fa-list-ol" />
        </button>

        <div className="w-px h-4 bg-border-custom/50 mx-1" />

        <button
          type="button"
          onClick={() => {
            const url = prompt("Nhập đường dẫn liên kết:");
            if (url) execCommand("createLink", url);
          }}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Chèn liên kết"
        >
          <i className="fa-solid fa-link" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("removeFormat")}
          className="p-1.5 text-xs text-text-sub hover:text-text-main hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          title="Xóa định dạng"
        >
          <i className="fa-solid fa-eraser" />
        </button>
      </div>

      {/* Editor Body */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="rich-editor-body flex-1 w-full p-4 bg-transparent outline-hidden text-xs text-text-main leading-relaxed min-h-62.5 overflow-y-auto custom-scrollbar font-sans"
        data-placeholder={placeholder}
      />
    </div>
  );
}
