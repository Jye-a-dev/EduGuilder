import type { Metadata } from "next";
import type { ReactNode } from "react";

import PublicSetup from "@/components/layouts/(public)/PublicSetup";
import { AuthProvider } from "@/components/providers/AuthProvider";

import "../globals.css";

export const metadata: Metadata = {
  title: "EduPath - Kỷ Nguyên Hướng Nghiệp Thông Minh",
  description: "Hệ sinh thái định hướng học tập và quản lý tri thức cá nhân kết hợp trò chơi hóa.",
};

type PublicLayoutProps = {
  children: ReactNode;
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen bg-brand-dark text-gray-150 font-sans antialiased overflow-x-hidden">
        <AuthProvider>
          <div className="mx-auto flex min-h-screen w-full max-w-350 flex-col border-x border-gray-950 bg-brand-dark">
            <PublicSetup>{children}</PublicSetup>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
