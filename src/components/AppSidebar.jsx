import { ChartLine, LayoutDashboard, TriangleAlert, FileText } from "lucide-react";
import { Link } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { useGetPendingInvoiceCountQuery } from "@/lib/redux/query";
import { ThemeToggle } from "@/components/theme/theme-toggle.jsx";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboard className="w-8 h-8" size={32} />,
  },
  {
    title: "Anomalies",
    url: "/dashboard/anomalies",
    icon: <TriangleAlert className="w-8 h-8" size={32} />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <ChartLine className="w-8 h-8" size={32} />,
  },
  {
    title: "Invoices",
    url: "/dashboard/invoices",
    icon: <FileText className="w-8 h-8" size={32} />,
    showBadge: true,
  },
];

const SideBarTab = ({ item, pendingCount }) => {
  let location = useLocation();
  let isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="rounded-2xl border border-transparent px-3 py-3 text-base font-semibold transition hover:border-sidebar-border/70 hover:bg-sidebar-accent/50"
      >
        <Link
          to={item.url}
          className="relative inline-flex w-full items-center gap-3"
        >
          {item.icon}
          <span>{item.title}</span>
          {item.showBadge && pendingCount > 0 && (
            <span className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-warning text-[11px] font-bold text-warning-foreground">
              {pendingCount}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  const { data: pendingCountData } = useGetPendingInvoiceCountQuery();
  const pendingCount = pendingCountData?.count || 0;

  return (
    <Sidebar className="border-r border-sidebar-border/60 bg-sidebar bg-sidebar/95 pt-6 text-sidebar-foreground backdrop-blur-xl">
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 mt-2 flex items-center justify-center">
            <Link
              to="/"
              className="inline-flex items-center rounded-2xl border border-sidebar-border/50 bg-sidebar-accent bg-sidebar-accent/40 px-3 py-2"
              aria-label="Go to Zolar home"
            >
              <img
                src="/assets/images/zolar-logo.png"
                alt="Zolar Logo"
                className="h-24 w-auto max-w-[150px] object-contain drop-shadow-md"
              />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-6 text">
              {items.map((item) => (
                <SideBarTab key={item.url} item={item} pendingCount={pendingCount} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto px-4 pb-6">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-sidebar-border/60 bg-sidebar-accent bg-sidebar-accent/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-sidebar-foreground/70">
            <span>Theme</span>
            <ThemeToggle className="size-10" />
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
