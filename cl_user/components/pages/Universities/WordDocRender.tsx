"use client";

import { useMemo } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export interface WordDocRenderProps {
  htmlContent: string;
}

export function WordDocRender({ htmlContent }: WordDocRenderProps) {
  const { theme } = useTheme();

  // Convert standard newlines to paragraphs if it doesn't contain HTML markup
  const cleanHtml = useMemo(() => {
    if (!htmlContent.includes("<") && !htmlContent.includes(">")) {
      return htmlContent.split("\n").map((p) => `<p class="mb-2">${p}</p>`).join("");
    }
    return htmlContent;
  }, [htmlContent]);

  return (
    <div
      className={`border shadow-xs p-5 text-xs text-left overflow-x-auto max-h-75 ${
        theme === "dark" ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white border-gray-300 text-gray-900"
      }`}
      style={{
        fontFamily: "Times New Roman, Times, serif",
        lineHeight: "1.6",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    >
      <div
        className={`prose prose-sm max-w-none prose-headings:font-serif prose-p:my-1 prose-ul:list-disc prose-ol:list-decimal pl-4 ${
          theme === "dark" ? "prose-invert text-zinc-100" : "text-gray-900"
        }`}
        dangerouslySetInnerHTML={{ __html: cleanHtml }}
      />
    </div>
  );
}
