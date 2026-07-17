"use client";

import { useState } from "react";

/* ── Types ── */
interface WeightedCheckResult {
  name: string;
  category: string;
  status: "pass" | "fail" | "warn" | "info";
  message: string;
  points: number;
  maxPoints: number;
  weightedPoints: number;
  weightedMax: number;
}

interface CategoryGroup {
  key: string;
  label: string;
  icon: string;
  score: number;
  results: WeightedCheckResult[];
}

interface ReadinessResponse {
  url: string;
  siteType: string;
  score: number;
  categories: CategoryGroup[];
  results: WeightedCheckResult[];
  totalPoints: number;
  maxTotal: number;
  checkCount: number;
}

type SiteType = "general" | "blog" | "ecommerce" | "saas" | "api";

const SITE_TYPES: { key: SiteType; label: string; icon: string; desc: string }[] = [
  { key: "general", label: "General", icon: "🌐", desc: "Default balanced scoring" },
  { key: "blog", label: "Blog / Content", icon: "📝", desc: "Content & readability focused" },
  { key: "ecommerce", label: "E-commerce", icon: "🛒", desc: "Product schema & trust focused" },
  { key: "saas", label: "SaaS", icon: "💻", desc: "Technical & agent readiness focused" },
  { key: "api", label: "API / Developer", icon: "⚡", desc: "API & machine readability focused" },
];

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

function getScoreBorderColor(score: number) {
  if (score >= 80) return "border-green-500/30";
  if (score >= 50) return "border-yellow-500/30";
  return "border-red-500/30";
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent — Your site is well-optimized for AI search";
  if (score >= 60) return "Good — Some improvements needed";
  if (score >= 40) return "Fair — Several areas need attention";
  return "Poor — Your site needs significant GEO improvements";
}

function getGrade(score: number) {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C";
  if (score >= 40) return "D";
  return "F";
}

