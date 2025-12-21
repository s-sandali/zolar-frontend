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

const sectionLinks = [
  { label: "About", href: "/#about" },
  { label: "Problem", href: "/#problem" },
  { label: "Solution", href: "/#solution" },
  { label: "Features", href: "/#features" },
];

const Navigation = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/30 bg-white/70 backdrop-blur-xl">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-1 py- font-[Inter] md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/images/zolar-logo.png" alt="Zolar" className="h-20 w-auto" />          
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-base font-semibold text-slate-600">
          {sectionLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition hover:text-slate-900">
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <SignedIn>
            <Button asChild variant="ghost">
              <Link to="/dashboard" className="text-slate-700 font-semibold">
                Dashboard
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Button asChild variant="ghost">
              <Link to="/sign-in" className="text-slate-700 font-semibold">
                Sign In
              </Link>
            </Button>
            <Button asChild className="rounded-full font-semibold">
              <Link to="/sign-up" className="flex items-center gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </SignedOut>
        </div>

        <div className="md:hidden inline-flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 shadow-sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white px-6 py-8">
              <SheetHeader>
                <SheetTitle className="text-left text-2xl font-bold text-slate-900">Menu</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4 text-lg font-semibold text-slate-800">
                {sectionLinks.map((link) => (
                  <a key={link.label} href={link.href} className="rounded-lg px-2 py-1 transition hover:bg-slate-100">
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
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                    <span className="text-sm font-semibold text-slate-600">Account</span>
                    <UserButton appearance={{ elements: { avatarBox: "h-6 w-6" } }} afterSignOutUrl="/" />
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
