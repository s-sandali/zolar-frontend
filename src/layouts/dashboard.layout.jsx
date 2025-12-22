import { Outlet } from "react-router";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle.jsx";
import { RetroGrid } from "@/components/theme/retro-grid.jsx";
import { UserButton } from "@clerk/clerk-react";

export default function DashboardLayout() {
  return (
    <SidebarProvider className="bg-background text-foreground">
      <AppSidebar />
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-b from-background via-background via-background/98 to-background">
        <RetroGrid className="opacity-20" />
        <div className="relative z-10 flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-background bg-background/80 px-4 py-4 backdrop-blur-lg sm:px-8">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="inline-flex" />
              <div>
                <p className="text-xs uppercase tracking-[0.65em] text-muted-foreground">Control</p>
                <p className="text-base font-semibold leading-tight">Zolar Command View</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle className="size-11" />
              <UserButton appearance={{ elements: { avatarBox: "h-10 w-10" } }} afterSignOutUrl="/" />
            </div>
          </header>
          <div className="relative flex-1 px-4 pb-12 pt-6 sm:px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
