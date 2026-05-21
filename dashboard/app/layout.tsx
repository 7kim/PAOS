import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
    <html lang="en" className={`h-full ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
