import { NextResponse } from "next/server";
import { readFile, readdir, writeFile } from "fs/promises";
import { join } from "path";

const BENCHMARKS_DIR = process.env.BENCHMARKS_DIR || "/home/dev/AI_Workflow/benchmarks";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dir = join(BENCHMARKS_DIR, id);

  try {
    // Read full audit
    const audit = await readFile(join(dir, "full-audit.md"), "utf-8").catch(() => "");
    const readme = await readFile(join(dir, "README.md"), "utf-8").catch(() => "");
    const plan = await readFile(join(dir, "implementation-plan.md"), "utf-8").catch(() => "");
    const srsAsIs = await readFile(join(dir, "SRS-as-is.md"), "utf-8").catch(() => "");
    const srsToBe = await readFile(join(dir, "SRS-to-be.md"), "utf-8").catch(() => "");
    const gapsCombined = await readFile(join(dir, "gaps.md"), "utf-8").catch(() => "");
    const implementationDoc = await readFile(join(dir, "implementation.md"), "utf-8").catch(() => "");

    // Parse metadata from README
    const gradeMatch = readme.match(/\*\*Grade:\*\*\s*(\w)/);
    const scoreMatch = readme.match(/\((\d+)\/100\)/);
    const rawMatch = readme.match(/(\d+)\/22\d/);

    // Read gaps
    const gapsDir = join(dir, "gaps");
    const gapFiles = await readdir(gapsDir).catch(() => []);
    const gaps: any[] = [];

    for (const gf of gapFiles.sort()) {
      if (!gf.startsWith("gap-") || !gf.endsWith(".md") || gf === "index.md") continue;
      const content = await readFile(join(gapsDir, gf), "utf-8").catch(() => "");
      const numMatch = gf.match(/gap-(\d+)/);
      const titleMatch = content.match(/^# Gap \d+: (.+)$/m);
      const severityMatch = content.match(/\*\*Severity:\*\*\s*(\w+)/);
      const scoreMatchGap = content.match(/\*\*Score:\*\*\s*(\d+)\/2/);
      const sourceMatch = content.match(/\*\*Source:\*\*\s*(.+)/);
      const statusMatch = content.match(/## Status\n(.+)/);

      let status = "⏳ Pending";
      if (statusMatch) status = statusMatch[1].trim();
      // Parse emoji status
      if (status.startsWith("⏳")) status = "Pending";
      else if (status.startsWith("🔄")) status = "In Progress";
      else if (status.startsWith("✅")) status = "Fixed";
      else if (status.startsWith("🚫")) status = "Won't Fix";

      gaps.push({
        number: numMatch ? parseInt(numMatch[1]) : 0,
        title: titleMatch ? titleMatch[1].trim() : gf.replace(".md", ""),
        severity: severityMatch ? severityMatch[1] : "Medium",
        score: scoreMatchGap ? parseInt(scoreMatchGap[1]) : 0,
        source: sourceMatch ? sourceMatch[1].trim() : "",
        status,
        content,
        filename: gf,
      });
    }

    // Category breakdown from README
    const categories: any[] = [];
    const catRegex = /\| (\d+\. .+?) \| (\d+) \| (\d+) \| (\d+)%/g;
    let catMatch;
    while ((catMatch = catRegex.exec(readme)) !== null) {
      categories.push({
        name: catMatch[1].trim(),
        score: parseInt(catMatch[2]),
        max: parseInt(catMatch[3]),
        pct: parseInt(catMatch[4]),
      });
    }

    return NextResponse.json({
      id,
      grade: gradeMatch ? gradeMatch[1] : "?",
      score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
      raw: rawMatch ? parseInt(rawMatch[1]) : 0,
      max: 220,
      categories,
      gaps,
      hasPlan: !!plan,
      srsAsIs: srsAsIs.slice(0, 3000),
      srsToBe: srsToBe.slice(0, 3000),
      gapsCombined: gapsCombined.slice(0, 5000),
      implementationDoc: implementationDoc.slice(0, 5000),
      audit: audit.slice(0, 5000), // truncated for transfer
      plan,
      gapCount: gaps.length,
      gapsByStatus: {
        Pending: gaps.filter(g => g.status === "Pending").length,
        "In Progress": gaps.filter(g => g.status === "In Progress").length,
        Fixed: gaps.filter(g => g.status === "Fixed").length,
        "Won't Fix": gaps.filter(g => g.status === "Won't Fix").length,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: `Benchmark ${id} not found: ${e}` }, { status: 404 });
  }
}
