import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface CheckResult {
  name: string;
  category: string;
  status: "pass" | "fail" | "warn" | "info";
  message: string;
  points: number;
  maxPoints: number;
}

type SiteType = "blog" | "ecommerce" | "saas" | "api" | "general";

// Weight multipliers per site type
const WEIGHTS: Record<SiteType, Record<string, number>> = {
  blog:      { ai_crawlers: 1.0, basic_seo: 1.2, structured_data: 0.8, security: 0.8, accessibility: 1.0, content: 1.5, ai_agent: 0.5 },
  ecommerce: { ai_crawlers: 1.0, basic_seo: 1.0, structured_data: 1.5, security: 1.2, accessibility: 1.0, content: 0.8, ai_agent: 0.5 },
  saas:      { ai_crawlers: 1.2, basic_seo: 1.0, structured_data: 1.0, security: 1.0, accessibility: 0.8, content: 1.0, ai_agent: 1.2 },
  api:       { ai_crawlers: 1.5, basic_seo: 0.5, structured_data: 0.8, security: 1.0, accessibility: 0.5, content: 0.5, ai_agent: 2.0 },
  general:   { ai_crawlers: 1.0, basic_seo: 1.0, structured_data: 1.0, security: 1.0, accessibility: 1.0, content: 1.0, ai_agent: 1.0 },
};

