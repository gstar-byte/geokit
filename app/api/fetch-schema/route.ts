import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required and must be a string." },
        { status: 400 }
      );
    }

    let targetUrl = url.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    // 验证 URL 格式
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format." },
        { status: 400 }
      );
    }

    // 带超时的 HTML 抓取
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    let html: string;
    try {
      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "GEOKit/1.0",
        },
        redirect: "follow",
      });

      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch URL: HTTP ${res.status} ${res.statusText}` },
          { status: 400 }
        );
      }

      html = await res.text();
    } catch (e) {
      const message =
        (e as Error).name === "AbortError"
          ? "Request timed out after 8 seconds."
          : `Failed to fetch URL: ${(e as Error).message}`;
      return NextResponse.json({ error: message }, { status: 500 });
    } finally {
      clearTimeout(timeoutId);
    }

    // 提取所有 <script type="application/ld+json"> 块
    const scriptRegex =
      /<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const rawBlocks: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = scriptRegex.exec(html)) !== null) {
      const content = match[1].trim();
      if (content) {
        rawBlocks.push(content);
      }
    }

    if (rawBlocks.length === 0) {
      return NextResponse.json(
        { error: "No <script type=\"application/ld+json\"> blocks found on this page." },
        { status: 400 }
      );
    }

    // 解析每个 JSON 块，跳过格式错误的块
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schemas: any[] = [];
    const parseErrors: string[] = [];

    for (let i = 0; i < rawBlocks.length; i++) {
      try {
        const parsed = JSON.parse(rawBlocks[i]);
        // 如果解析结果是数组，展开到 schemas 中
        if (Array.isArray(parsed)) {
          schemas.push(...parsed);
        } else {
          schemas.push(parsed);
        }
      } catch (e) {
        parseErrors.push(
          `Block ${i + 1}: ${(e as Error).message}`
        );
      }
    }

    if (schemas.length === 0 && parseErrors.length > 0) {
      return NextResponse.json(
        {
          error: `Found ${rawBlocks.length} JSON-LD block(s) but all contained malformed JSON: ${parseErrors.join("; ")}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ schemas, url: targetUrl });
  } catch (error) {
    console.error("fetch-schema error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
