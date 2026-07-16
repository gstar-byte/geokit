import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const googleKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  const hasKey = !!openrouterKey || !!googleKey;
  const provider = openrouterKey ? "openrouter" : googleKey ? "google" : null;
  return NextResponse.json({ hasApiKey: hasKey, provider });
}
