import { AnimatePresence, motion } from "framer-motion";
import { Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

export const ThemeToggle = ({ className, size = "icon", onClick, ...props }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleClick = (event) => {
    toggleTheme();
    onClick?.(event);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-full border border-border/60 bg-card bg-card/80 text-foreground shadow-[0_10px_35px_rgba(15,23,42,0.15)] backdrop-blur transition hover:scale-[1.02] hover:border-primary/60 dark:border-border/30",
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 10, opacity: 0, rotate: -15 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10"
        >
          {isDark ? <Moon className="h-4 w-4" strokeWidth={1.6} /> : <SunMedium className="h-4 w-4" strokeWidth={1.6} />}
        </motion.span>
      </AnimatePresence>
      <motion.span
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: isDark ? 0.25 : 0.15 }}
        transition={{ duration: 0.35 }}
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-primary/20 via-accent/15 to-secondary/20"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
