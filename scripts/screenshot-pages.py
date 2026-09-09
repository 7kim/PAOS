#!/usr/bin/env python3
"""Capture screenshots of key PAOS dashboard pages using Playwright."""
import asyncio
import sys
from playwright.async_api import async_playwright

BASE_URL = "http://localhost:3333"

PAGES = [
    ("audit-ledger", "/ledger"),
    ("pipelines", "/pipelines"),
    ("git-view", "/gitview"),
    ("handoff", "/handoff"),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1920, "height": 1080})

        for name, path in PAGES:
            url = f"{BASE_URL}{path}"
            try:
                page = await context.new_page()
                await page.goto(url, wait_until="networkidle", timeout=15000)
                await asyncio.sleep(1)  # let client-side render finish

                output_path = f"/home/dev/AI_Workflow/screenshots/{name}.png"
                await page.screenshot(path=output_path, full_page=True)
                print(f"✓ Captured {output_path}")
                await page.close()
            except Exception as e:
                print(f"✗ Failed {name}: {e}", file=sys.stderr)

        await browser.close()

asyncio.run(main())
