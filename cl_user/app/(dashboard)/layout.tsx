import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/AuthProvider";
import DashboardSetup from "@/components/layouts/(dashboard)/DashboardSetup";

import "../globals.css";

export const metadata: Metadata = {
  title: "EduPath - Học sinh & Sinh viên Dashboard",
  description: "Cổng thông tin và lộ trình hướng nghiệp học sinh/sinh viên.",
};

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
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
      <body className="min-h-screen bg-brand-dark text-gray-100 font-sans antialiased overflow-x-hidden">
        <AuthProvider>
          <DashboardSetup>
            {children}
          </DashboardSetup>
        </AuthProvider>
      </body>
    </html>
  );
}
