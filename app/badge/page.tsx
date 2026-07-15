"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BadgeContent() {
  const searchParams = useSearchParams();
  const [score, setScore] = useState(75);
  const [url, setUrl] = useState("https://yoursite.com");
  const [style, setStyle] = useState<"dark" | "light" | "gradient">("gradient");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = searchParams.get("score");
    const u = searchParams.get("url");
    if (s) setScore(Math.min(100, Math.max(0, Number(s))));
    if (u) setUrl(u);
  }, [searchParams]);

  const scoreColor =
    score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const scoreLabel =
    score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";

  const badgeUrl = `https://geokit.dev/api/badge?score=${score}&url=${encodeURIComponent(url)}&style=${style}`;

  const embedCode = `<a href="https://geokit.dev/tools/ai-readiness-checker?ref=badge" target="_blank" rel="noopener">
  <img src="${badgeUrl}" alt="AI Readiness Score: ${score}/100 — ${scoreLabel}" width="180" height="60" />
</a>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">AI Readiness Badge</h1>
        <p className="text-lg text-gray-400">
          Show your AI Readiness Score on your website with a free embeddable badge.
          When visitors click the badge, they&apos;ll link back to GEOKit — helping
          others discover GEO tools while showing off your score.
        </p>
      </div>

      {/* Badge Preview */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 mb-8 text-center">
        <div
          className="inline-flex items-center gap-3 rounded-xl px-6 py-3 shadow-lg"
          style={{
            background: style === "gradient"
              ? "linear-gradient(135deg, #1e293b, #0f172a)"
              : style === "light"
              ? "#f8fafc"
              : "#0f172a",
            border: `2px solid ${scoreColor}`,
          }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full text-xl font-bold"
            style={{ color: scoreColor, background: style === "light" ? "#e2e8f0" : "#1e293b" }}
          >
            {score}
          </div>
          <div className="text-left">
            <div
              className="text-sm font-bold"
              style={{ color: style === "light" ? "#1e293b" : "#e2e8f0" }}
            >
              AI Readiness Score
            </div>
            <div
              className="text-xs"
              style={{ color: scoreColor }}
            >
              {scoreLabel} · Verified by GEOKit
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-base font-medium text-gray-300 mb-2">
            Your Score (0-100)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0</span>
            <span className="text-white font-bold">{score}</span>
            <span>100</span>
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-gray-300 mb-2">
            Your Website URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yoursite.com"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-base font-medium text-gray-300 mb-2">
            Badge Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["gradient", "dark", "light"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStyle(s)}
                className={`rounded-lg border p-3 text-center text-base font-medium capitalize transition-colors ${
                  style === s
                    ? "border-brand-500 bg-brand-500/10 text-white"
                    : "border-gray-800 bg-gray-900/50 text-gray-400 hover:border-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Code */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium text-gray-300">Embed Code</h3>
          <button onClick={copyToClipboard} className="btn-secondary text-sm py-1.5 px-3">
            {copied ? "✓ Copied!" : "Copy Code"}
          </button>
        </div>
        <pre className="code-block whitespace-pre-wrap text-sm">{embedCode}</pre>

        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-base text-gray-400">
          <p className="mb-2 font-medium text-gray-300">How to use:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Run the <a href="/tools/ai-readiness-checker" className="text-brand-400 hover:underline">AI Readiness Checker</a> to get your real score</li>
            <li>Adjust the score slider above to match your result</li>
            <li>Choose a badge style that fits your site</li>
            <li>Copy the embed code and paste it into your website&apos;s HTML</li>
            <li>The badge links back to GEOKit — helping others discover GEO tools</li>
          </ol>
        </div>
      </div>

      {/* Link bait explanation */}
      <div className="mt-8 rounded-lg border border-brand-500/30 bg-brand-500/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">Why share your badge?</h3>
        <ul className="space-y-2 text-base text-gray-300">
          <li>• Show visitors your site is optimized for AI search</li>
          <li>• Build trust with an independently verified score</li>
          <li>• Help the GEO community grow by linking to free tools</li>
          <li>• Get a backlink from every site that displays the badge</li>
        </ul>
        <p className="mt-4 text-base text-brand-300">
          💡 Embedding the badge also helps AI crawlers like GPTBot and ClaudeBot recognize your site as AI-ready — the structured score signal reinforces your GEO optimization.
        </p>
      </div>
    </div>
  );
}

export default function BadgePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-12">Loading...</div>}>
      <BadgeContent />
    </Suspense>
  );
}
