"use client";

import { useAuthContext } from "@/components/providers/AuthProvider";
import NotesWorkspacePage from "@/components/pages/Notes/NotesWorkspacePage";
import { notFound } from "next/navigation";

export default function NotesWorkspaceRoute() {
  const { user } = useAuthContext();

  if (!user || user.role !== "student") {
    notFound();
  }

  return <NotesWorkspacePage />;
}
