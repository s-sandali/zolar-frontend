import { memo } from "react";
import { cn } from "@/lib/utils";

// Lightweight retro grid inspired by the React Bits animation catalogue.
export const RetroGrid = memo(({ className }) => {
  return <div aria-hidden className={cn("react-bits-grid", className)} />;
});

RetroGrid.displayName = "RetroGrid";
