import { Link } from "react-router";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle.jsx";

const sectionLinks = [
  { label: "About", href: "/#about" },
  { label: "Problem", href: "/#problem" },
  { label: "Solution", href: "/#solution" },
  { label: "Features", href: "/#features" },
];

const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card bg-card/80 text-foreground shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/images/zolar-logo.png" alt="Zolar" className="h-14 w-auto" />
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground lg:flex">
          {sectionLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-foreground">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <SignedIn>
            <Button asChild variant="ghost" className="font-semibold">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button asChild variant="ghost" className="font-semibold">
              <Link to="/sign-in">Sign In</Link>
            </Button>
            <Button asChild className="rounded-full font-semibold">
              <Link to="/sign-up" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </SignedOut>
        </div>

        <div className="inline-flex items-center gap-2 md:hidden">
          <ThemeToggle className="size-10" />
          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-card text-foreground shadow-sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-card px-6 py-8">
              <SheetHeader>
                <SheetTitle className="text-left text-2xl font-bold">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4 text-lg font-semibold text-foreground">
                {sectionLinks.map((link) => (
                  <a key={link.label} href={link.href} className="rounded-2xl px-3 py-2 transition hover:bg-accent/40">
                    {link.label}
                  </a>
                ))}
              </div>
              <Separator className="my-6" />
              <div className="flex flex-col gap-3">
                <SignedIn>
                  <Button asChild variant="secondary" className="font-semibold">
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 px-3 py-2">
                    <span className="text-sm font-semibold text-muted-foreground">Account</span>
                    <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} afterSignOutUrl="/" />
                  </div>
                </SignedIn>
                <SignedOut>
                  <Button asChild variant="ghost" className="font-semibold">
                    <Link to="/sign-in">Sign In</Link>
                  </Button>
                  <Button asChild className="font-semibold">
                    <Link to="/sign-up">Get Started</Link>
                  </Button>
                </SignedOut>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
