"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas-dark text-on-dark">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-mono text-[16px] font-medium tracking-[0.08px] uppercase text-on-dark">
            Code-SRS
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[16px] text-on-dark/80 hover:text-on-dark transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link href="/auth/login">
            <Button variant="primary" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="gradient" size="sm">
              Get started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
