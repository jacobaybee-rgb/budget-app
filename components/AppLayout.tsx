import AppSidebar from "@/components/AppSidebar";
import MobileNav from "@/components/MobileNav";

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <main className="flex min-h-screen bg-zinc-950 text-white">
      <AppSidebar />

      <section className="flex-1 px-6 py-10 pb-24">
        {children}
      </section>

      <MobileNav />
    </main>
  );
}