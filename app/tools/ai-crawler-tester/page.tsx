"use client";

import { useState } from "react";

interface CrawlerResult {
  crawler: string;
  perspective: string;
  findings: string[];
}

interface CrawlResponse {
  url: string;
  fetchStatus: number;
  results: CrawlerResult[];
  textPreview: string;
}

const crawlerColors: Record<string, string> = {
  "GPTBot (OpenAI)": "text-green-400 border-green-500/30 bg-green-500/5",
  "ClaudeBot (Anthropic)": "text-orange-400 border-orange-500/30 bg-orange-500/5",
  "PerplexityBot": "text-purple-400 border-purple-500/30 bg-purple-500/5",
  "Technical Summary": "text-blue-400 border-blue-500/30 bg-blue-500/5",
};

export default function AiCrawlerTesterPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CrawlResponse | null>(null);
  const [error, setError] = useState("");

  const test = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/crawl-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to test page");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">AI Crawler Tester</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Enter your URL and see exactly how AI crawlers (GPTBot, ClaudeBot, PerplexityBot) perceive your page. Find out what content they can extract and what they&apos;re missing.
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && test()}
          placeholder="https://yoursite.com"
          className="input-field flex-1"
        />
        <button
          onClick={test}
          disabled={loading || !url.trim()}
          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Crawling..." : "Test Page"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-base mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {result.results.map((r, i) => (
            <div
              key={i}
              className={`rounded-xl border p-6 ${crawlerColors[r.crawler] || "border-gray-800 bg-gray-900/50"}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {r.crawler}
                </h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{r.perspective}</p>
              <ul className="space-y-2">
                {r.findings.map((f, j) => (
                  <li key={j} className="text-base text-gray-600 dark:text-gray-300 flex items-start gap-2">
                    <span className="text-gray-500 flex-shrink-0">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Text preview */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Extracted Text Preview (first 500 chars)
            </h3>
            <p className="text-base text-gray-500 dark:text-gray-400 font-mono leading-relaxed">
              {result.textPreview || "No text could be extracted."}
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 p-6 text-center">
            <p className="text-gray-900 dark:text-white font-medium mb-3 text-lg">
              Want to improve how AI sees your site?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/tools/llms-txt-generator" className="btn-secondary text-sm">Generate llms.txt</a>
              <a href="/tools/schema-generator" className="btn-secondary text-sm">Add Schema Markup</a>
              <a href="/tools/meta-tag-generator" className="btn-secondary text-sm">Create Meta Tags</a>
              <a href="/tools/ai-readiness-checker" className="btn-secondary text-sm">Check AI Readiness</a>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-8 text-center text-gray-500">
          <p className="text-base">
            Enter your website URL above to see how AI crawlers perceive your page. We&apos;ll simulate GPTBot, ClaudeBot, and PerplexityBot perspectives and show you exactly what content they can extract.
          </p>
        </div>
      )}

      {/* Educational FAQ Section */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🕷️ AI Crawler Behavior &amp; Crawlability FAQ</h2>
          <p className="text-gray-500 dark:text-gray-400">Discover how search bots and AI agents read your website and how to fix accessibility gaps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">1. Do AI crawlers execute JavaScript?</h3>
            <p>
              Generally, **no**. Unlike Googlebot (which has a rendering queue to execute JS), AI crawlers (like GPTBot, ClaudeBot, and PerplexityBot) fetch raw HTML directly to save compute. If your site relies on client-side JS (like standard SPA React/Vue), the bot sees an empty page. You should use SSR (Server-Side Rendering) or pre-rendering.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">2. Which AI bots are simulated by this tester?</h3>
            <p>
              We simulate three core perspectives: **GPTBot** (OpenAI's primary scraping bot), **ClaudeBot / Claude-Web** (Anthropic's indexer), and **PerplexityBot** (Perplexity's real-time retrieval crawler). This shows you how these distinct entities read your page structure.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">3. Why does PerplexityBot prioritize canonicals and schemas?</h3>
            <p>
              Perplexity functions as an answer engine that pulls real-time sources. It uses the <code>canonical URL</code> to ensure it cites the primary authority page, and parses structured data (like FAQ schema) to pull direct question-answer blocks to generate citations.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">4. How do I block crawlers if I don't want them scraping my site?</h3>
            <p>
              You can add Disallow rules in your <code>robots.txt</code> file for user-agents like <code>GPTBot</code> or <code>ClaudeBot</code>. To block all AI scrapers globally, you can block their known IP ranges or user-agents using a WAF (Web Application Firewall).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
