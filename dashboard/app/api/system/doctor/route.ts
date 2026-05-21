import { NextResponse } from "next/server";
import { systemDoctor } from "@/lib/paos";

export async function GET() {
  return NextResponse.json(await systemDoctor());
}
