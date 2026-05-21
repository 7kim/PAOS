/**
 * Typed fetch wrappers for internal API routes.
 */

export interface PublicModel {
  alias: string;
  provider: string;
  tier: "free" | "pro";
  description: string;
}

export interface PipelineSubmission {
  prompt: string;
  model_alias: string;
  projectId?: string;
}

export interface PipelineResponse {
  projectId: string;
  pipelineId: string;
}

export interface StreamEvent {
  phase: string;
  message: string;
  timestamp: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3334";

/**
 * Fetch the list of available model aliases (no real model IDs).
 */
export async function fetchModels(): Promise<PublicModel[]> {
  const res = await fetch(`${BASE_URL}/api/models`);
  if (!res.ok) throw new Error(`Failed to fetch models: ${res.statusText}`);
  return res.json();
}

/**
 * Submit a new pipeline request (project idea).
 */
export async function submitPipeline(
  data: PipelineSubmission,
): Promise<PipelineResponse> {
  const res = await fetch(`${BASE_URL}/api/pipeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `Pipeline submission failed: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Subscribe to an SSE stream for pipeline progress.
 * Returns an EventSource for the caller to manage.
 */
export function subscribeToPipeline(
  pipelineId: string,
): EventSource {
  return new EventSource(`${BASE_URL}/api/stream/${pipelineId}`);
}
