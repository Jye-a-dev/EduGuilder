"use client";

import RegisterForm from "@/components/pages/Auth/RegisterForm";
import RegisterVisualPanel from "@/components/pages/Auth/RegisterVisualPanel";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--bg-dark)" }}>
      <RegisterForm />
      <RegisterVisualPanel />
    </div>
  );
}
