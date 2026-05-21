/**
 * Audit logging utility.
 * Logs pipeline actions to the PAOS global ledger.
 */

interface AuditEntry {
  action: string;
  task: string;
  agent: string;
  description: string;
}

async function readLedger(): Promise<string[]> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const ledgerPath =
      process.env.PAOS_VAULT_PATH
        ? path.join(process.env.PAOS_VAULT_PATH, "memory", "global_ledger.md")
        : "/home/dev/AI_Workflow/vault/memory/global_ledger.md";

    if (fs.existsSync(ledgerPath)) {
      return fs.readFileSync(ledgerPath, "utf-8").split("\n");
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Append an audit entry to the global ledger.
 */
export async function appendLedger(entry: AuditEntry): Promise<void> {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19);
  const row = `| ${timestamp} | ${entry.agent} | ${entry.action} | - | ${entry.description} | ${entry.task} | - |`;

  try {
    const fs = await import("fs");
    const path = await import("path");
    const ledgerPath =
      process.env.PAOS_VAULT_PATH
        ? path.join(process.env.PAOS_VAULT_PATH, "memory", "global_ledger.md")
        : "/home/dev/AI_Workflow/vault/memory/global_ledger.md";

    fs.appendFileSync(ledgerPath, row + "\n");
    console.log(`[AUDIT] ${row}`);
  } catch (err) {
    console.error("[AUDIT] Failed to write ledger:", err);
  }
}
