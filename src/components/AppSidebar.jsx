import { ChartLine, LayoutDashboard, TriangleAlert, FileText } from "lucide-react";
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
import { useGetPendingInvoiceCountQuery } from "@/lib/redux/query";

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
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          to={item.url}
          className="relative"
        >
          {item.icon}
          <span>{item.title}</span>
          {item.showBadge && pendingCount > 0 && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
                <SideBarTab key={item.url} item={item} pendingCount={pendingCount} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
