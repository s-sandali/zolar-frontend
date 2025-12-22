import { Outlet } from "react-router";
import { RetroGrid } from "@/components/theme/retro-grid.jsx";

export const RootLayout = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <RetroGrid className="opacity-30" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
