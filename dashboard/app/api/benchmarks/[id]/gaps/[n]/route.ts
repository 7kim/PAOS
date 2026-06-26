import { NextResponse } from "next/server";
import { readFile, writeFile, readdir } from "fs/promises";
import { join } from "path";

import { BENCHMARKS_DIR } from "@/lib/global-config";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; n: string }> }
) {
  const { id, n } = await params;
  const body = await req.json();
  const newStatus = body.status; // "Pending" | "In Progress" | "Fixed"

  if (!["Pending", "In Progress", "Fixed", "Won't Fix"].includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status. Use: Pending, In Progress, Fixed, Won't Fix" }, { status: 400 });
  }

  const gapsDir = join(BENCHMARKS_DIR, id, "gaps");
  const padN = String(parseInt(n)).padStart(2, "0");

  // Find the gap file
  const gapFiles = await readdir(gapsDir).catch(() => []);
  const gapFile = gapFiles.find(f => f.startsWith(`gap-${padN}-`) || f.startsWith(`gap-${parseInt(n)}-`));
  if (!gapFile) {
    return NextResponse.json({ error: `Gap ${n} not found in benchmark ${id}` }, { status: 404 });
  }

  const gapPath = join(gapsDir, gapFile);
  let content = await readFile(gapPath, "utf-8");

  // Update the status line
  const statusEmoji = newStatus === "Pending" ? "⏳ Pending"
    : newStatus === "In Progress" ? "🔄 In Progress"
    : newStatus === "Fixed" ? "✅ Fixed"
    : "🚫 Won't Fix";
  if (content.includes("## Status\n")) {
    content = content.replace(/## Status\n.*/, `## Status\n${statusEmoji}`);
  } else {
    content += `\n## Status\n${statusEmoji}\n`;
  }

  await writeFile(gapPath, content, "utf-8");

  // If marked Won't Fix, remove from gaps.md and implementation.md
  if (newStatus === "Won't Fix") {
    const benchDir = join(BENCHMARKS_DIR, id);
    const gapNum = parseInt(n);

    // Update gaps.md — remove this gap's entry
    const gapsMdPath = join(benchDir, "gaps.md");
    try {
      let gapsMd = await readFile(gapsMdPath, "utf-8");
      // Remove the gap's section: from its header to the next header or end
      const gapRegex = new RegExp(`### Gap ${gapNum} — .+\\n[\\s\\S]*?(?=\\n### |\\n---|\\n## |$)`, "");
      gapsMd = gapsMd.replace(gapRegex, "").replace(/\n{3,}/g, "\n\n");
      // Update the total count at the top
      const remainingCount = (gapsMd.match(/### Gap \d+/g) || []).length;
      gapsMd = gapsMd.replace(/\*\*Total:\*\* \d+ gaps/, `**Total:** ${remainingCount} gaps`);
      await writeFile(gapsMdPath, gapsMd, "utf-8");
    } catch { /* gaps.md may not exist */ }

    // Update implementation.md — remove this gap's section
    const implMdPath = join(benchDir, "implementation.md");
    try {
      let implMd = await readFile(implMdPath, "utf-8");
      // Remove the gap's section based on the header pattern: "### Gap {N} —"
      const implRegex = new RegExp(`### Gap ${gapNum} — .+\\n[\\s\\S]*?(?=\\n### |\\n## |\\n---|\\n\\n## )`, "");
      implMd = implMd.replace(implRegex, "").replace(/\n{3,}/g, "\n\n");
      await writeFile(implMdPath, implMd, "utf-8");
    } catch { /* implementation.md may not exist */ }
  }

  return NextResponse.json({ ok: true, gap: parseInt(n), status: newStatus });
}
