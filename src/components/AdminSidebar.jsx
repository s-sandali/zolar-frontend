import { Settings, Zap } from "lucide-react";
import { Link, useLocation } from "react-router";
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
import { ThemeToggle } from "@/components/theme/theme-toggle.jsx";

// Menu items for admin navigation.
const items = [
  {
    title: "Solar Units",
    url: "/admin/solar-units",
    icon: <Zap className="w-8 h-8" size={32} />,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: <Settings className="w-8 h-8" size={32} />,
  },
];

const AdminSideBarTab = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link to={item.url}>
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AdminSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border/60 bg-sidebar bg-sidebar/95 pt-6 text-sidebar-foreground backdrop-blur-xl">
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-3xl font-bold text-sidebar-foreground">
            <Link to="/">Aelora</Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4">
              {items.map((item) => (
                <AdminSideBarTab key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter className="mt-auto px-4 pb-6">
          <div className="flex items-center justify-between rounded-2xl border border-sidebar-border/60 bg-sidebar-accent bg-sidebar-accent/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-sidebar-foreground/70">
            <span>Theme</span>
            <ThemeToggle className="size-10" />
          </div>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
