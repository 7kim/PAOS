import { NextResponse } from "next/server";
import { search } from "@/lib/search";
import { REPO_ROOT } from "@/lib/global-config";

/**
 * GET /api/search?q=<query>&topK=<number>
 *
 * Semantic search over PAOS knowledge documents using cosine similarity.
 * Indexes knowledge/docs/ and docs/ directories.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const topK = Math.min(50, Math.max(1, parseInt(searchParams.get("topK") || "10", 10) || 10));

  if (!q.trim()) {
    return NextResponse.json({ results: [], query: q });
  }

  try {
    const results = await search(q, REPO_ROOT, topK);
    return NextResponse.json({ results, query: q, count: results.length });
  } catch (e) {
    return NextResponse.json({ error: String(e), results: [] }, { status: 500 });
  }
}
