import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthRedirectGuard from "@/components/providers/AuthRedirectGuard";

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
    <html lang="vi" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body
        className="min-h-screen font-sans antialiased overflow-x-hidden"
        style={{ backgroundColor: "var(--bg-dark)", color: "var(--text-main)" }}
      >
        <ThemeProvider>
          <AuthProvider>
            <AuthRedirectGuard>
              {children}
            </AuthRedirectGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
