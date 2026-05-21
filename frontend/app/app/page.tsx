"use client";

import { Plus, FolderOpen, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AppDashboardPage() {
  // Empty state — no projects yet for MVP
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-brand-periwinkle mb-1">
            Dashboard
          </p>
          <h1 className="font-sans text-[28px] font-medium leading-[32.2px] tracking-[-0.42px] text-on-dark">
            My Projects
          </h1>
        </div>
        <Link href="/app/new">
          <Button variant="gradient" size="md">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-16 text-center">
        <div className="w-16 h-16 rounded-[4px] bg-neutral-800 flex items-center justify-center mx-auto mb-6">
          <FolderOpen className="w-8 h-8 text-on-dark/40" />
        </div>
        <h2 className="font-sans text-[22px] font-medium leading-[25.3px] tracking-[-0.22px] text-on-dark mb-3">
          No projects yet
        </h2>
        <p className="font-sans text-[16px] leading-[20.8px] text-on-dark/60 mb-8 max-w-md mx-auto">
          Describe your first app idea and let the PAOS pipeline generate a
          complete System Requirements Specification for you.
        </p>
        <Link href="/app/new">
          <Button variant="gradient" size="lg">
            <Plus className="w-5 h-5" />
            Start your first project
          </Button>
        </Link>
      </div>

      {/* Quick stats (placeholder) */}
      <div className="grid sm:grid-cols-3 gap-4 mt-8">
        <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-4">
          <div className="w-8 h-8 rounded-[4px] bg-neutral-800 flex items-center justify-center mb-3">
            <FileText className="w-4 h-4 text-brand-periwinkle" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.05px] text-body mb-1">
            Total Projects
          </p>
          <p className="font-sans text-[28px] font-medium text-on-dark">0</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-4">
          <div className="w-8 h-8 rounded-[4px] bg-neutral-800 flex items-center justify-center mb-3">
            <ArrowRight className="w-4 h-4 text-brand-mint" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.05px] text-body mb-1">
            Active Pipelines
          </p>
          <p className="font-sans text-[28px] font-medium text-on-dark">0</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-4">
          <div className="w-8 h-8 rounded-[4px] bg-neutral-800 flex items-center justify-center mb-3">
            <FolderOpen className="w-4 h-4 text-brand-orange" />
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.05px] text-body mb-1">
            SRS Generated
          </p>
          <p className="font-sans text-[28px] font-medium text-on-dark">0</p>
        </div>
      </div>
    </div>
  );
}
