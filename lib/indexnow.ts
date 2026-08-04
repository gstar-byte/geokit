/**
 * IndexNow 工具函数
 * 用于向 Bing (api.indexnow.org) 提交新增/更新的 URL，加速搜索引擎索引
 */

const INDEXNOW_KEY = "f6a0914231714946856dbf318741b85b";
const BASE_URL = "https://geokit.site";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

/**
 * 向 IndexNow 提交单个或多个 URL
 * @param urls - 要提交的完整 URL 列表（需属于 geokit.site 域名）
 * @returns 提交结果，包含 HTTP 状态码
 */
export async function submitToIndexNow(urls: string[]): Promise<{
  success: boolean;
  status: number;
  message: string;
}> {
  if (!urls || urls.length === 0) {
    return { success: false, status: 400, message: "No URLs provided" };
  }

  // 过滤掉非本站域名的 URL
  const validUrls = urls.filter((url) => url.startsWith(BASE_URL));

  if (validUrls.length === 0) {
    return { success: false, status: 400, message: "All URLs must belong to geokit.site" };
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: "geokit.site",
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: validUrls,
      }),
    });

    const statusMessages: Record<number, string> = {
      200: "URLs submitted successfully",
      202: "URLs accepted for processing",
      400: "Bad request: Invalid format",
      403: "Forbidden: API key not valid",
      422: "Unprocessable: URLs don't belong to the host or key schema mismatch",
      429: "Too many requests: Slow down submissions",
    };

    const message = statusMessages[response.status] ?? `HTTP ${response.status}`;
    const success = response.status === 200 || response.status === 202;

    return { success, status: response.status, message };
  } catch (error) {
    console.error("[IndexNow] Submission error:", error);
    return { success: false, status: 500, message: "Failed to reach IndexNow API" };
  }
}

/**
 * 获取站点所有 URL 列表（用于初始化批量提交）
 */
export function getAllSiteUrls(): string[] {
  return [
    `${BASE_URL}/`,
    `${BASE_URL}/about`,
    `${BASE_URL}/badge`,
    `${BASE_URL}/tools/llms-txt-generator`,
    `${BASE_URL}/tools/ai-readiness-checker`,
    `${BASE_URL}/tools/geo-score`,
    `${BASE_URL}/tools/ai-search-grader`,
    `${BASE_URL}/tools/ai-robots-txt-generator`,
    `${BASE_URL}/tools/schema-generator`,
    `${BASE_URL}/tools/llms-txt-validator`,
    `${BASE_URL}/tools/geo-checklist`,
    `${BASE_URL}/tools/ai-sitemap-generator`,
    `${BASE_URL}/tools/meta-tag-generator`,
    `${BASE_URL}/tools/qa-content-formatter`,
    `${BASE_URL}/tools/ai-crawler-tester`,
    `${BASE_URL}/tools/schema-validator`,
    `${BASE_URL}/tools/sitemap-validator`,
  ];
}
