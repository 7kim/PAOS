#!/usr/bin/env python3
"""Generate health-check.html from smoke test JSON results."""
import json
import sys
from datetime import datetime

RESULTS_FILE = "/tmp/paos-smoke-results.json"
OUTPUT_FILE = "/home/dev/AI_Workflow/memory/pipelines/PAOS/PIPE-25-06-2026---16-42/health-check.html"

try:
    with open(RESULTS_FILE) as f:
        data = json.load(f)
except FileNotFoundError:
    print(f"ERROR: {RESULTS_FILE} not found. Run test-all-endpoints.sh first.", file=sys.stderr)
    sys.exit(1)

# Extract summary (last entry with __summary__)
summary = {}
endpoints = []
for item in data:
    if "__summary__" in item:
        summary = item["__summary__"]
    else:
        endpoints.append(item)

pass_count = summary.get("pass", 0)
fail_count = summary.get("fail", 0)
total = summary.get("total", 0)
ts = summary.get("timestamp", datetime.utcnow().isoformat())
base_url = summary.get("base", "http://localhost:3333")

# Determine overall status
if fail_count == 0:
    overall_status = "✅ HEALTHY"
    status_color = "#16a34a"
    status_bg = "#f0fdf4"
else:
    overall_status = "❌ DEGRADED" if fail_count < total else "❌ DOWN"
    status_color = "#dc2626" if fail_count > 0 else "#eab308"
    status_bg = "#fef2f2" if fail_count > 0 else "#fefce8"

health_pct = round((pass_count / total * 100), 1) if total > 0 else 0

# Build table rows
rows = ""
for ep in endpoints:
    method = ep.get("method", "GET")
    path = ep.get("path", "/")
    status = ep.get("status", 0)
    expected = ep.get("expected", 200)
    passed = ep.get("pass", False)
    icon = "✅" if passed else "❌"
    bg = "#f0fdf4" if passed else "#fef2f2"
    color = "#16a34a" if passed else "#dc2626"
    rows += f"""\
    <tr style="background:{bg}">
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-size:14px">{icon}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#6366f1;font-size:14px">{method}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-size:14px">{path}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;font-size:14px">
        <span style="display:inline-block;padding:2px 10px;border-radius:9999px;font-weight:600;font-size:13px;background:{color}15;color:{color}">{status}</span>
      </td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:14px">{expected}</td>
    </tr>"""

html = f"""\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PAOS Dashboard — Health Check</title>
  <style>
    * {{ margin:0; padding:0; box-sizing:border-box; }}
    body {{ font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#f9fafb; color:#111827; padding:24px; }}
    .container {{ max-width:960px; margin:0 auto; }}
    .header {{ text-align:center; padding:32px 0 24px; }}
    .header h1 {{ font-size:28px; font-weight:700; margin-bottom:8px; }}
    .header p {{ color:#6b7280; font-size:15px; }}
    .status-card {{ background:{status_bg}; border:1px solid {status_color}40; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px; }}
    .status-card .status {{ font-size:32px; font-weight:700; color:{status_color}; margin-bottom:4px; }}
    .status-card .sub {{ font-size:14px; color:#6b7280; }}
    .stats {{ display:flex; gap:16px; justify-content:center; margin-bottom:24px; flex-wrap:wrap; }}
    .stat {{ background:white; border:1px solid #e5e7eb; border-radius:10px; padding:16px 24px; text-align:center; min-width:120px; }}
    .stat .num {{ font-size:28px; font-weight:700; color:#111827; }}
    .stat .label {{ font-size:13px; color:#6b7280; margin-top:2px; }}
    .stat .num.pass {{ color:#16a34a; }}
    .stat .num.fail {{ color:#dc2626; }}
    .stat .num.total {{ color:#6366f1; }}
    table {{ width:100%; border-collapse:collapse; background:white; border-radius:10px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.06); }}
    th {{ padding:10px 12px; text-align:left; font-size:13px; font-weight:600; color:#6b7280; text-transform:uppercase; letter-spacing:0.5px; background:#f9fafb; border-bottom:2px solid #e5e7eb; }}
    td {{ vertical-align:middle; }}
    .footer {{ text-align:center; padding:24px; color:#9ca3af; font-size:13px; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔬 PAOS Dashboard Health Check</h1>
      <p>Comprehensive API smoke test — {ts}</p>
    </div>

    <div class="status-card">
      <div class="status">{overall_status}</div>
      <div class="sub">{health_pct}% of {total} endpoints responding correctly</div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="num pass">{pass_count}</div>
        <div class="label">Passed</div>
      </div>
      <div class="stat">
        <div class="num fail">{fail_count}</div>
        <div class="label">Failed</div>
      </div>
      <div class="stat">
        <div class="num total">{total}</div>
        <div class="label">Total Tests</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:40px"></th>
          <th style="width:60px">Method</th>
          <th>Endpoint</th>
          <th style="width:80px;text-align:center">Status</th>
          <th style="width:80px;text-align:center">Expected</th>
        </tr>
      </thead>
      <tbody>
{rows}
      </tbody>
    </table>

    <div class="footer">
      PAOS Pipeline PIPE-25-06-2026---16-42 &middot; Dashboard: <a href="{base_url}" style="color:#6366f1">{base_url}</a>
    </div>
  </div>
</body>
</html>"""

with open(OUTPUT_FILE, "w") as f:
    f.write(html)

print(f"✅ health-check.html written to {OUTPUT_FILE}")
print(f"   {pass_count}/{total} passed, {fail_count} failed")
