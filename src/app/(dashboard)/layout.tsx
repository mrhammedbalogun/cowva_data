import { Brand } from "@/components/layout/brand";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Topbar } from "@/components/layout/topbar";
import { FilterProvider } from "@/components/filters/filter-context";
import { FilterBar } from "@/components/filters/filter-bar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FilterProvider>
      <div className="flex min-h-screen w-full">
        <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar lg:flex print:hidden">
          <div className="flex h-14 items-center border-b px-4">
            <Brand subtitle="Vaccination impact" />
          </div>
          <div className="flex-1 overflow-y-auto">
            <SidebarNav />
          </div>
          <div className="border-t px-4 py-3 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Cowva
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />
          <main className="flex-1 space-y-4 p-4 sm:p-6 print:p-0">
            <FilterBar />
            {children}
          </main>
        </div>
      </div>
    </FilterProvider>
  );
}
