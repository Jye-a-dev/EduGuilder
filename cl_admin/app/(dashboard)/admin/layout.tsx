import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";

import "../../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["vietnamese"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "EduPath Admin - Command Dashboard",
  description: "Bảng điều khiển trung tâm quản trị hệ thống EduPath.",
};

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
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
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans antialiased bg-cyber-bg text-gray-100 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}

