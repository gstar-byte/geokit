import { NextRequest, NextResponse } from "next/server";

interface PageInfo {
  title: string;
  url: string;
  note: string;
}

interface SitemapResult {
  title: string;
  description: string;
  sections: { heading: string; links: PageInfo[] }[];
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function categorizeUrl(url: string): string {
  const path = new URL(url).pathname.toLowerCase();
  if (path.includes("/blog") || path.includes("/posts") || path.includes("/articles")) return "Blog";
  if (path.includes("/doc") || path.includes("/guide") || path.includes("/tutorial")) return "Documentation";
  if (path.includes("/api")) return "API";
  if (path.includes("/about") || path.includes("/team") || path.includes("/company")) return "About";
  if (path.includes("/pricing") || path.includes("/plan")) return "Pricing";
  if (path.includes("/tool") || path.includes("/feature") || path.includes("/product")) return "Tools";
  if (path.includes("/faq") || path.includes("/help") || path.includes("/support")) return "Help";
  if (path.includes("/contact")) return "Contact";
  if (path.includes("/legal") || path.includes("/privacy") || path.includes("/terms")) return "Legal";
  return "Pages";
}

async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "GEOKit/1.0 (https://geokit.site; llms-txt-generator)",
      },
    });
    return res;
  } finally {
    clearTimeout(id);
  }
}

async function parseSitemapXml(baseUrl: string): Promise<string[]> {
  const urls: string[] = [];
  const sitemapUrls = [
    `${baseUrl}/sitemap.xml`,
    `${baseUrl}/sitemap_index.xml`,
    `${baseUrl}/sitemap-index.xml`,
  ];

  for (const sitemapUrl of sitemapUrls) {
    try {
      const res = await fetchWithTimeout(sitemapUrl);
      if (!res.ok) continue;
      const text = await res.text();

      const locMatches = text.match(/<loc>(.*?)<\/loc>/gi);
      if (locMatches) {
        for (const match of locMatches) {
          const url = match.replace(/<\/?loc>/gi, "").trim();
          if (url.includes("sitemap") && url.endsWith(".xml")) {
            try {
              const subRes = await fetchWithTimeout(url);
              if (subRes.ok) {
                const subText = await subRes.text();
                const subMatches = subText.match(/<loc>(.*?)<\/loc>/gi);
                if (subMatches) {
                  for (const subMatch of subMatches) {
                    urls.push(subMatch.replace(/<\/?loc>/gi, "").trim());
                  }
                }
              }
            } catch {
              // Skip failed sub-sitemaps
            }
          } else {
            urls.push(url);
          }
        }
      }
      if (urls.length > 0) break;
    } catch {
      continue;
    }
  }

  return [...new Set(urls)].slice(0, 50);
}

async function fetchPageTitle(url: string): Promise<{ title: string; description: string }> {
  try {
    const res = await fetchWithTimeout(url, 5000);
    if (!res.ok) return { title: "", description: "" };
    const text = await res.text();

    // 提取 title
    let title = "";
    const titleMatch = text.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      title = titleMatch[1]
        .replace(/\s*[|\-–—]\s*.+$/, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
    }

    // 提取 meta description
    let description = "";
    const descMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i)
      || text.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["']/i);
    if (descMatch) {
      description = descMatch[1]
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .trim();
    }

    return { title, description };
  } catch {
    return { title: "", description: "" };
  }
}

async function fetchHomepageMeta(baseUrl: string): Promise<{ title: string; description: string }> {
  try {
    const res = await fetchWithTimeout(baseUrl);
    if (!res.ok) return { title: extractDomain(baseUrl), description: "" };
    const text = await res.text();

    const titleMatch = text.match(/<title[^>]*>(.*?)<\/title>/i);
    const descMatch = text.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i)
      || text.match(/<meta[^>]*content=["'](.*?)["'][^>]*name=["']description["']/i);

    const title = titleMatch
      ? titleMatch[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim()
      : extractDomain(baseUrl);
    const description = descMatch
      ? descMatch[1].replace(/&amp;/g, "&").replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim()
      : "";

    return { title, description };
  } catch {
    return { title: extractDomain(baseUrl), description: "" };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let baseUrl = url.trim();
    if (!baseUrl.startsWith("http")) {
      baseUrl = `https://${baseUrl}`;
    }
    baseUrl = baseUrl.replace(/\/+$/, "");

    const meta = await fetchHomepageMeta(baseUrl);

    let pageUrls = await parseSitemapXml(baseUrl);

    if (pageUrls.length === 0) {
      try {
        const res = await fetchWithTimeout(baseUrl);
        if (res.ok) {
          const text = await res.text();
          const linkMatches = text.match(/href=["'](\/[^"'#?]*?)["']/gi);
          if (linkMatches) {
            const paths = new Set<string>();
            for (const match of linkMatches) {
              const path = match.replace(/href=["']/i, "").replace(/["']$/, "");
              if (path && path !== "/" && !path.includes(".") && !path.startsWith("/_")) {
                paths.add(path);
              }
            }
            pageUrls = [...paths].map((p) => `${baseUrl}${p}`).slice(0, 30);
          }
        }
      } catch {
        // ignore
      }
    }

    if (pageUrls.length === 0) {
      return NextResponse.json({
        error: "Could not find sitemap.xml or extract links from this URL. Make sure the site is accessible and has a sitemap.",
      }, { status: 400 });
    }

    const pagesToFetch = pageUrls.slice(0, 30);
    const pagesWithTitles: PageInfo[] = [];

    for (let i = 0; i < pagesToFetch.length; i += 5) {
      const batch = pagesToFetch.slice(i, i + 5);
      const results = await Promise.allSettled(
        batch.map(async (pageUrl) => {
          const { title, description } = await fetchPageTitle(pageUrl);
          return {
            title: title || new URL(pageUrl).pathname.replace(/\//g, " ").trim(),
            url: pageUrl,
            note: description,
          };
        })
      );
      for (const result of results) {
        if (result.status === "fulfilled") {
          pagesWithTitles.push(result.value);
        }
      }
    }

    const groups: Record<string, PageInfo[]> = {};
    for (const page of pagesWithTitles) {
      const category = categorizeUrl(page.url);
      if (!groups[category]) groups[category] = [];
      groups[category].push(page);
    }

    const sections = Object.entries(groups).map(([heading, links]) => ({
      heading,
      links,
    }));

    const result: SitemapResult = {
      title: meta.title,
      description: meta.description,
      sections: sections.length > 0 ? sections : [{ heading: "Pages", links: pagesWithTitles }],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fetch sitemap error:", error);
    return NextResponse.json(
      { error: "Failed to fetch site data. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
