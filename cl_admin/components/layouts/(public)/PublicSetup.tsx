import type { ReactNode } from "react";

import PublicFooter from "@/components/layouts/(public)/Footer/PublicFooter";
import PublicNavbar from "@/components/layouts/(public)/Navbar/PublicNavbar";

type PublicSetupProps = {
  children: ReactNode;
};

export default function PublicSetup({ children }: PublicSetupProps) {
  return (
    <div className="flex min-h-screen flex-col bg-cyber-bg text-gray-100">
      <PublicNavbar />
      <main className="relative flex flex-1 flex-col justify-center">{children}</main>
      <PublicFooter />
    </div>
  );
}

