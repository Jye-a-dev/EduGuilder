import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";

import "../globals.css";

export const metadata: Metadata = {
  title: "EduPath - Xác thực tài khoản",
  description: "Trang đăng nhập và đăng ký cổng thông tin học tập.",
};

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
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
      <body className="min-h-screen bg-brand-dark text-gray-100 font-sans antialiased overflow-x-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-200 bg-grid pointer-events-none z-0"></div>
        <div className="pointer-events-none absolute top-1/4 left-1/4 -z-10 h-100 w-100 rounded-full bg-brand-primary/10 blur-[120px] animate-pulse-slow" />
        <div className="pointer-events-none absolute bottom-1/4 right-1/4 -z-10 h-100 w-100 rounded-full bg-brand-secondary/10 blur-[120px] animate-pulse-slow" />
        
        <AuthProvider>
          <main className="w-full max-w-md relative z-10">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
