import Navigation from "@/components/Navigation/Navigation";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <div className="relative isolate min-h-screen bg-gradient-to-b from-background via-background via-background/95 to-background">
      <Navigation />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
