import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface CrawlerResult {
  crawler: string;
  perspective: string;
  findings: string[];
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

    // Fetch the page as an AI crawler would
    let html = "";
    let fetchStatus = 0;
    let contentType = "";

    try {
      const res = await fetch(normalizedUrl, {
        signal: AbortSignal.timeout(15000),
        redirect: "follow",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; GPTBot/1.0; +https://openai.com/gptbot)",
          "Accept": "text/html,application/xhtml+xml",
        },
      });
      fetchStatus = res.status;
      contentType = res.headers.get("content-type") || "";
      html = await res.text();
    } catch {
      return NextResponse.json({
        error: "Could not fetch the page. The site may be down or blocking requests.",
      }, { status: 502 });
    }

    const results: CrawlerResult[] = [];

    // 1. GPTBot perspective
    const gptFindings: string[] = [];
    const gptTitle = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    gptFindings.push(gptTitle ? `Page title: "${gptTitle[1].trim()}"` : "No <title> tag found — AI models won't know what this page is about.");

    const gptMetaDesc = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i);
    gptFindings.push(gptMetaDesc ? `Meta description: "${gptMetaDesc[1].trim()}"` : "No meta description — AI models lack a summary of your page.");

    const gptH1 = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    gptFindings.push(gptH1 ? `H1 heading: "${gptH1[1].trim()}"` : "No H1 tag — AI models use headings to understand content structure.");

    const gptHeadings = (html.match(/<h[1-6][^>]*>[^<]+<\/h[1-6]>/gi) || []).length;
    gptFindings.push(`Found ${gptHeadings} heading tags (h1-h6). ${gptHeadings > 3 ? "Good structure." : "Consider adding more headings for better content structure."}`);

    const gptText = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const wordCount = gptText.split(/\s+/).length;
    gptFindings.push(`Extracted ~${wordCount} words of readable text. ${wordCount < 300 ? "Very thin content — AI models prefer substantial content." : wordCount < 800 ? "Moderate content length." : "Good content depth."}`);

    const gptJsonLd = /application\/ld\+json/i.test(html);
    gptFindings.push(gptJsonLd ? "JSON-LD structured data found — AI models can parse content type and metadata." : "No JSON-LD structured data — AI models miss context about your content type.");

    results.push({
      crawler: "GPTBot (OpenAI)",
      perspective: "How ChatGPT sees your page",
      findings: gptFindings,
    });

    // 2. ClaudeBot perspective
    const claudeFindings: string[] = [];
    const claudeSemantic = /<(article|main|section|nav|header|footer|aside)/i.test(html);
    claudeFindings.push(claudeSemantic ? "Semantic HTML elements detected — Claude can identify content regions accurately." : "No semantic HTML — Claude struggles to distinguish main content from navigation/boilerplate.");

    const claudeLinks = (html.match(/<a\s+href=/gi) || []).length;
    claudeFindings.push(`Found ${claudeLinks} links. ${claudeLinks > 10 ? "Good internal linking." : "Few links — Claude may not discover related pages."}`);

    const claudeLists = (html.match(/<(ul|ol)[^>]*>/gi) || []).length;
    claudeFindings.push(`Found ${claudeLists} lists — ${claudeLists > 0 ? "list content is easy for Claude to parse and cite." : "no lists detected. Lists improve AI extractability."}`);

    const claudeTables = (html.match(/<table[^>]*>/gi) || []).length;
    claudeFindings.push(`Found ${claudeTables} tables — ${claudeTables > 0 ? "structured data tables detected." : "no tables (fine for most content)."}`);

    const claudeCode = (html.match(/<(pre|code)[^>]*>/gi) || []).length;
    claudeFindings.push(`Found ${claudeCode} code blocks — ${claudeCode > 0 ? "technical content detected." : "no code blocks."}`);

    results.push({
      crawler: "ClaudeBot (Anthropic)",
      perspective: "How Claude sees your page",
      findings: claudeFindings,
    });

    // 3. PerplexityBot perspective
    const perplexityFindings: string[] = [];
    const perplexityOg = /<meta\s+property=["']og:/i.test(html);
    perplexityFindings.push(perplexityOg ? "Open Graph tags found — Perplexity can show rich previews when citing your content." : "No Open Graph tags — Perplexity citations will lack preview images/titles.");

    const perplexityTwitter = /<meta\s+name=["']twitter:/i.test(html);
    perplexityFindings.push(perplexityTwitter ? "Twitter Card tags found." : "No Twitter Card tags.");

    const perplexityCanonical = html.match(/<link[^>]*rel=["']canonical["']\s+href=["']([^"']+)["']/i);
    perplexityFindings.push(perplexityCanonical ? `Canonical URL: ${perplexityCanonical[1]}` : "No canonical URL — Perplexity may treat duplicate pages as separate.");

    const perplexityFaq = /FAQPage|application\/ld\+json/i.test(html);
    perplexityFindings.push(perplexityFaq ? "FAQ schema or structured data found — Perplexity prefers citing structured Q&A content." : "No FAQ schema — Perplexity favors pages with structured Q&A for answer citations.");

    const perplexityImg = (html.match(/<img\s+[^>]*alt=/gi) || []).length;
    const perplexityImgTotal = (html.match(/<img\s/gi) || []).length;
    perplexityFindings.push(`Images: ${perplexityImgTotal} total, ${perplexityImg} with alt text. ${perplexityImgTotal > 0 && perplexityImg < perplexityImgTotal ? "Some images missing alt text — AI can't describe them." : "All images have alt text."}`);

    results.push({
      crawler: "PerplexityBot",
      perspective: "How Perplexity sees your page",
      findings: perplexityFindings,
    });

    // 4. Technical summary
    const techFindings: string[] = [];
    techFindings.push(`HTTP status: ${fetchStatus} ${fetchStatus === 200 ? "✓" : "⚠"}`);
    techFindings.push(`Content-Type: ${contentType || "unknown"}`);
    techFindings.push(`HTML size: ${(html.length / 1024).toFixed(1)} KB`);
    techFindings.push(`HTTPS: ${urlObj.protocol === "https:" ? "✓ Secure" : "✗ Not secure"}`);
    const hasRobots = /<meta\s+name=["']robots["']/i.test(html);
    techFindings.push(`Robots meta: ${hasRobots ? "present" : "not set (default: index, follow)"}`);

    results.push({
      crawler: "Technical Summary",
      perspective: "Raw page diagnostics",
      findings: techFindings,
    });

    return NextResponse.json({
      url: normalizedUrl,
      fetchStatus,
      results,
      textPreview: gptText.slice(0, 500) + (gptText.length > 500 ? "..." : ""),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
