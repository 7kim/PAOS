import { NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { MEMORY_DIR } from "@/lib/global-config";

const METRICS_PATH = join(MEMORY_DIR, "metrics", "token-usage.json");

// Model pricing per 1M tokens (approximate USD)
const MODEL_PRICES: Record<string, { input: number; output: number }> = {
  "deepseek-v4-flash": { input: 0.15, output: 0.60 },
  "claude-sonnet-4": { input: 3.00, output: 15.00 },
  "claude-haiku-3.5": { input: 0.80, output: 4.00 },
  "gpt-4o": { input: 2.50, output: 10.00 },
  "gpt-4o-mini": { input: 0.15, output: 0.60 },
  "gpt-5": { input: 5.00, output: 20.00 },
  "gemini-2.5-pro": { input: 1.25, output: 5.00 },
  "llama-3-70b": { input: 0.50, output: 0.80 },
  "hermes-3": { input: 0.20, output: 0.40 },
};

interface TokenRecord {
  date: string;
  model: string;
  agent: string;
  inputTokens: number;
  outputTokens: number;
  contextTokens: number;
  task: string;
  pipelineId: string;
}

// GET /api/tokens — return aggregated token usage
export async function GET(req: Request) {
  const url = new URL(req.url);
  const compareModel = url.searchParams.get("compareModel") || "claude-sonnet-4";

  let records: TokenRecord[] = [];
  try {
    const raw = await readFile(METRICS_PATH, "utf-8");
    records = JSON.parse(raw);
  } catch { /* empty */ }

  // Aggregations
  const totalInput = records.reduce((s, r) => s + r.inputTokens, 0);
  const totalOutput = records.reduce((s, r) => s + r.outputTokens, 0);
  const totalContext = records.reduce((s, r) => s + r.contextTokens, 0);
  const totalTokens = totalInput + totalOutput;

  // Actual cost (if applicable)
  let actualCost = 0;
  let actualCostBreakdown: Record<string, { input: number; output: number; cost: number }> = {};
  for (const r of records) {
    const prices = MODEL_PRICES[r.model];
    if (prices) {
      const cost = (r.inputTokens / 1_000_000) * prices.input + (r.outputTokens / 1_000_000) * prices.output;
      actualCost += cost;
      if (!actualCostBreakdown[r.model]) actualCostBreakdown[r.model] = { input: 0, output: 0, cost: 0 };
      actualCostBreakdown[r.model].input += r.inputTokens;
      actualCostBreakdown[r.model].output += r.outputTokens;
      actualCostBreakdown[r.model].cost += cost;
    }
  }

  // Comparable model cost (show what it would cost with the selected model)
  const comparePrices = MODEL_PRICES[compareModel] || MODEL_PRICES["claude-sonnet-4"];
  const compareCost = (totalInput / 1_000_000) * comparePrices.input + (totalOutput / 1_000_000) * comparePrices.output;

  // Per-day breakdown
  const daily: Record<string, { input: number; output: number; cost: number; count: number }> = {};
  for (const r of records) {
    const day = r.date.split("T")[0];
    if (!daily[day]) daily[day] = { input: 0, output: 0, cost: 0, count: 0 };
    daily[day].input += r.inputTokens;
    daily[day].output += r.outputTokens;
    daily[day].count++;
    const prices = MODEL_PRICES[r.model];
    if (prices) {
      daily[day].cost += (r.inputTokens / 1_000_000) * prices.input + (r.outputTokens / 1_000_000) * prices.output;
    }
  }

  // Per-agent breakdown
  const byAgent: Record<string, { input: number; output: number; cost: number; calls: number }> = {};
  for (const r of records) {
    if (!byAgent[r.agent]) byAgent[r.agent] = { input: 0, output: 0, cost: 0, calls: 0 };
    byAgent[r.agent].input += r.inputTokens;
    byAgent[r.agent].output += r.outputTokens;
    byAgent[r.agent].calls++;
    const prices = MODEL_PRICES[r.model];
    if (prices) {
      byAgent[r.agent].cost += (r.inputTokens / 1_000_000) * prices.input + (r.outputTokens / 1_000_000) * prices.output;
    }
  }

  return NextResponse.json({
    totalTokens,
    totalInput,
    totalOutput,
    totalContext,
    totalCalls: records.length,
    actualCost,
    actualCostBreakdown,
    compareCost,
    compareModel,
    availableModels: Object.keys(MODEL_PRICES),
    daily: Object.entries(daily)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({ date, ...data })),
    byAgent,
  });
}

// POST /api/tokens — log a new token usage record
export async function POST(req: Request) {
  const body = await req.json();
  const { model, agent, inputTokens, outputTokens, contextTokens, task, pipelineId } = body;

  if (!model || !agent) {
    return NextResponse.json({ error: "model and agent are required" }, { status: 400 });
  }

  let records: TokenRecord[] = [];
  try {
    const raw = await readFile(METRICS_PATH, "utf-8");
    records = JSON.parse(raw);
  } catch { /* empty */ }

  records.push({
    date: new Date().toISOString(),
    model,
    agent,
    inputTokens: inputTokens || 0,
    outputTokens: outputTokens || 0,
    contextTokens: contextTokens || 0,
    task: task || "",
    pipelineId: pipelineId || "",
  });

  await writeFile(METRICS_PATH, JSON.stringify(records, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
