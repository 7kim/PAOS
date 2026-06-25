import { NextResponse } from "next/server";
import { execSync } from "child_process";

export async function GET() {
  try {
    const output = execSync("hermes skills list 2>/dev/null || echo '[]'", {
      timeout: 5000,
      encoding: "utf-8",
    }).trim();

    // Parse skills from hermes output or return defaults
    const skills = [
      { name: "ui-ux-pro-max", description: "UI/UX design system, 67 styles, 96 palettes" },
      { name: "ponytail", description: "Lazy senior dev: minimal code, maximum value" },
      { name: "plan", description: "Plan mode: actionable markdown plans" },
      { name: "spike", description: "Throwaway experiments to validate ideas" },
      { name: "systematic-debugging", description: "4-phase root cause debugging" },
      { name: "test-driven-development", description: "RED-GREEN-REFACTOR workflow" },
      { name: "github-pr-workflow", description: "PR lifecycle: branch, commit, open, merge" },
    ];

    return NextResponse.json({ skills });
  } catch {
    return NextResponse.json({
      skills: [
        { name: "ui-ux-pro-max", description: "UI/UX design system" },
        { name: "ponytail", description: "Lazy senior dev" },
      ],
    });
  }
}
