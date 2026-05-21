"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Lightbulb } from "lucide-react";

interface ModelOption {
  alias: string;
  provider: string;
  tier: string;
  description: string;
}

export default function NewProjectPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("Nova");
  const [models, setModels] = useState<ModelOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/models")
      .then((r) => r.json())
      .then(setModels)
      .catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          model_alias: selectedModel,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to start pipeline");
      }

      const { projectId } = await res.json();
      router.push(`/app/${projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Eyebrow */}
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-brand-periwinkle mb-2">
        New Project
      </p>

      <h1 className="font-sans text-[40px] font-medium leading-[48px] tracking-[-0.8px] text-on-dark mb-2">
        Describe the app you want to build
      </h1>

      <p className="font-sans text-[16px] leading-[20.8px] text-on-dark/60 mb-8">
        Our PAOS pipeline will generate a complete System Requirements
        Specification, then help you build and deploy.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Textarea */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="prompt"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body"
          >
            App idea
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A mobile-first task management app with real-time collaboration, kanban boards, and team chat..."
            rows={6}
            maxLength={2000}
            className="w-full bg-neutral-800 text-on-dark border border-neutral-600 rounded-[4px] px-4 py-3 font-sans text-[16px] leading-[20.8px] placeholder:text-on-dark/30 focus:outline-none focus:ring-2 focus:ring-brand-periwinkle/40 focus:border-brand-periwinkle resize-none transition-all duration-200"
          />
          <p className="font-mono text-[10px] tracking-[0.05px] text-on-dark/40 self-end">
            {prompt.length}/2000
          </p>
        </div>

        {/* Model selector */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="model"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.55px] text-body"
          >
            AI Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-neutral-800 text-on-dark border border-neutral-600 rounded-[4px] px-4 py-2.5 font-sans text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-periwinkle/40"
          >
            {models.map((m) => (
              <option key={m.alias} value={m.alias}>
                {m.alias} — {m.description} ({m.tier})
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="text-[14px] text-red-400 font-sans">{error}</p>
        )}

        <Button
          type="submit"
          variant="gradient"
          size="lg"
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            "Generating SRS..."
          ) : (
            <>
              <Lightbulb className="w-5 h-5" />
              Generate SRS
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
