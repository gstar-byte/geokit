import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

interface PageContent {
  url: string;
  title: string;
  content: string;
}

function extractMainContent(html: string): string {
  // Remove script, style, nav, header, footer, aside tags
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  // Try to extract main/article content first
  const mainMatch = text.match(/<(?:main|article)[^>]*>([\s\S]*?)<\/(?:main|article)>/i);
  if (mainMatch) {
    text = mainMatch[1];
  }

  // Convert headings to markdown
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n");

  // Convert links
  text = text.replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");

  // Convert lists
  text = text.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");

  // Convert paragraphs
  text = text.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");

  // Convert line breaks
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Remove all remaining tags
  text = text.replace(/<[^>]+>/g, "");

  // Clean up HTML entities
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Clean up whitespace
  text = text
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map(line => line.trim())
    .join("\n")
    .trim();

  // Limit per page (about 2000 words max)
  const words = text.split(/\s+/);
  if (words.length > 2000) {
    text = words.slice(0, 2000).join(" ") + "\n\n[Content truncated...]";
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: "URLs array is required" }, { status: 400 });
    }

    // Limit to 10 pages for performance
    const pagesToFetch = urls.slice(0, 10);
    const pages: PageContent[] = [];

    for (let i = 0; i < pagesToFetch.length; i += 3) {
      const batch = pagesToFetch.slice(i, i + 3);
      const results = await Promise.allSettled(
        batch.map(async (pageUrl: string) => {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);
          try {
            const res = await fetch(pageUrl, {
              signal: controller.signal,
              headers: { "User-Agent": "GEOKit/1.0 (llms-full-txt-generator)" },
            });
            if (!res.ok) return null;
            const html = await res.text();

            // Extract title
            const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
            const title = titleMatch
              ? titleMatch[1].replace(/\s*[|–—-]\s*.+$/, "").replace(/&amp;/g, "&").trim()
              : new URL(pageUrl).pathname;

            const content = extractMainContent(html);
            if (!content || content.length < 50) return null;

            return { url: pageUrl, title, content };
          } finally {
            clearTimeout(timeout);
          }
        })
      );

      for (const result of results) {
        if (result.status === "fulfilled" && result.value) {
          pages.push(result.value);
        }
      }
    }

    if (pages.length === 0) {
      return NextResponse.json({
        error: "Could not extract content from any of the provided URLs.",
      }, { status: 400 });
    }

    // Build llms-full.txt in markdown format
    let fullTxt = "";
    for (const page of pages) {
      fullTxt += `---\n\n`;
      fullTxt += `# ${page.title}\n\n`;
      fullTxt += `Source: ${page.url}\n\n`;
      fullTxt += `${page.content}\n\n`;
    }

    return NextResponse.json({
      pages: pages.length,
      totalChars: fullTxt.length,
      content: fullTxt.trim(),
    });
  } catch (error) {
    console.error("Fetch full content error:", error);
    return NextResponse.json(
      { error: "Failed to fetch page content." },
      { status: 500 }
    );
  }
}
