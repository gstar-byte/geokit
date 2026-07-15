import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "warn" | "info";
  message: string;
  points: number;
  maxPoints: number;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let normalizedUrl = url.trim();
    if (!normalizedUrl.startsWith("http")) {
      normalizedUrl = "https://" + normalizedUrl;
    }

    let urlObj: URL;
    try {
      urlObj = new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const results: CheckResult[] = [];
    const baseUrl = urlObj.origin;

    // 1. Check robots.txt
    try {
      const robotsRes = await fetch(`${baseUrl}/robots.txt`, {
        signal: AbortSignal.timeout(10000),
        redirect: "follow",
      });
      if (robotsRes.ok) {
        const robotsTxt = await robotsRes.text();
        const hasGptBot = /GPTBot/i.test(robotsTxt);
        const hasClaudeBot = /ClaudeBot/i.test(robotsTxt);
        const hasGoogleExtended = /Google-Extended/i.test(robotsTxt);

        if (hasGptBot || hasClaudeBot) {
          const blocked = robotsTxt.match(/(?:GPTBot|ClaudeBot)[\s\S]*?Disallow:\s*\//i);
          if (blocked) {
            results.push({
              name: "AI Crawler Access (robots.txt)",
              status: "warn",
              message: "AI crawlers (GPTBot/ClaudeBot) are blocked in robots.txt. This prevents AI search engines from accessing your site.",
              points: 5,
              maxPoints: 15,
            });
          } else {
            results.push({
              name: "AI Crawler Access (robots.txt)",
              status: "pass",
              message: "robots.txt exists and AI crawlers are allowed.",
              points: 15,
              maxPoints: 15,
            });
          }
        } else {
          results.push({
            name: "AI Crawler Access (robots.txt)",
            status: "pass",
            message: "robots.txt exists and no AI crawlers are explicitly blocked.",
            points: 15,
            maxPoints: 15,
          });
        }
      } else {
        results.push({
          name: "AI Crawler Access (robots.txt)",
          status: "fail",
          message: "robots.txt not found or inaccessible.",
          points: 0,
          maxPoints: 15,
        });
      }
    } catch {
      results.push({
        name: "AI Crawler Access (robots.txt)",
        status: "fail",
        message: "Could not fetch robots.txt. The site may be down or blocking requests.",
        points: 0,
        maxPoints: 15,
      });
    }

    // 2. Check llms.txt
    try {
      const llmsRes = await fetch(`${baseUrl}/llms.txt`, {
        signal: AbortSignal.timeout(10000),
        redirect: "follow",
      });
      if (llmsRes.ok) {
        const llmsContent = await llmsRes.text();
        const hasH1 = /^#\s+.+/m.test(llmsContent);
        if (hasH1) {
          results.push({
            name: "llms.txt File",
            status: "pass",
            message: "llms.txt exists with valid H1 title. AI models can read your site summary.",
            points: 20,
            maxPoints: 20,
          });
        } else {
          results.push({
            name: "llms.txt File",
            status: "warn",
            message: "llms.txt exists but missing H1 title. Consider adding a # heading.",
            points: 10,
            maxPoints: 20,
          });
        }
      } else {
        results.push({
          name: "llms.txt File",
          status: "info",
          message: "llms.txt not found. Adding one will help AI models understand your site better.",
          points: 0,
          maxPoints: 20,
        });
      }
    } catch {
      results.push({
        name: "llms.txt File",
        status: "info",
        message: "Could not check for llms.txt.",
        points: 0,
        maxPoints: 20,
      });
    }

    // 3. Check HTML structure and meta tags
    try {
      const pageRes = await fetch(normalizedUrl, {
        signal: AbortSignal.timeout(10000),
        redirect: "follow",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; GEOKit-Checker/1.0)" },
      });
      if (pageRes.ok) {
        const html = await pageRes.text();

        // Title tag
        const hasTitle = /<title[^>]*>[^<]+<\/title>/i.test(html);
        results.push({
          name: "Title Tag",
          status: hasTitle ? "pass" : "fail",
          message: hasTitle ? "Page has a title tag." : "Missing <title> tag.",
          points: hasTitle ? 10 : 0,
          maxPoints: 10,
        });

        // Meta description
        const hasMetaDesc = /<meta\s+name=["']description["']/i.test(html);
        results.push({
          name: "Meta Description",
          status: hasMetaDesc ? "pass" : "warn",
          message: hasMetaDesc ? "Meta description found." : "Missing meta description.",
          points: hasMetaDesc ? 10 : 0,
          maxPoints: 10,
        });

        // JSON-LD structured data
        const hasJsonLd = /application\/ld\+json/i.test(html);
        results.push({
          name: "Structured Data (JSON-LD)",
          status: hasJsonLd ? "pass" : "info",
          message: hasJsonLd ? "JSON-LD structured data found." : "No JSON-LD structured data found. Adding schema markup helps AI understand your content.",
          points: hasJsonLd ? 15 : 0,
          maxPoints: 15,
        });

        // Open Graph
        const hasOg = /<meta\s+property=["']og:/i.test(html);
        results.push({
          name: "Open Graph Tags",
          status: hasOg ? "pass" : "warn",
          message: hasOg ? "Open Graph tags found." : "Missing Open Graph tags.",
          points: hasOg ? 5 : 0,
          maxPoints: 5,
        });

        // Semantic HTML
        const hasSemantic = /<(article|main|section|nav|header|footer)/i.test(html);
        results.push({
          name: "Semantic HTML",
          status: hasSemantic ? "pass" : "warn",
          message: hasSemantic ? "Semantic HTML elements detected." : "No semantic HTML elements found. Use <article>, <main>, <section> for better AI comprehension.",
          points: hasSemantic ? 10 : 0,
          maxPoints: 10,
        });

        // Heading structure
        const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
        results.push({
          name: "Heading Structure",
          status: h1Count === 1 ? "pass" : h1Count === 0 ? "fail" : "warn",
          message: h1Count === 1 ? "Exactly one H1 tag found." : h1Count === 0 ? "No H1 tag found." : `${h1Count} H1 tags found. Use only one H1 per page.`,
          points: h1Count === 1 ? 5 : 0,
          maxPoints: 5,
        });

        // Sitemap reference
        const hasSitemapLink = /<link[^>]*rel=["']sitemap["']/i.test(html) || /sitemap/i.test(html);
        results.push({
          name: "Sitemap",
          status: hasSitemapLink ? "pass" : "info",
          message: hasSitemapLink ? "Sitemap reference found." : "No sitemap reference detected in HTML.",
          points: hasSitemapLink ? 5 : 0,
          maxPoints: 5,
        });

        // HTTPS
        const isHttps = urlObj.protocol === "https:";
        results.push({
          name: "HTTPS",
          status: isHttps ? "pass" : "fail",
          message: isHttps ? "Site is served over HTTPS." : "Site is not using HTTPS.",
          points: isHttps ? 5 : 0,
          maxPoints: 5,
        });
      } else {
        results.push({
          name: "Page Fetch",
          status: "fail",
          message: `Could not fetch page (HTTP ${pageRes.status}).`,
          points: 0,
          maxPoints: 60,
        });
      }
    } catch {
      results.push({
        name: "Page Fetch",
        status: "fail",
        message: "Could not fetch the page. The site may be down or blocking requests.",
        points: 0,
        maxPoints: 60,
      });
    }

    const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
    const maxTotal = results.reduce((sum, r) => sum + r.maxPoints, 0);
    const score = Math.round((totalPoints / maxTotal) * 100);

    return NextResponse.json({
      url: normalizedUrl,
      score,
      results,
      totalPoints,
      maxTotal,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