export default function AiReadinessCheckerPage() {
  const [url, setUrl] = useState("");
  const [siteType, setSiteType] = useState<SiteType>("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReadinessResponse | null>(null);
  const [error, setError] = useState("");
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  const toggleCategory = (key: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const check = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setExpandedCats(new Set());
    try {
      const res = await fetch("/api/check-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, siteType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to check readiness");
      } else {
        setResult(data);
        // Auto-expand categories with issues
        const issues = new Set<string>();
        for (const cat of data.categories) {
          if (cat.score < 80) issues.add(cat.key);
        }
        setExpandedCats(issues);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;

    const statusIcon = (s: string) => {
      switch (s) {
        case "pass": return "✓";
        case "fail": return "✗";
        case "warn": return "⚠";
        case "info": return "ℹ";
        default: return "";
      }
    };

    const statusColor = (s: string) => {
      switch (s) {
        case "pass": return "#16a34a";
        case "fail": return "#dc2626";
        case "warn": return "#ca8a04";
        case "info": return "#2563eb";
        default: return "#333";
      }
    };

    const scoreBarColor = (score: number) => {
      if (score >= 80) return "#16a34a";
      if (score >= 50) return "#ca8a04";
      return "#dc2626";
    };

    const categoriesHtml = result.categories
      .map(
        (cat) => `
        <div class="category">
          <div class="cat-header">
            <span class="cat-title">${cat.icon} ${cat.label}</span>
            <span class="cat-score" style="color: ${scoreBarColor(cat.score)}">${cat.score}%</span>
          </div>
          <div class="cat-bar-bg"><div class="cat-bar" style="width: ${cat.score}%; background: ${scoreBarColor(cat.score)}"></div></div>
          <table class="checks">
            <tbody>
              ${cat.results
                .map(
                  (c) => `
                <tr>
                  <td class="status-icon" style="color: ${statusColor(c.status)}">${statusIcon(c.status)}</td>
                  <td class="check-name">${c.name}</td>
                  <td class="check-score" style="color: ${statusColor(c.status)}">${Math.round(c.weightedPoints)}/${Math.round(c.weightedMax)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td colspan="2" class="check-msg">${c.message}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>`
      )
      .join("");

    const reportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>AI Readiness Report — ${result.url}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; line-height: 1.5; max-width: 800px; margin: 0 auto; }
    .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px; }
    .header h1 { font-size: 22px; font-weight: 700; color: #111; margin-bottom: 4px; }
    .header .meta { font-size: 13px; color: #6b7280; }
    .score-section { display: flex; align-items: center; gap: 24px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 28px; background: #f9fafb; }
    .score-circle { width: 100px; height: 100px; border-radius: 50%; border: 6px solid ${scoreBarColor(result.score)}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
    .score-circle .num { font-size: 32px; font-weight: 700; color: ${scoreBarColor(result.score)}; line-height: 1; }
    .score-circle .grade { font-size: 14px; color: #6b7280; margin-top: 2px; }
    .score-detail h2 { font-size: 16px; font-weight: 600; color: #111; margin-bottom: 4px; }
    .score-detail p { font-size: 13px; color: #6b7280; }
    .category { margin-bottom: 20px; page-break-inside: avoid; }
    .cat-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .cat-title { font-size: 15px; font-weight: 600; color: #111; }
    .cat-score { font-size: 15px; font-weight: 700; }
    .cat-bar-bg { height: 6px; background: #e5e7eb; border-radius: 3px; margin-bottom: 10px; overflow: hidden; }
    .cat-bar { height: 100%; border-radius: 3px; }
    .checks { width: 100%; border-collapse: collapse; }
    .checks td { padding: 3px 6px; vertical-align: top; font-size: 13px; }
    .status-icon { width: 20px; text-align: center; font-weight: 700; }
    .check-name { font-weight: 500; color: #1a1a1a; }
    .check-score { text-align: right; font-weight: 600; white-space: nowrap; }
    .check-msg { color: #6b7280; font-size: 12px; padding-bottom: 8px; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
    @media print {
      body { padding: 20px; }
      .category { page-break-inside: avoid; }
      .score-section { background: #f9fafb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .cat-bar, .cat-bar-bg { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>GEOKit AI Readiness Report</h1>
    <div class="meta">${result.url} · ${reportDate} · Site type: ${result.siteType}</div>
  </div>

  <div class="score-section">
    <div class="score-circle">
      <span class="num">${result.score}</span>
      <span class="grade">${getGrade(result.score)}</span>
    </div>
    <div class="score-detail">
      <h2>${getScoreLabel(result.score)}</h2>
      <p>${result.checkCount} checks completed · ${result.totalPoints}/${result.maxTotal} weighted points</p>
    </div>
  </div>

  ${categoriesHtml}

  <div class="footer">Generated by GEOKit — geokit.site</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      setTimeout(() => {
        win.print();
      }, 400);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">AI Readiness Checker</h1>
        <p className="text-lg text-gray-400">
          30+ checks across 7 categories. Get an instant 0–100 score showing how well AI search engines can read and cite your site.
        </p>
      </div>

      {/* Site Type Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-300 mb-3 block">
          Select your site type for optimized scoring:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {SITE_TYPES.map((st) => (
            <button
              key={st.key}
              onClick={() => setSiteType(st.key)}
              className={`rounded-lg border p-3 text-center transition-all duration-200 ${
                siteType === st.key
                  ? "border-brand-500 bg-brand-500/10 text-white"
                  : "border-gray-700 bg-gray-900/50 text-gray-400 hover:border-gray-500 hover:text-gray-200"
              }`}
            >
              <div className="text-xl mb-1">{st.icon}</div>
              <div className="text-xs font-medium">{st.label}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {SITE_TYPES.find((s) => s.key === siteType)?.desc}
        </p>
      </div>

      {/* URL Input */}
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

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
          <p className="text-sm text-gray-500">Running 30+ checks across 7 categories...</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Score Header */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Score Circle */}
              <div className="relative flex-shrink-0">
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="70" cy="70" r="60"
                    fill="none"
                    stroke={result.score >= 80 ? "#4ade80" : result.score >= 50 ? "#facc15" : "#f87171"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${result.score * 3.77} 377`}
                    transform="rotate(-90 70 70)"
                    style={{ transition: "stroke-dasharray 1s ease" }}
                  />
                  <text x="70" y="62" textAnchor="middle" className="text-3xl font-bold" fill="white" fontSize="36">{result.score}</text>
                  <text x="70" y="85" textAnchor="middle" fill="#9ca3af" fontSize="13">{getGrade(result.score)}</text>
                </svg>
              </div>

              {/* Summary */}
              <div className="flex-1 text-center md:text-left">
                <p className={`text-lg font-semibold ${getScoreColor(result.score)} mb-1`}>
                  {getScoreLabel(result.score)}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  {result.checkCount} checks completed • {result.url}
                </p>
                {/* Category Mini Bars */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                  {result.categories.map((cat) => (
                    <div key={cat.key} className="text-xs">
                      <div className="flex justify-between text-gray-400 mb-0.5">
                        <span>{cat.icon} {cat.label}</span>
                        <span className={getScoreColor(cat.score)}>{cat.score}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${cat.score}%`,
                            backgroundColor: cat.score >= 80 ? "#4ade80" : cat.score >= 50 ? "#facc15" : "#f87171",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Accordion */}
          <div className="space-y-3">
            {result.categories.map((cat) => {
              const isOpen = expandedCats.has(cat.key);
              const passCount = cat.results.filter((r) => r.status === "pass").length;
              const total = cat.results.length;

              return (
                <div key={cat.key} className={`rounded-xl border ${getScoreBorderColor(cat.score)} bg-gray-900/50 overflow-hidden`}>
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(cat.key)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-gray-800/30 transition-colors"
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium text-white">{cat.label}</div>
                      <div className="text-xs text-gray-500">{passCount}/{total} passed</div>
                    </div>
                    <div className={`text-lg font-bold ${getScoreColor(cat.score)}`}>{cat.score}%</div>
                    <span className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>

                  {/* Category Items */}
                  {isOpen && (
                    <div className="border-t border-gray-800 divide-y divide-gray-800/50">
                      {cat.results.map((check, i) => {
                        const cfg = statusConfig[check.status];
                        return (
                          <div key={i} className="flex items-start gap-3 px-4 py-3">
                            <span className={`text-sm ${cfg.color} flex-shrink-0 mt-0.5 w-5 text-center`}>
                              {cfg.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-0.5">
                                <h4 className="text-sm font-medium text-white truncate">{check.name}</h4>
                                <span className={`text-xs ${cfg.color} flex-shrink-0 ml-2`}>
                                  {Math.round(check.weightedPoints)}/{Math.round(check.weightedMax)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">{check.message}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
            <button
              onClick={handleDownloadReport}
              className="btn-secondary inline-block ml-3"
            >
              📄 Download Report
            </button>
          </div>

          {/* Improvement CTAs */}
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
              <a href="/tools/schema-validator" className="btn-secondary text-sm">
                Validate Schema
              </a>
              <a href="/tools/geo-score" className="btn-secondary text-sm">
                Check GEO Score
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
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm mb-2">
            Enter your website URL above to run a comprehensive AI readiness audit.
          </p>
          <p className="text-xs text-gray-600">
            We check 30+ factors across 7 categories including AI crawler access, structured data, content quality, security, and AI agent readiness.
          </p>
        </div>
      )}
    </div>
  );
}