async function fetchWithTimeout(url: string, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; GEOKit-Checker/2.0)" },
    });
  } finally {
    clearTimeout(id);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, siteType = "general" } = body;

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
    const weights = WEIGHTS[(siteType as SiteType)] || WEIGHTS.general;

    // ═══════════════════════════════════════════
    // CATEGORY 1: AI Crawler Access (🤖)
    // ═══════════════════════════════════════════
    
    // 1.1 robots.txt existence and AI bot access
    let robotsTxt = "";
    try {
      const robotsRes = await fetchWithTimeout(`${baseUrl}/robots.txt`);
      if (robotsRes.ok) {
        robotsTxt = await robotsRes.text();
        
        // Check individual AI bots
        const bots = [
          { name: "GPTBot", regex: /GPTBot/i },
          { name: "ClaudeBot", regex: /ClaudeBot|anthropic/i },
          { name: "PerplexityBot", regex: /PerplexityBot/i },
          { name: "Google-Extended", regex: /Google-Extended/i },
          { name: "Bytespider", regex: /Bytespider/i },
        ];

        const blockedBots: string[] = [];
        const mentionedBots: string[] = [];
        
        for (const bot of bots) {
          if (bot.regex.test(robotsTxt)) {
            mentionedBots.push(bot.name);
            // Check if blocked (User-agent: BotName followed by Disallow: /)
            const blockPattern = new RegExp(`User-agent:\\s*${bot.regex.source}[\\s\\S]*?Disallow:\\s*\\/`, "i");
            if (blockPattern.test(robotsTxt)) {
              blockedBots.push(bot.name);
            }
          }
        }

        if (blockedBots.length > 0) {
          results.push({
            name: "AI Crawler Access",
            category: "ai_crawlers",
            status: "warn",
            message: `robots.txt blocks: ${blockedBots.join(", ")}. This prevents these AI engines from accessing your site.`,
            points: 3,
            maxPoints: 10,
          });
        } else {
          results.push({
            name: "AI Crawler Access",
            category: "ai_crawlers",
            status: "pass",
            message: `robots.txt allows all AI crawlers.${mentionedBots.length > 0 ? ` Explicitly mentioned: ${mentionedBots.join(", ")}.` : ""}`,
            points: 10,
            maxPoints: 10,
          });
        }

        // 1.2 Sitemap in robots.txt
        const hasSitemapDirective = /Sitemap:\s*https?:\/\//i.test(robotsTxt);
        results.push({
          name: "Sitemap in robots.txt",
          category: "ai_crawlers",
          status: hasSitemapDirective ? "pass" : "warn",
          message: hasSitemapDirective ? "Sitemap URL declared in robots.txt." : "No Sitemap directive in robots.txt. Adding one helps AI crawlers discover your content.",
          points: hasSitemapDirective ? 5 : 0,
          maxPoints: 5,
        });
      } else {
        results.push({
          name: "AI Crawler Access",
          category: "ai_crawlers",
          status: "fail",
          message: "robots.txt not found. AI crawlers may not know how to index your site.",
          points: 0,
          maxPoints: 10,
        });
        results.push({
          name: "Sitemap in robots.txt",
          category: "ai_crawlers",
          status: "fail",
          message: "robots.txt missing — cannot check for sitemap directive.",
          points: 0,
          maxPoints: 5,
        });
      }
    } catch {
      results.push({
        name: "AI Crawler Access",
        category: "ai_crawlers",
        status: "fail",
        message: "Could not fetch robots.txt.",
        points: 0,
        maxPoints: 10,
      });
    }

    // 1.3 llms.txt
    try {
      const llmsRes = await fetchWithTimeout(`${baseUrl}/llms.txt`);
      if (llmsRes.ok) {
        const llmsContent = await llmsRes.text();
        const hasH1 = /^#\s+.+/m.test(llmsContent);
        const hasLinks = /\[.+\]\(.+\)/m.test(llmsContent);
        const hasSections = /^##\s+.+/m.test(llmsContent);
        let pts = 5;
        if (hasH1) pts += 5;
        if (hasLinks) pts += 5;
        if (hasSections) pts += 5;
        results.push({
          name: "llms.txt File",
          category: "ai_crawlers",
          status: pts >= 15 ? "pass" : "warn",
          message: `llms.txt found.${hasH1 ? " ✓ H1 title." : " ✗ Missing H1 title."}${hasLinks ? " ✓ Links." : " ✗ No links."}${hasSections ? " ✓ Sections." : " ✗ No sections."}`,
          points: pts,
          maxPoints: 20,
        });
      } else {
        results.push({
          name: "llms.txt File",
          category: "ai_crawlers",
          status: "info",
          message: "llms.txt not found. Creating one helps AI models understand your site structure.",
          points: 0,
          maxPoints: 20,
        });
      }
    } catch {
      results.push({
        name: "llms.txt File",
        category: "ai_crawlers",
        status: "info",
        message: "Could not check for llms.txt.",
        points: 0,
        maxPoints: 20,
      });
    }

    // 1.4 sitemap.xml
    let hasSitemap = false;
    try {
      const sitemapRes = await fetchWithTimeout(`${baseUrl}/sitemap.xml`);
      hasSitemap = sitemapRes.ok;
      const sitemapContent = hasSitemap ? await sitemapRes.text() : "";
      const urlCount = (sitemapContent.match(/<loc>/gi) || []).length;
      results.push({
        name: "XML Sitemap",
        category: "ai_crawlers",
        status: hasSitemap ? "pass" : "warn",
        message: hasSitemap ? `sitemap.xml found with ${urlCount} URL(s).` : "sitemap.xml not found. AI crawlers use sitemaps to discover your pages.",
        points: hasSitemap ? 5 : 0,
        maxPoints: 5,
      });
    } catch {
      results.push({
        name: "XML Sitemap",
        category: "ai_crawlers",
        status: "warn",
        message: "Could not check sitemap.xml.",
        points: 0,
        maxPoints: 5,
      });
    }


    // 1.5 llms-full.txt Check
    try {
      const llmsFullRes = await fetchWithTimeout(`${baseUrl}/llms-full.txt`);
      const hasLlmsFull = llmsFullRes.ok;
      results.push({
        name: "llms-full.txt File",
        category: "ai_crawlers",
        status: hasLlmsFull ? "pass" : "info",
        message: hasLlmsFull ? "llms-full.txt found. AI models can read full-page Markdown content." : "No llms-full.txt found. Adding one helps LLMs ingest complete page contents.",
        points: hasLlmsFull ? 10 : 0,
        maxPoints: 10,
      });
    } catch {
      results.push({
        name: "llms-full.txt File",
        category: "ai_crawlers",
        status: "info",
        message: "Could not check for llms-full.txt.",
        points: 0,
        maxPoints: 10,
      });
    }


    // ═══════════════════════════════════════════
    // CATEGORY 2: Fetch page HTML for remaining checks
    // ═══════════════════════════════════════════
    
    let html = "";
    let pageStatus = 0;
    let responseTime = 0;
    let contentEncoding = "";
    let securityHeaders: Record<string, string> = {};
    
    try {
      const startTime = Date.now();
      const pageRes = await fetchWithTimeout(normalizedUrl);
      responseTime = Date.now() - startTime;
      pageStatus = pageRes.status;
      contentEncoding = pageRes.headers.get("content-encoding") || "";
      
      // Collect security headers
      for (const header of ["strict-transport-security", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
        const val = pageRes.headers.get(header);
        if (val) securityHeaders[header] = val;
      }
      
      if (pageRes.ok) {
        html = await pageRes.text();
      }
    } catch {
      results.push({
        name: "Page Accessibility",
        category: "basic_seo",
        status: "fail",
        message: "Could not fetch the page. Site may be down or blocking requests.",
        points: 0,
        maxPoints: 50,
      });
      // Return early with what we have
      return buildResponse(normalizedUrl, siteType, results, weights);
    }

    if (!html) {
      results.push({
        name: "Page Accessibility",
        category: "basic_seo",
        status: "fail",
        message: `Page returned HTTP ${pageStatus}.`,
        points: 0,
        maxPoints: 50,
      });
      return buildResponse(normalizedUrl, siteType, results, weights);
    }

    // ═══════════════════════════════════════════
    // CATEGORY 3: Basic SEO (📝)
    // ═══════════════════════════════════════════

    // 3.1 Title tag
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const titleText = titleMatch ? titleMatch[1].trim() : "";
    const titleLen = titleText.length;
    results.push({
      name: "Title Tag",
      category: "basic_seo",
      status: titleLen > 0 ? (titleLen >= 30 && titleLen <= 60 ? "pass" : "warn") : "fail",
      message: titleLen > 0
        ? `Title: "${titleText.substring(0, 60)}${titleLen > 60 ? "..." : ""}" (${titleLen} chars).${titleLen < 30 ? " Too short — aim for 30-60 characters." : titleLen > 60 ? " Too long — aim for 30-60 characters." : " Good length."}`
        : "Missing <title> tag.",
      points: titleLen > 0 ? (titleLen >= 30 && titleLen <= 60 ? 8 : 5) : 0,
      maxPoints: 8,
    });

    // 3.2 Meta description
    const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["']/i)
      || html.match(/<meta[^>]*content=["']([\s\S]*?)["'][^>]*name=["']description["']/i);
    const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : "";
    const metaDescLen = metaDesc.length;
    results.push({
      name: "Meta Description",
      category: "basic_seo",
      status: metaDescLen > 0 ? (metaDescLen >= 120 && metaDescLen <= 160 ? "pass" : "warn") : "fail",
      message: metaDescLen > 0
        ? `Meta description found (${metaDescLen} chars).${metaDescLen < 120 ? " Consider making it longer (120-160 chars)." : metaDescLen > 160 ? " Consider shortening (120-160 chars)." : " Ideal length."}`
        : "Missing meta description. AI search engines use this to understand your page.",
      points: metaDescLen > 0 ? (metaDescLen >= 120 && metaDescLen <= 160 ? 8 : 5) : 0,
      maxPoints: 8,
    });

    // 3.3 H1 heading
    const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
    results.push({
      name: "H1 Heading",
      category: "basic_seo",
      status: h1Matches.length === 1 ? "pass" : h1Matches.length === 0 ? "fail" : "warn",
      message: h1Matches.length === 1 ? "Single H1 tag found — correct structure." : h1Matches.length === 0 ? "No H1 tag found." : `${h1Matches.length} H1 tags found — use only one per page.`,
      points: h1Matches.length === 1 ? 5 : 0,
      maxPoints: 5,
    });

    // 3.4 Canonical URL
    const hasCanonical = /<link[^>]*rel=["']canonical["'][^>]*href=["'][^"']+["']/i.test(html);
    results.push({
      name: "Canonical URL",
      category: "basic_seo",
      status: hasCanonical ? "pass" : "warn",
      message: hasCanonical ? "Canonical URL is set." : "Missing canonical URL — may cause duplicate content issues.",
      points: hasCanonical ? 4 : 0,
      maxPoints: 4,
    });

    // 3.5 Language attribute
    const hasLang = /<html[^>]*lang=["'][^"']+["']/i.test(html);
    results.push({
      name: "Language Attribute",
      category: "basic_seo",
      status: hasLang ? "pass" : "warn",
      message: hasLang ? "HTML lang attribute is set." : "Missing lang attribute on <html> tag.",
      points: hasLang ? 3 : 0,
      maxPoints: 3,
    });

    // 3.6 Viewport meta
    const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);
    results.push({
      name: "Viewport Meta",
      category: "basic_seo",
      status: hasViewport ? "pass" : "warn",
      message: hasViewport ? "Viewport meta tag found — mobile-friendly." : "Missing viewport meta tag.",
      points: hasViewport ? 3 : 0,
      maxPoints: 3,
    });

    // ═══════════════════════════════════════════
    // CATEGORY 4: Structured Data (🏷️)
    // ═══════════════════════════════════════════

    // 4.1 JSON-LD
    const jsonLdBlocks = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
    const schemaTypes: string[] = [];
    for (const block of jsonLdBlocks) {
      const content = block.replace(/<script[^>]*>|<\/script>/gi, "").trim();
      try {
        const parsed = JSON.parse(content);
        const extractTypes = (obj: Record<string, unknown>) => {
          if (obj["@type"]) schemaTypes.push(obj["@type"] as string);
          if (obj["@graph"] && Array.isArray(obj["@graph"])) {
            for (const item of obj["@graph"]) {
              if (item["@type"]) schemaTypes.push(item["@type"] as string);
            }
          }
        };
        if (Array.isArray(parsed)) {
          for (const item of parsed) extractTypes(item);
        } else {
          extractTypes(parsed);
        }
      } catch {
        // malformed JSON-LD
      }
    }
    
    results.push({
      name: "JSON-LD Structured Data",
      category: "structured_data",
      status: jsonLdBlocks.length > 0 ? "pass" : "fail",
      message: jsonLdBlocks.length > 0
        ? `${jsonLdBlocks.length} JSON-LD block(s) found. Types: ${[...new Set(schemaTypes)].join(", ") || "unknown"}.`
        : "No JSON-LD structured data found. This is critical for AI search visibility.",
      points: jsonLdBlocks.length > 0 ? 12 : 0,
      maxPoints: 12,
    });

    // 4.2 Open Graph
    const ogTags = html.match(/<meta[^>]*property=["']og:[^"']+["'][^>]*>/gi) || [];
    const hasOgTitle = /<meta[^>]*property=["']og:title["']/i.test(html);
    const hasOgDesc = /<meta[^>]*property=["']og:description["']/i.test(html);
    const hasOgImage = /<meta[^>]*property=["']og:image["']/i.test(html);
    results.push({
      name: "Open Graph Tags",
      category: "structured_data",
      status: ogTags.length >= 3 ? "pass" : ogTags.length > 0 ? "warn" : "fail",
      message: ogTags.length > 0
        ? `${ogTags.length} OG tag(s).${hasOgTitle ? " ✓ title" : " ✗ title"}${hasOgDesc ? " ✓ desc" : " ✗ desc"}${hasOgImage ? " ✓ image" : " ✗ image"}`
        : "No Open Graph tags. Social sharing and AI snippet extraction depend on these.",
      points: (hasOgTitle ? 2 : 0) + (hasOgDesc ? 2 : 0) + (hasOgImage ? 2 : 0),
      maxPoints: 6,
    });

    // 4.3 Twitter Card
    const hasTwitterCard = /<meta[^>]*name=["']twitter:card["']/i.test(html);
    results.push({
      name: "Twitter Card Tags",
      category: "structured_data",
      status: hasTwitterCard ? "pass" : "warn",
      message: hasTwitterCard ? "Twitter Card meta tags found." : "No Twitter Card tags.",
      points: hasTwitterCard ? 3 : 0,
      maxPoints: 3,
    });

    // 4.4 Author / Publisher markup
    const hasAuthor = /<meta[^>]*name=["']author["']/i.test(html) || /"author"/i.test(html);
    results.push({
      name: "Author / Publisher Markup",
      category: "structured_data",
      status: hasAuthor ? "pass" : "warn",
      message: hasAuthor ? "Author/publisher information found." : "No author markup. AI models favor content with clear authorship.",
      points: hasAuthor ? 4 : 0,
      maxPoints: 4,
    });

    // ═══════════════════════════════════════════
    // CATEGORY 5: Semantic HTML & Accessibility (♿)
    // ═══════════════════════════════════════════

    // 5.1 Semantic elements
    const semanticTags = ["article", "main", "section", "nav", "header", "footer", "aside"];
    const foundSemantic = semanticTags.filter(tag => new RegExp(`<${tag}[\\s>]`, "i").test(html));
    results.push({
      name: "Semantic HTML Elements",
      category: "accessibility",
      status: foundSemantic.length >= 3 ? "pass" : foundSemantic.length > 0 ? "warn" : "fail",
      message: foundSemantic.length > 0
        ? `Found: ${foundSemantic.join(", ")} (${foundSemantic.length}/${semanticTags.length}).`
        : "No semantic HTML elements. Use <article>, <main>, <section> for better AI comprehension.",
      points: Math.min(foundSemantic.length * 2, 8),
      maxPoints: 8,
    });

    // 5.2 Image alt attributes
    const imgTags = html.match(/<img[^>]*>/gi) || [];
    const imgWithAlt = imgTags.filter(tag => /alt=["'][^"']+["']/i.test(tag)).length;
    const imgTotal = imgTags.length;
    const altRatio = imgTotal > 0 ? imgWithAlt / imgTotal : 1;
    results.push({
      name: "Image Alt Attributes",
      category: "accessibility",
      status: imgTotal === 0 ? "info" : altRatio >= 0.9 ? "pass" : altRatio >= 0.5 ? "warn" : "fail",
      message: imgTotal === 0
        ? "No images found on page."
        : `${imgWithAlt}/${imgTotal} images have alt text (${Math.round(altRatio * 100)}%).`,
      points: imgTotal === 0 ? 5 : Math.round(altRatio * 5),
      maxPoints: 5,
    });

    // 5.3 ARIA landmarks
    const hasAria = /role=["'](main|navigation|banner|contentinfo|complementary)["']/i.test(html) || /aria-label/i.test(html);
    results.push({
      name: "ARIA Landmarks",
      category: "accessibility",
      status: hasAria ? "pass" : "info",
      message: hasAria ? "ARIA landmarks or labels found." : "No ARIA landmarks detected. Adding them improves AI content parsing.",
      points: hasAria ? 3 : 0,
      maxPoints: 3,
    });

    // 5.4 Heading hierarchy
    const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
    const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
    const hasGoodHierarchy = h1Matches.length === 1 && h2Count >= 1;
    results.push({
      name: "Heading Hierarchy",
      category: "accessibility",
      status: hasGoodHierarchy ? "pass" : "warn",
      message: `H1: ${h1Matches.length}, H2: ${h2Count}, H3: ${h3Count}.${hasGoodHierarchy ? " Good hierarchy." : " Improve heading structure for better content parsing."}`,
      points: hasGoodHierarchy ? 4 : (h2Count > 0 ? 2 : 0),
      maxPoints: 4,
    });

    // ═══════════════════════════════════════════
    // CATEGORY 6: Security & Performance (🔐)
    // ═══════════════════════════════════════════

    // 6.1 HTTPS
    const isHttps = urlObj.protocol === "https:";
    results.push({
      name: "HTTPS",
      category: "security",
      status: isHttps ? "pass" : "fail",
      message: isHttps ? "Site uses HTTPS." : "Not using HTTPS — critical for trust and AI indexing.",
      points: isHttps ? 5 : 0,
      maxPoints: 5,
    });

    // 6.2 Security headers
    const secHeaderCount = Object.keys(securityHeaders).length;
    const hasHSTS = !!securityHeaders["strict-transport-security"];
    const hasCSP = !!securityHeaders["content-security-policy"];
    const hasXCTO = !!securityHeaders["x-content-type-options"];
    results.push({
      name: "Security Headers",
      category: "security",
      status: secHeaderCount >= 3 ? "pass" : secHeaderCount >= 1 ? "warn" : "fail",
      message: `${secHeaderCount}/6 security headers.${hasHSTS ? " ✓ HSTS" : " ✗ HSTS"}${hasCSP ? " ✓ CSP" : " ✗ CSP"}${hasXCTO ? " ✓ X-Content-Type-Options" : ""}`,
      points: Math.min(secHeaderCount * 2, 6),
      maxPoints: 6,
    });

    // 6.3 Response time
    results.push({
      name: "Response Time",
      category: "security",
      status: responseTime < 1000 ? "pass" : responseTime < 3000 ? "warn" : "fail",
      message: `Page responded in ${responseTime}ms.${responseTime < 1000 ? " Fast." : responseTime < 3000 ? " Acceptable, but could be faster." : " Slow — AI crawlers may time out."}`,
      points: responseTime < 1000 ? 5 : responseTime < 3000 ? 3 : 1,
      maxPoints: 5,
    });

    // 6.4 Compression
    const hasCompression = /gzip|br|deflate/i.test(contentEncoding);
    results.push({
      name: "Content Compression",
      category: "security",
      status: hasCompression ? "pass" : "warn",
      message: hasCompression ? `Compression: ${contentEncoding}.` : "No content compression detected. Enable gzip/brotli for faster AI crawling.",
      points: hasCompression ? 4 : 0,
      maxPoints: 4,
    });

    // ═══════════════════════════════════════════
    // CATEGORY 7: Content Quality (📊)
    // ═══════════════════════════════════════════

    // Strip tags for text analysis
    const textContent = html
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const wordCount = textContent.split(/\s+/).filter(w => w.length > 1).length;

    // 7.1 Content length
    results.push({
      name: "Content Length",
      category: "content",
      status: wordCount >= 300 ? "pass" : wordCount >= 100 ? "warn" : "fail",
      message: `~${wordCount} words.${wordCount >= 300 ? " Good amount of content for AI to index." : wordCount >= 100 ? " Consider adding more content." : " Very thin content — AI models need substance to cite."}`,
      points: wordCount >= 500 ? 6 : wordCount >= 300 ? 5 : wordCount >= 100 ? 3 : 1,
      maxPoints: 6,
    });

    // 7.2 Internal links
    const internalLinks = (html.match(new RegExp(`href=["'](?:\\/|${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})[^"']*["']`, "gi")) || []).length;
    results.push({
      name: "Internal Links",
      category: "content",
      status: internalLinks >= 3 ? "pass" : internalLinks >= 1 ? "warn" : "fail",
      message: `${internalLinks} internal link(s).${internalLinks >= 3 ? " Good internal linking." : " Add more internal links for better content discovery."}`,
      points: Math.min(internalLinks, 5),
      maxPoints: 5,
    });

    // 7.3 External links
    const allLinks = (html.match(/href=["']https?:\/\/[^"']+["']/gi) || []).length;
    const externalLinks = allLinks - internalLinks;
    results.push({
      name: "External Links",
      category: "content",
      status: externalLinks >= 1 ? "pass" : "info",
      message: `${externalLinks} external link(s).${externalLinks >= 1 ? " External references build trust." : " Consider adding external references for credibility."}`,
      points: externalLinks >= 1 ? 3 : 0,
      maxPoints: 3,
    });

    // 7.4 Lists and structured content
    const listCount = (html.match(/<(ul|ol)[^>]*>/gi) || []).length;
    const tableCount = (html.match(/<table[^>]*>/gi) || []).length;
    const hasStructuredContent = listCount > 0 || tableCount > 0;
    results.push({
      name: "Structured Content",
      category: "content",
      status: hasStructuredContent ? "pass" : "info",
      message: `${listCount} list(s), ${tableCount} table(s).${hasStructuredContent ? " Structured content helps AI extract information." : " Consider using lists/tables for AI-friendly content."}`,
      points: hasStructuredContent ? 4 : 0,
      maxPoints: 4,
    });

    // 7.5 FAQ/Q&A patterns
    const hasFaqSchema = schemaTypes.includes("FAQPage");
    const hasQuestions = (textContent.match(/\?/g) || []).length >= 3;
    results.push({
      name: "Q&A / FAQ Content",
      category: "content",
      status: hasFaqSchema ? "pass" : hasQuestions ? "warn" : "info",
      message: hasFaqSchema
        ? "FAQPage schema detected — excellent for AI citations."
        : hasQuestions
        ? "Questions detected in content but no FAQPage schema. Consider adding FAQ structured data."
        : "No Q&A patterns detected. FAQ content is 3.2x more likely to be cited.",
      points: hasFaqSchema ? 5 : hasQuestions ? 2 : 0,
      maxPoints: 5,
    });

    // ═══════════════════════════════════════════
    // CATEGORY 8: AI Agent Readiness (🤝)
    // ═══════════════════════════════════════════

    // 8.1 Well-known files
    let hasWellKnown = false;
    try {
      const wkRes = await fetchWithTimeout(`${baseUrl}/.well-known/ai-plugin.json`, 5000);
      hasWellKnown = wkRes.ok;
    } catch { /* ignore */ }
    results.push({
      name: "AI Plugin / Well-Known",
      category: "ai_agent",
      status: hasWellKnown ? "pass" : "info",
      message: hasWellKnown ? "ai-plugin.json found — AI agents can interact with your site." : "No ai-plugin.json. Consider adding if you offer API services.",
      points: hasWellKnown ? 5 : 0,
      maxPoints: 5,
    });

    // 8.2 API indicators
    const hasApiLinks = /\/api\//i.test(html) || /swagger|openapi|graphql/i.test(html);
    results.push({
      name: "API Discoverability",
      category: "ai_agent",
      status: hasApiLinks ? "pass" : "info",
      message: hasApiLinks ? "API references detected — AI agents can discover your services." : "No API references found on page.",
      points: hasApiLinks ? 3 : 0,
      maxPoints: 3,
    });

    // 8.3 Machine-readable contact
    const hasContactSchema = schemaTypes.some(t => ["ContactPoint", "Organization"].includes(t));
    const hasContactLink = /contact|mailto:/i.test(html);
    results.push({
      name: "Machine-Readable Contact",
      category: "ai_agent",
      status: hasContactSchema ? "pass" : hasContactLink ? "warn" : "info",
      message: hasContactSchema
        ? "Contact information in structured data."
        : hasContactLink
        ? "Contact link found but not in structured data."
        : "No machine-readable contact information.",
      points: hasContactSchema ? 4 : hasContactLink ? 2 : 0,
      maxPoints: 4,
    });

    // 8.4 WebMCP Integration
    const hasMcpTag = /<link[^>]*rel=["']mcp["']/i.test(html) || /<meta[^>]*name=["']mcp-server["']/i.test(html);
    results.push({
      name: "WebMCP Integration",
      category: "ai_agent",
      status: hasMcpTag ? "pass" : "info",
      message: hasMcpTag ? "WebMCP link or metadata found — AI agents can interact programmatically." : "No WebMCP integration links found in page metadata. Consider adding to support Agent integrations.",
      points: hasMcpTag ? 5 : 0,
      maxPoints: 5,
    });

    return buildResponse(normalizedUrl, siteType, results, weights);

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

function buildResponse(
  url: string,
  siteType: string,
  results: CheckResult[],
  weights: Record<string, number>
) {
  // Apply weights
  const weightedResults = results.map(r => {
    const w = weights[r.category] || 1.0;
    return {
      ...r,
      weightedPoints: r.points * w,
      weightedMax: r.maxPoints * w,
    };
  });

  const totalWeighted = weightedResults.reduce((sum, r) => sum + r.weightedPoints, 0);
  const maxWeighted = weightedResults.reduce((sum, r) => sum + r.weightedMax, 0);
  const score = maxWeighted > 0 ? Math.round((totalWeighted / maxWeighted) * 100) : 0;

  // Group by category
  const categories = [
    { key: "ai_crawlers", label: "AI Crawler Access", icon: "🤖" },
    { key: "basic_seo", label: "Basic SEO", icon: "📝" },
    { key: "structured_data", label: "Structured Data", icon: "🏷️" },
    { key: "accessibility", label: "Semantic HTML & Accessibility", icon: "♿" },
    { key: "security", label: "Security & Performance", icon: "🔐" },
    { key: "content", label: "Content Quality", icon: "📊" },
    { key: "ai_agent", label: "AI Agent Readiness", icon: "🤝" },
  ];

  const grouped = categories.map(cat => {
    const catResults = weightedResults.filter(r => r.category === cat.key);
    const catPoints = catResults.reduce((s, r) => s + r.weightedPoints, 0);
    const catMax = catResults.reduce((s, r) => s + r.weightedMax, 0);
    return {
      ...cat,
      score: catMax > 0 ? Math.round((catPoints / catMax) * 100) : 0,
      results: catResults,
    };
  }).filter(g => g.results.length > 0);

  return NextResponse.json({
    url,
    siteType,
    score,
    categories: grouped,
    results: weightedResults,
    totalPoints: Math.round(totalWeighted),
    maxTotal: Math.round(maxWeighted),
    checkCount: results.length,
  });
}
