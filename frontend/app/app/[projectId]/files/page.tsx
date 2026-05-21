"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FileTree, type FileNode } from "@/components/project/FileTree";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

// Mock data — will be connected to real pipeline output later
const MOCK_FILES: FileNode[] = [
  {
    name: "project",
    path: "/project",
    type: "directory",
    children: [
      {
        name: "docs",
        path: "/project/docs",
        type: "directory",
        children: [
          {
            name: "SRS.md",
            path: "/project/docs/SRS.md",
            type: "file",
          },
          {
            name: "IMPLEMENTATION_PLAN.md",
            path: "/project/docs/IMPLEMENTATION_PLAN.md",
            type: "file",
          },
          {
            name: "TASKS.md",
            path: "/project/docs/TASKS.md",
            type: "file",
          },
        ],
      },
      {
        name: "src",
        path: "/project/src",
        type: "directory",
        children: [
          {
            name: "app.ts",
            path: "/project/src/app.ts",
            type: "file",
          },
          {
            name: "components",
            path: "/project/src/components",
            type: "directory",
            children: [
              {
                name: "Header.tsx",
                path: "/project/src/components/Header.tsx",
                type: "file",
              },
            ],
          },
        ],
      },
      {
        name: "README.md",
        path: "/project/README.md",
        type: "file",
      },
      {
        name: "package.json",
        path: "/project/package.json",
        type: "file",
      },
    ],
  },
];

export default function ProjectFilesPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const [showSRS, setShowSRS] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <button
        onClick={() => router.push(`/app/${projectId}`)}
        className="flex items-center gap-2 text-on-dark/60 hover:text-on-dark transition-colors mb-6 font-sans text-[14px]"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to project
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-brand-periwinkle mb-1">
            Files
          </p>
          <h1 className="font-sans text-[28px] font-medium leading-[32.2px] tracking-[-0.42px] text-on-dark">
            Project Files
          </h1>
        </div>

        {/* SRS visibility toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <span className="font-mono text-[10px] uppercase tracking-[0.05px] text-body">
            Show SRS files
          </span>
          <div
            className={`w-10 h-5 rounded-full transition-colors ${
              showSRS ? "bg-brand-periwinkle" : "bg-neutral-600"
            } relative`}
            onClick={() => setShowSRS(!showSRS)}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                showSRS ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
        </label>
      </div>

      {/* File Tree */}
      <FileTree nodes={MOCK_FILES} showSRS={showSRS} />

      <p className="font-mono text-[10px] tracking-[0.05px] text-on-dark/40 mt-4">
        SRS system-analysis files are hidden by default. Toggle the switch to
        show them.
      </p>
    </div>
  );
}
