"use client";

import { useState } from "react";

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "warn" | "info";
  message: string;
  points: number;
  maxPoints: number;
}

interface ReadinessResponse {
  url: string;
  score: number;
  results: CheckResult[];
  totalPoints: number;
  maxTotal: number;
}

const statusConfig = {
  pass: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", icon: "✓" },
  fail: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: "✗" },
  warn: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "⚠" },
  info: { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: "ℹ" },
};

function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent — Your site is well-optimized for AI search";
  if (score >= 60) return "Good — Some improvements needed";
  if (score >= 40) return "Fair — Several areas need attention";
  return "Poor — Your site needs significant GEO improvements";
}

export default function AiReadinessCheckerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReadinessResponse | null>(null);
  const [error, setError] = useState("");

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/check-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to check readiness");
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
        <h1 className="text-3xl font-bold text-white mb-3">AI Readiness Checker</h1>
        <p className="text-lg text-gray-400">
          Enter your URL and get an instant 0–100 score showing how well AI search engines can read and cite your site.
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="https://yoursite.com"
          className="input-field flex-1"
        />
        <button
          onClick={check}
          disabled={loading || !url.trim()}
          className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Checking..." : "Check Now"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Empty state */}

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Score */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
            <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
              {result.score}
            </div>
            <div className="text-sm text-gray-400 mb-1">out of 100</div>
            <p className={`text-lg font-medium ${getScoreColor(result.score)}`}>
              {getScoreLabel(result.score)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Checked: {result.url}
            </p>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {result.results.map((check, i) => {
              const cfg = statusConfig[check.status];
              return (
                <div
                  key={i}
                  className={`rounded-lg border ${cfg.border} ${cfg.bg} p-4 flex items-start gap-3`}
                >
                  <span className={`text-lg ${cfg.color} flex-shrink-0`}>
                    {cfg.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white">
                        {check.name}
                      </h3>
                      <span className={`text-xs ${cfg.color}`}>
                        {check.points}/{check.maxPoints} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{check.message}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Badge CTA */}
          <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-6 text-center">
            <p className="text-white text-lg font-medium mb-2">
              🏆 Show off your score!
            </p>
            <p className="text-gray-400 text-base mb-4">
              Get an embeddable badge to display your AI Readiness Score on your website.
            </p>
            <a
              href={`/badge?score=${result.score}&url=${encodeURIComponent(result.url)}`}
              className="btn-primary inline-block"
            >
              Get Your Badge →
            </a>
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center">
            <p className="text-white font-medium mb-3">
              Want to improve your score?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/tools/llms-txt-generator" className="btn-secondary text-sm">
                Generate llms.txt
              </a>
              <a href="/tools/ai-robots-txt-generator" className="btn-secondary text-sm">
                Create AI robots.txt
              </a>
              <a href="/tools/schema-generator" className="btn-secondary text-sm">
                Add Schema Markup
              </a>
              <a href="/tools/geo-checklist" className="btn-secondary text-sm">
                View GEO Checklist
              </a>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && !error && (
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-500">
          <p className="text-sm">
            Enter your website URL above to check how well AI search engines like ChatGPT, Perplexity, and Google AI Overviews can read and cite your site.
          </p>
        </div>
      )}
    </div>
  );
}
