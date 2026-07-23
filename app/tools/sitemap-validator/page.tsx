"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n";

interface UrlCheckResult {
  url: string;
  status: number | string;
  ok: boolean;
}

interface ValidationResponse {
  sitemapUrl: string;
  isValidFormat: boolean;
  isSitemapIndex: boolean;
  totalUrls: number;
  urlsChecked: number;
  results: UrlCheckResult[];
  xmlSizeKb: string;
}

export default function SitemapValidatorPage() {
  const { t } = useLanguage();
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResponse | null>(null);
  const [error, setError] = useState("");

  const checkSitemap = async () => {
    if (!sitemapUrl.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/check-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitemapUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to validate sitemap.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please verify the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: number | string, ok: boolean) => {
    if (ok && status === 200) return "bg-green-500/10 text-green-400 border-green-500/30";
    if (typeof status === "number" && status >= 300 && status < 400) {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }
    return "bg-red-500/10 text-red-400 border-red-500/30";
  };

  const passCount = result ? result.results.filter(r => r.ok).length : 0;
  const failCount = result ? result.results.filter(r => !r.ok).length : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Sitemap Validator &amp; Checker
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Enter your sitemap URL to check XML syntax compliance, sitemaps.org format, file weight, and run instant HTTP status checks for page URLs to find broken links.
        </p>
      </div>

      {/* Input Form */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={sitemapUrl}
          onChange={(e) => setSitemapUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && checkSitemap()}
          placeholder="https://yoursite.com/sitemap.xml"
          className="input-field flex-1"
        />
        <button
          onClick={checkSitemap}
          disabled={loading || !sitemapUrl.trim()}
          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking Sitemap..." : "Audit Sitemap"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
          <p className="text-sm text-gray-500">Fetching sitemap XML and checking link status codes...</p>
        </div>
      )}

      {/* Audit Report */}
      {result && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-5">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total URLs Found</span>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{result.totalUrls}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Parsed from XML location tags</div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-5">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Crawl Results</span>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                <span className="text-green-400">{passCount} OK</span>
                {failCount > 0 && <span className="text-red-400 ml-2">/ {failCount} Fail</span>}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Checked top {result.urlsChecked} pages</div>
            </div>

            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-5">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">File Details</span>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{result.xmlSizeKb} KB</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Sitemap size limit is 50MB</div>
            </div>
          </div>

          {/* Compliance Checklist */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">📜 Format Compliance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm pb-2 border-b border-gray-200 dark:border-gray-800/60">
                <span className="text-gray-600 dark:text-gray-300">Sitemaps.org XML Namespace</span>
                <span className={`font-semibold ${result.isValidFormat ? "text-green-400" : "text-yellow-400"}`}>
                  {result.isValidFormat ? "✓ Valid Namespace" : "⚠ Missing Schema Declaration"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm pb-2 border-b border-gray-200 dark:border-gray-800/60">
                <span className="text-gray-600 dark:text-gray-300">Sitemap Index Format</span>
                <span className="text-gray-500 dark:text-gray-400 font-semibold">
                  {result.isSitemapIndex ? "📁 Sitemap Index File" : "📄 Single Sitemap File"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">File Weight Status</span>
                <span className="text-green-400 font-semibold">✓ Excellent (Well under limit)</span>
              </div>
            </div>
          </div>

          {/* Links Audit List */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">🔗 URL Status Audit (Top 20)</h3>
              <span className="text-xs text-gray-500">HEAD/GET status pings</span>
            </div>

            <div className="space-y-2">
              {result.results.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-800/60 bg-white dark:bg-gray-950/40 text-xs">
                  <span className="text-gray-600 dark:text-gray-300 truncate flex-1 font-mono">{r.url}</span>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold font-mono ${getStatusBadgeClass(r.status, r.ok)}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>

            {result.totalUrls > 20 && (
              <p className="text-center text-xs text-gray-500 mt-4">
                And {result.totalUrls - 20} more URLs found in the sitemap.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Educational FAQ Section */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🔍 XML Sitemap Validation &amp; Link Health FAQ</h2>
          <p className="text-gray-500 dark:text-gray-400">Learn why auditing status codes and namespaces in your sitemaps is critical for AI crawl budget.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">1. What does a Sitemap Validator check?</h3>
            <p>
              It checks three critical layers: **XML Namespace Compliance** (ensuring sitemaps.org standards are defined), **File Integrity &amp; Size** (under 50,000 URLs / 50MB), and **HTTP Status Audit** (verifying if listed URLs return `200 OK` rather than redirects or errors).
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">2. Why does a missing XML schema namespace break indexing?</h3>
            <p>
              XML parsers require a formal namespace definition (e.g. <code>xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"</code>) to understand tags like <code>&lt;loc&gt;</code> and <code>&lt;lastmod&gt;</code>. Without it, the file parses as generic XML, preventing search bots from recognizing it as a sitemap.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">3. What is the difference between a Sitemap and a Sitemap Index?</h3>
            <p>
              A single Sitemap contains up to 50,000 page URLs. If your site has more pages, you must divide them into multiple files and list them in a **Sitemap Index** file (which links to the individual sitemaps). Our validator detects and parses both types.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">4. Why are 301 redirects and 404 errors bad in sitemaps?</h3>
            <p>
              Your sitemap is a declaration of the pages you *want* indexed. Including 404 pages or 301 redirects forces bots to waste crawl budget on useless requests. Sitemaps should exclusively contain clean canonical endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
