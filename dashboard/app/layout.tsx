import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import ThemeProvider from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PAOS — AI Workflow Hub",
  description: "Orchestration dashboard for Claude, OpenCode, Antigravity, and OpenClaw",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn("h-full", inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}>
      <body className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
        <ThemeProvider>
          <TooltipProvider>
            <Sidebar />
            <main className="flex-1 overflow-auto p-6">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
