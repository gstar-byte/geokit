"use client";

import { useState } from "react";

interface SitemapUrl {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}

function generateSitemap(urls: SitemapUrl[], baseUrl: string): string {
  const validUrls = urls.filter((u) => u.url.trim());
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const u of validUrls) {
    xml += "  <url>\n";
    const fullUrl = u.url.startsWith("http") ? u.url : `${baseUrl.replace(/\/$/, "")}${u.url.startsWith("/") ? "" : "/"}${u.url}`;
    xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
    if (u.lastmod) xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
    if (u.changefreq) xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
    if (u.priority) xml += `    <priority>${u.priority}</priority>\n`;
    xml += "  </url>\n";
  }

  xml += "</urlset>\n";
  return xml;
}

function escapeXml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export default function AiSitemapGeneratorPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [urls, setUrls] = useState<SitemapUrl[]>([
    { url: "/", lastmod: "", changefreq: "weekly", priority: "1.0" },
    { url: "", lastmod: "", changefreq: "monthly", priority: "0.8" },
  ]);
  const [copied, setCopied] = useState(false);

  // Import Sitemap state
  const [importUrl, setImportUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");

  const handleImport = async () => {
    if (!importUrl.trim()) return;
    setImportLoading(true);
    setImportError("");
    setImportSuccess("");
    try {
      const res = await fetch("/api/check-sitemap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitemapUrl: importUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setImportError(data.error || "Failed to parse sitemap.");
      } else if (data.urls && data.urls.length > 0) {
        // Set Base URL if empty
        let parsedBase = baseUrl;
        try {
          const firstUrlObj = new URL(data.urls[0]);
          parsedBase = `${firstUrlObj.protocol}//${firstUrlObj.hostname}`;
          if (!baseUrl) {
            setBaseUrl(parsedBase);
          }
        } catch {}

        // Map imported urls
        const importedUrls: SitemapUrl[] = data.urls.map((rawUrl: string) => {
          let relUrl = rawUrl;
          if (parsedBase && rawUrl.startsWith(parsedBase)) {
            relUrl = rawUrl.substring(parsedBase.length);
            if (!relUrl.startsWith("/")) {
              relUrl = "/" + relUrl;
            }
          }
          return {
            url: relUrl,
            lastmod: new Date().toISOString().split("T")[0],
            changefreq: "weekly",
            priority: "0.8",
          };
        });

        setUrls(importedUrls);
        setImportSuccess(`✓ Successfully imported ${importedUrls.length} URLs!`);
        setImportUrl("");
      } else {
        setImportError("No URLs found in the sitemap.");
      }
    } catch {
      setImportError("Failed to fetch and load sitemap.");
    } finally {
      setImportLoading(false);
    }
  };

  const output = generateSitemap(urls, baseUrl || "https://yoursite.com");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([output], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sitemap.xml";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateUrl = (i: number, field: keyof SitemapUrl, value: string) => {
    setUrls(urls.map((u, idx) => (idx === i ? { ...u, [field]: value } : u)));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">AI Sitemap Generator</h1>
        <p className="text-lg text-gray-400">
          Generate an XML sitemap optimized for AI crawlers. Set priority hints and update frequencies to help GPTBot, ClaudeBot, and other AI models discover your most important pages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Import Section */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/30 p-5 space-y-3">
            <label className="block text-sm font-semibold text-white">
              📥 Import from existing Sitemap
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={importUrl}
                onChange={(e) => setImportUrl(e.target.value)}
                placeholder="https://example.com/sitemap.xml"
                className="input-field flex-1 text-sm"
              />
              <button
                onClick={handleImport}
                disabled={importLoading || !importUrl.trim()}
                className="btn-secondary whitespace-nowrap text-sm disabled:opacity-50"
              >
                {importLoading ? "Importing..." : "Import"}
              </button>
            </div>
            {importError && (
              <p className="text-xs text-red-400">{importError}</p>
            )}
            {importSuccess && (
              <p className="text-xs text-green-400">{importSuccess}</p>
            )}
            <p className="text-xs text-gray-500">
              Quickly load all URLs from your current sitemap to edit, add priority markers, and customize.
            </p>
          </div>

          <div>
            <label className="block text-base font-medium text-gray-300 mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://yoursite.com"
              className="input-field"
            />
            <p className="text-sm text-gray-500 mt-2">
              Relative URLs (like /about) will be prefixed with this base URL.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-base font-medium text-gray-300">
                URLs ({urls.filter((u) => u.url.trim()).length})
              </label>
              <button
                onClick={() => setUrls([...urls, { url: "", lastmod: "", changefreq: "monthly", priority: "0.8" }])}
                className="text-base text-brand-400 hover:text-brand-300"
              >
                + Add URL
              </button>
            </div>

            <div className="space-y-3">
              {urls.map((u, i) => (
                <div key={i} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">URL {i + 1}</span>
                    {urls.length > 1 && (
                      <button
                        onClick={() => setUrls(urls.filter((_, idx) => idx !== i))}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={u.url}
                    onChange={(e) => updateUrl(i, "url", e.target.value)}
                    placeholder="/ or /about or https://yoursite.com/page"
                    className="input-field"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Last Modified</label>
                      <input
                        type="date"
                        value={u.lastmod}
                        onChange={(e) => updateUrl(i, "lastmod", e.target.value)}
                        className="input-field text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Change Freq</label>
                      <select
                        value={u.changefreq}
                        onChange={(e) => updateUrl(i, "changefreq", e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="" className="bg-gray-800">—</option>
                        <option value="always" className="bg-gray-800">always</option>
                        <option value="hourly" className="bg-gray-800">hourly</option>
                        <option value="daily" className="bg-gray-800">daily</option>
                        <option value="weekly" className="bg-gray-800">weekly</option>
                        <option value="monthly" className="bg-gray-800">monthly</option>
                        <option value="yearly" className="bg-gray-800">yearly</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Priority</label>
                      <select
                        value={u.priority}
                        onChange={(e) => updateUrl(i, "priority", e.target.value)}
                        className="input-field text-sm"
                      >
                        <option value="" className="bg-gray-800">—</option>
                        <option value="1.0" className="bg-gray-800">1.0</option>
                        <option value="0.9" className="bg-gray-800">0.9</option>
                        <option value="0.8" className="bg-gray-800">0.8</option>
                        <option value="0.7" className="bg-gray-800">0.7</option>
                        <option value="0.6" className="bg-gray-800">0.6</option>
                        <option value="0.5" className="bg-gray-800">0.5</option>
                        <option value="0.4" className="bg-gray-800">0.4</option>
                        <option value="0.3" className="bg-gray-800">0.3</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-300">Preview</h3>
            <div className="flex gap-2">
              <button onClick={copyToClipboard} className="btn-secondary text-sm py-1.5 px-3">
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <button onClick={download} className="btn-primary text-sm py-1.5 px-3">
                Download
              </button>
            </div>
          </div>
          <pre className="code-block min-h-[400px] whitespace-pre-wrap">{output}</pre>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-base text-gray-400">
            <p className="mb-2 font-medium text-gray-300">How to deploy:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Download as <code className="text-brand-400">sitemap.xml</code></li>
              <li>Upload to your website root directory</li>
              <li>Reference it in <code className="text-brand-400">robots.txt</code>: <code className="text-brand-400">Sitemap: https://yoursite.com/sitemap.xml</code></li>
              <li>Submit in Google Search Console</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
