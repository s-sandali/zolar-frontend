import { ChartLine, LayoutDashboard, TriangleAlert } from "lucide-react";
import { Link } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { cn } from "@/lib/utils";

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
];

const SideBarTab = ({ item }) => {
  let location = useLocation();
  let isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem key={item.url}>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          to={item.url}
        >
          {item.icon}
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export function AppSidebar() {
  return (
    <Sidebar className="pt-6">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 mt-2 flex items-center justify-center">
            <Link
              to="/"
              className="inline-flex items-center rounded-md px-2 py-1"
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
                <SideBarTab key={item.url} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
