import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface UrlCheckResult {
  url: string;
  status: number | string;
  ok: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { sitemapUrl } = await req.json();

    if (!sitemapUrl || typeof sitemapUrl !== "string") {
      return NextResponse.json({ error: "Sitemap URL is required" }, { status: 400 });
    }

    let normalizedUrl = sitemapUrl.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    let urlObj: URL;
    try {
      urlObj = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid sitemap URL" }, { status: 400 });
    }

    // 1. Fetch sitemap XML
    let xmlText = "";
    let fetchStatus = 0;
    try {
      const res = await fetch(normalizedUrl, {
        signal: AbortSignal.timeout(8000),
        headers: { "User-Agent": "GEOKit/1.0 (Sitemap-Validator)" },
      });
      fetchStatus = res.status;
      if (!res.ok) {
        return NextResponse.json({
          error: `Could not fetch sitemap. HTTP status: ${res.status}`,
        }, { status: 400 });
      }
      xmlText = await res.text();
    } catch {
      return NextResponse.json({
        error: "Failed to connect to the sitemap URL. Make sure it is correct and accessible.",
      }, { status: 502 });
    }

    // 2. Parse sitemap XML structure
    const urls: string[] = [];
    const locRegex = /<loc>\s*(https?:\/\/[^\s<>]+)\s*<\/loc>/gi;
    let match;
    while ((match = locRegex.exec(xmlText)) !== null) {
      if (match[1]) {
        urls.push(match[1].trim());
      }
    }

    if (urls.length === 0) {
      return NextResponse.json({
        error: "No URLs found inside the sitemap. Make sure it is a valid XML sitemap.",
      }, { status: 400 });
    }

    // Validate schema format
    const isValidFormat = xmlText.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    const isSitemapIndex = xmlText.includes("<sitemapindex");

    // 3. Ping the first 20 URLs to check for broken links
    const urlsToPing = urls.slice(0, 20);
    const checkResults: UrlCheckResult[] = [];

    const pings = await Promise.allSettled(
      urlsToPing.map(async (url) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        try {
          const pingRes = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
            headers: { "User-Agent": "GEOKit/1.0 (Sitemap-Link-Checker)" },
          });
          return { url, status: pingRes.status, ok: pingRes.ok };
        } catch {
          // If HEAD fails, retry with GET
          try {
            const getRes = await fetch(url, {
              method: "GET",
              signal: controller.signal,
              headers: { "User-Agent": "GEOKit/1.0 (Sitemap-Link-Checker)" },
            });
            return { url, status: getRes.status, ok: getRes.ok };
          } catch {
            return { url, status: "Timeout / Blocked", ok: false };
          }
        } finally {
          clearTimeout(timeout);
        }
      })
    );

    for (const result of pings) {
      if (result.status === "fulfilled") {
        checkResults.push(result.value);
      }
    }

    return NextResponse.json({
      sitemapUrl: normalizedUrl,
      isValidFormat,
      isSitemapIndex,
      totalUrls: urls.length,
      urlsChecked: checkResults.length,
      results: checkResults,
      urls,
      xmlSizeKb: (xmlText.length / 1024).toFixed(1),
    });
  } catch (error) {
    console.error("Sitemap validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate sitemap." },
      { status: 500 }
    );
  }
}
