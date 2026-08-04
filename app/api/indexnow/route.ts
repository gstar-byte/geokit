import { NextRequest, NextResponse } from "next/server";
import { submitToIndexNow, getAllSiteUrls } from "@/lib/indexnow";

export const runtime = "edge";

/**
 * POST /api/indexnow
 * 提交指定 URL 列表到 IndexNow（Bing）
 * Body: { urls?: string[] }  — 不传则提交全站所有 URL
 *
 * 通过简单的 Bearer token 防止被外部滥用调用
 */
export async function POST(req: NextRequest) {
  // 简单鉴权：仅允许内部 cron 或携带正确 secret 的调用
  const authHeader = req.headers.get("authorization") ?? "";
  const expectedSecret = process.env.INDEXNOW_SUBMIT_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] = Array.isArray(body?.urls) ? body.urls : getAllSiteUrls();

    const result = await submitToIndexNow(urls);

    return NextResponse.json(
      {
        submitted: urls.length,
        urls,
        ...result,
      },
      { status: result.success ? 200 : result.status }
    );
  } catch (error) {
    console.error("[IndexNow API] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/indexnow
 * 返回当前 IndexNow 配置信息（key、keyLocation 等）
 */
export async function GET() {
  return NextResponse.json({
    key: "f6a0914231714946856dbf318741b85b",
    keyLocation: "https://geokit.site/f6a0914231714946856dbf318741b85b.txt",
    host: "geokit.site",
    endpoint: "https://api.indexnow.org/IndexNow",
    totalUrls: getAllSiteUrls().length,
    urls: getAllSiteUrls(),
  });
}
