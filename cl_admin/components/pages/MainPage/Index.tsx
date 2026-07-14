import AdminInfoSection from "./AdminInfoSection";
import AdminLoginForm from "./AdminLoginForm";

export default function MainPage() {
  return (
    <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-12 px-4 py-12 sm:px-6 lg:flex-row lg:py-20 lg:px-8">
      {/* Background radial-gradient light spots */}
      <div className="pointer-events-none absolute top-0 left-1/4 -z-10 h-125 w-125 rounded-full bg-cyber-primary/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 -z-10 h-125 w-125 rounded-full bg-cyber-cyan/10 blur-[130px]" />

      <AdminInfoSection />
      <AdminLoginForm />
    </section>
  );
}
