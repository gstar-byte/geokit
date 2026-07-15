import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const score = Math.min(100, Math.max(0, Number(searchParams.get("score")) || 0));
  const style = searchParams.get("style") || "gradient";

  const scoreColor = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const scoreLabel = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";

  const bg =
    style === "light" ? "#f8fafc" :
    style === "dark" ? "#0f172a" :
    "#0f172a";

  const textColor = style === "light" ? "#1e293b" : "#e2e8f0";
  const subText = style === "light" ? "#475569" : "#94a3b8";

  const svg = `<svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${style === "light" ? "#f8fafc" : "#1e293b"}" />
      <stop offset="100%" style="stop-color:${style === "light" ? "#e2e8f0" : "#0f172a"}" />
    </linearGradient>
  </defs>
  <rect width="180" height="60" rx="12" fill="url(#bg)" stroke="${scoreColor}" stroke-width="2"/>
  <circle cx="30" cy="30" r="18" fill="${style === "light" ? "#e2e8f0" : "#1e293b"}" stroke="${scoreColor}" stroke-width="2"/>
  <text x="30" y="36" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" font-weight="bold" fill="${scoreColor}">${score}</text>
  <text x="58" y="26" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="${textColor}">AI Readiness</text>
  <text x="58" y="42" font-family="Arial,sans-serif" font-size="10" fill="${scoreColor}">${scoreLabel}</text>
  <text x="58" y="54" font-family="Arial,sans-serif" font-size="8" fill="${subText}">Verified by GEOKit</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
