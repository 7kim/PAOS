import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

import { MEMORY_DIR } from "@/lib/global-config";

export async function POST(request: Request) {
  try {
    const { to, from, subject, body } = await request.json();
    if (!to || !body) {
      return NextResponse.json({ error: "Missing required fields: to, body" }, { status: 400 });
    }

    const inboxDir = join(MEMORY_DIR, "inbox", to);
    await mkdir(inboxDir, { recursive: true });

    const timestamp = new Date().toISOString();
    const filename = `${Date.now()}-${from ?? "dashboard"}.md`;
    const content = `# ${subject ?? "Message from Dashboard"}

**From**: ${from ?? "dashboard"}
**Timestamp**: ${timestamp}

${body}
`;

    await writeFile(join(inboxDir, filename), content, "utf-8");

    // Also append to ledger
    const ledgerPath = join(MEMORY_DIR, "global_ledger.md");
    const ledgerLine = `| ${timestamp} | ${from ?? "dashboard"} | SEND | memory/inbox/${to}/${filename} | ${subject ?? "Message"} | - | - |\n`;
    const { appendFile } = await import("fs/promises");
    await appendFile(ledgerPath, ledgerLine, "utf-8");

    return NextResponse.json({ ok: true, path: join("memory/inbox", to, filename) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
