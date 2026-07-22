"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export interface HTMLTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function HTMLTextEditor({ value, onChange, placeholder }: HTMLTextEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);

  // Synchronize internal HTML with outer state changes once on mount/edit load
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCmd = (command: string, arg = "") => {
    document.execCommand(command, false, arg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`rounded-xl border shadow-xs overflow-hidden flex flex-col font-sans ${
      theme === "dark" ? "border-zinc-800 bg-[#18181b]" : "border-gray-200 bg-white"
    }`}>
      {/* Editor Toolbar */}
      <div className={`flex flex-wrap items-center gap-1 border-b p-2 text-xs ${
        theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-200" : "bg-gray-50 border-gray-200 text-gray-700"
      }`}>
        <button
          type="button"
          onClick={() => execCmd("bold")}
          className={`w-7 h-7 flex items-center justify-center rounded font-bold transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="In đậm (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => execCmd("italic")}
          className={`w-7 h-7 flex items-center justify-center rounded italic transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="In nghiêng (Ctrl+I)"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => execCmd("underline")}
          className={`w-7 h-7 flex items-center justify-center rounded underline transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Gạch chân (Ctrl+U)"
        >
          U
        </button>
        <div className={`w-px h-5 mx-1 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
        <button
          type="button"
          onClick={() => execCmd("insertUnorderedList")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Danh sách dấu chấm"
        >
          <i className="fa-solid fa-list-ul" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("insertOrderedList")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Danh sách số"
        >
          <i className="fa-solid fa-list-ol" />
        </button>
        <div className={`w-px h-5 mx-1 ${theme === "dark" ? "bg-zinc-800" : "bg-gray-200"}`} />
        <button
          type="button"
          onClick={() => execCmd("justifyLeft")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Canh lề trái"
        >
          <i className="fa-solid fa-align-left" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("justifyCenter")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Canh lề giữa"
        >
          <i className="fa-solid fa-align-center" />
        </button>
        <button
          type="button"
          onClick={() => execCmd("justifyRight")}
          className={`w-7 h-7 flex items-center justify-center rounded transition-all cursor-pointer ${
            theme === "dark" ? "hover:bg-zinc-800 text-zinc-300" : "hover:bg-gray-200 text-gray-700"
          }`}
          title="Canh lề phải"
        >
          <i className="fa-solid fa-align-right" />
        </button>
      </div>

      {/* Editor Page Container styled like a premium Word Page */}
      <div className={`p-4 min-h-55 overflow-y-auto custom-scrollbar flex justify-center ${
        theme === "dark" ? "bg-zinc-950" : "bg-gray-100"
      }`}>
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
          data-placeholder={placeholder}
          className={`w-full max-w-[21cm] border shadow-xs p-6 outline-none min-h-45 text-xs leading-relaxed text-left ${
            theme === "dark"
              ? "bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700"
              : "bg-white border-gray-300 text-gray-900 focus:ring-brand-primary"
          }`}
          style={{
            fontFamily: "Times New Roman, Times, serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        />
      </div>
    </div>
  );
}
