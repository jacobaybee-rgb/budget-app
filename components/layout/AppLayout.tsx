import AppSidebar from "@/components/layout/AppSidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Desktop sidebar */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-60 md:block">
        <AppSidebar />
      </div>

      {/* Mobile sidebar button and drawer */}
      <MobileNav />

      {/* Main page content */}
      <main className="min-h-screen md:ml-60">
        {children}
      </main>
    </div>
  );
}