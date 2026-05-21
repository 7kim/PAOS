"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { SRSPhaseTracker } from "@/components/project/SRSPhaseTracker";
import { StreamConsole } from "@/components/pipeline/StreamConsole";
import { Button } from "@/components/ui/Button";

export default function ProjectDashboardPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [pipelineId] = useState(projectId);
  const [pipelineComplete, setPipelineComplete] = useState(false);
  const [currentPhaseId, setCurrentPhaseId] = useState(1);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-brand-periwinkle mb-2">
          Project
        </p>
        <h1 className="font-sans text-[28px] font-medium leading-[32.2px] tracking-[-0.42px] text-on-dark">
          {projectId}
        </h1>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        {/* SRS Phase Tracker (sidebar) */}
        <div>
          <SRSPhaseTracker currentPhaseId={currentPhaseId} />
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-6">
          {/* Pipeline Status Console */}
          {!pipelineComplete && (
            <StreamConsole
              pipelineId={pipelineId}
              onComplete={() => setPipelineComplete(true)}
            />
          )}

          {pipelineComplete && (
            <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-6 text-center">
              <p className="font-sans text-[22px] font-medium text-on-dark mb-2">
                SRS Generation Complete
              </p>
              <p className="font-sans text-[16px] text-on-dark/60 mb-6">
                Your System Requirements Specification has been generated.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button
                  variant="gradient"
                  onClick={() =>
                    (window.location.href = `/app/${projectId}/files`)
                  }
                >
                  View Files
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setPipelineComplete(false)}
                >
                  Re-run Pipeline
                </Button>
              </div>
            </div>
          )}

          {/* Project status cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.05px] text-body mb-1">
                Status
              </p>
              <p className="font-sans text-[16px] text-on-dark font-medium">
                {pipelineComplete ? "Ready" : "Generating"}
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.05px] text-body mb-1">
                SRS Progress
              </p>
              <p className="font-sans text-[16px] text-on-dark font-medium">
                {currentPhaseId}/14
              </p>
            </div>
            <div className="bg-neutral-900 border border-neutral-700 rounded-[4px] p-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.05px] text-body mb-1">
                Model
              </p>
              <p className="font-sans text-[16px] text-on-dark font-medium">
                Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
