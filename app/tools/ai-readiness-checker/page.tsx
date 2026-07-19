"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/components/i18n";

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

interface ScanHistoryItem {
  url: string;
  score: number;
  date: string;
  siteType: string;
}

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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"single" | "compare">("single");

  // Single mode state
  const [url, setUrl] = useState("");
  const [siteType, setSiteType] = useState<SiteType>("general");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReadinessResponse | null>(null);
  const [error, setError] = useState("");
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());

  // Compare mode state
  const [compUrl1, setCompUrl1] = useState("");
  const [compUrl2, setCompUrl2] = useState("");
  const [compSiteType, setCompSiteType] = useState<SiteType>("general");
  const [compLoading, setCompLoading] = useState(false);
  const [compResult1, setCompResult1] = useState<ReadinessResponse | null>(null);
  const [compResult2, setCompResult2] = useState<ReadinessResponse | null>(null);
  const [compError, setCompError] = useState("");

  // Scan History
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("geokit-readiness-history");
      if (stored) {
        try {
          setHistory(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const addToHistory = (urlStr: string, scoreVal: number, typeStr: string) => {
    const newItem: ScanHistoryItem = {
      url: urlStr,
      score: scoreVal,
      date: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      siteType: typeStr,
    };
    const updated = [newItem, ...history.slice(0, 9)];
    setHistory(updated);
    localStorage.setItem("geokit-readiness-history", JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("geokit-readiness-history");
  };

  const toggleCategory = (key: string) => {
    setExpandedCats((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const checkSingle = async () => {
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
        addToHistory(data.url, data.score, data.siteType);
        // Auto-expand failing categories
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

  const checkCompare = async () => {
    if (!compUrl1.trim() || !compUrl2.trim()) return;
    setCompLoading(true);
    setCompError("");
    setCompResult1(null);
    setCompResult2(null);
    try {
      const [res1, res2] = await Promise.all([
        fetch("/api/check-readiness", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: compUrl1, siteType: compSiteType }),
        }),
        fetch("/api/check-readiness", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: compUrl2, siteType: compSiteType }),
        }),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      if (!res1.ok || !res2.ok) {
        setCompError(data1.error || data2.error || "Failed to fetch comparison sites");
      } else {
        setCompResult1(data1);
        setCompResult2(data2);
      }
    } catch {
      setCompError("Network error during comparison scans.");
    } finally {
      setCompLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const categoriesHtml = result.categories
      .map(
        (cat) => `
        <div class="category">
          <div class="category-header">
            <h3>${cat.icon} ${cat.label}</h3>
            <span>${cat.score}%</span>
          </div>
          <div class="check-list">
            ${cat.results
              .map(
                (ch) => `
              <div class="check-item ${ch.status}">
                <span>${ch.status === "pass" ? "✓" : ch.status === "fail" ? "✗" : "⚠"}</span>
                <div>
                  <strong>${ch.name}</strong>
                  <p>${ch.message}</p>
                </div>
                <span class="pts">${Math.round(ch.weightedPoints)}/${Math.round(ch.weightedMax)}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>GEOKit AI Readiness Report - ${result.url}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111; margin: 30px; line-height: 1.5; }
            header { border-bottom: 2px solid #eaeaea; padding-bottom: 15px; margin-bottom: 20px; }
            h1 { margin: 0 0 5px 0; font-size: 24px; color: #0f172a; }
            .meta { color: #64748b; font-size: 13px; }
            .score-box { display: flex; align-items: center; gap: 20px; margin: 20px 0; padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; }
            .score-circle { font-size: 48px; font-weight: bold; color: ${
              result.score >= 80 ? "#22c55e" : result.score >= 50 ? "#eab308" : "#ef4444"
            }; }
            .category { margin-top: 25px; page-break-inside: avoid; }
            .category-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 12px; }
            .category-header h3 { margin: 0; font-size: 16px; color: #1e293b; }
            .check-list { display: flex; flex-direction: column; gap: 10px; }
            .check-item { display: flex; gap: 12px; font-size: 13px; padding: 8px 12px; border-radius: 6px; border: 1px solid #eaeaea; }
            .check-item.pass { border-left: 4px solid #22c55e; background: #f0fdf4; }
            .check-item.warn { border-left: 4px solid #eab308; background: #fefce8; }
            .check-item.fail { border-left: 4px solid #ef4444; background: #fef2f2; }
            .pts { margin-left: auto; font-weight: bold; color: #475569; }
            footer { margin-top: 40px; border-top: 1px solid #eaeaea; padding-top: 15px; text-align: center; color: #94a3b8; font-size: 11px; }
            @media print {
              body { margin: 0; }
              input, button { display: none; }
            }
          </style>
        </head>
        <body>
          <header>
            <h1>GEOKit AI Readiness Checker Report</h1>
            <div class="meta">Checked URL: <strong>${result.url}</strong> | Site Type: ${result.siteType.toUpperCase()} | Date: ${new Date().toLocaleDateString()}</div>
          </header>
          <div class="score-box">
            <div class="score-circle">${result.score}</div>
            <div>
              <div style="font-weight:bold;font-size:16px;">${getGrade(result.score)} Grade</div>
              <div style="color:#475569;font-size:14px;">${getScoreLabel(result.score)}</div>
            </div>
          </div>
          ${categoriesHtml}
          <footer>
            Generated by GEOKit (geokit.site) — Privacy-focused client-side evaluation tools.
          </footer>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 400);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">AI Readiness Checker</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          30+ checks across 7 categories. Audit your domain or run side-by-side competitor comparisons instantly.
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 gap-6 mb-6">
        <button
          onClick={() => setActiveTab("single")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "single" ? "border-brand-500 text-gray-900 dark:text-white" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200"
          }`}
        >
          🔍 Single Domain Audit
        </button>
        <button
          onClick={() => setActiveTab("compare")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "compare" ? "border-brand-500 text-gray-900 dark:text-white" : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200"
          }`}
        >
          ⚖️ Compare Domains
        </button>
      </div>

      {/* ── SINGLE AUDIT TAB ── */}
      {activeTab === "single" && (
        <div className="space-y-6 animate-fade-in">
          {/* Site Type Selector */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 block">
              Select your site type for optimized scoring:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SITE_TYPES.map((st) => (
                <button
                  key={st.key}
                  onClick={() => setSiteType(st.key)}
                  className={`rounded-lg border p-3 text-center transition-all duration-200 ${
                    siteType === st.key
                      ? "border-brand-500 bg-brand-500/10 text-gray-900 dark:text-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400 hover:border-gray-300 hover:text-gray-900 dark:hover:border-gray-500 dark:hover:text-gray-200"
                  }`}
                >
                  <div className="text-xl mb-1">{st.icon}</div>
                  <div className="text-xs font-medium">{st.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkSingle()}
              placeholder="https://yoursite.com"
              className="input-field flex-1"
            />
            <button
              onClick={checkSingle}
              disabled={loading || !url.trim()}
              className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Check Now"}
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
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
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-8">
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
                          <div className="flex justify-between text-gray-500 dark:text-gray-400 mb-0.5">
                            <span>{cat.icon} {cat.label}</span>
                            <span className={getScoreColor(cat.score)}>{cat.score}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
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
                      <button
                        onClick={() => toggleCategory(cat.key)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-gray-100 dark:bg-gray-800/30 transition-colors"
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{cat.label}</div>
                          <div className="text-xs text-gray-500">{passCount}/{total} passed</div>
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(cat.score)}`}>{cat.score}%</div>
                        <span className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>▼</span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-gray-200 dark:border-gray-800 divide-y divide-gray-800/50">
                          {cat.results.map((check, i) => {
                            const cfg = statusConfig[check.status];
                            return (
                              <div key={i} className="flex items-start gap-3 px-4 py-3">
                                <span className={`text-sm ${cfg.color} flex-shrink-0 mt-0.5 w-5 text-center`}>
                                  {cfg.icon}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{check.name}</h4>
                                    <span className={`text-xs ${cfg.color} flex-shrink-0 ml-2`}>
                                      {Math.round(check.weightedPoints)}/{Math.round(check.weightedMax)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{check.message}</p>
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

              {/* Badge & Print CTA */}
              <div className="rounded-xl border border-brand-500/40 bg-brand-500/10 p-6 text-center">
                <p className="text-gray-900 dark:text-white text-lg font-medium mb-2">🏆 Show off your score!</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                  Download a PDF scan report for your records or generate an embeddable score badge.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button onClick={handleDownloadReport} className="btn-secondary">
                    📄 Download Report
                  </button>
                  <a
                    href={`/badge?score=${result.score}&url=${encodeURIComponent(result.url)}`}
                    className="btn-primary"
                  >
                    Get Your Badge →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* History Chart & Trends */}
          {history.length > 1 && (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">📈 Scan Score Trend</h3>
                <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-red-400 transition-colors">
                  Clear history
                </button>
              </div>

              {/* SVG Line Chart */}
              <div className="w-full h-32 bg-white dark:bg-gray-950/40 rounded-lg p-2 relative overflow-hidden flex items-end">
                <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2" />
                  <line x1="0" y1="80" x2="100" y2="80" stroke="#1f2937" strokeWidth="0.5" strokeDasharray="2" />
                  
                  {/* Trend Path */}
                  <path
                    d={history
                      .slice()
                      .reverse()
                      .map((item, idx) => {
                        const x = (idx / (history.length - 1)) * 100;
                        const y = 100 - item.score; // Invert y since 0 is top
                        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
                      })
                      .join(" ")}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {/* Score Markers */}
                <div className="w-full flex justify-between px-2 z-10 text-[10px] text-gray-500 font-mono">
                  {history.slice().reverse().map((item, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-gray-900 dark:text-white font-bold mb-1">{item.score}</div>
                      <div>{item.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── COMPARE MODE TAB ── */}
      {activeTab === "compare" && (
        <div className="space-y-6 animate-fade-in">
          {/* Site Type Selector */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-3 block">
              Select site type for weight adjustments:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {SITE_TYPES.map((st) => (
                <button
                  key={st.key}
                  onClick={() => setCompSiteType(st.key)}
                  className={`rounded-lg border p-3 text-center transition-all duration-200 ${
                    compSiteType === st.key
                      ? "border-brand-500 bg-brand-500/10 text-gray-900 dark:text-white"
                      : "border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400 hover:border-gray-300 hover:text-gray-900 dark:hover:border-gray-500 dark:hover:text-gray-200"
                  }`}
                >
                  <div className="text-xl mb-1">{st.icon}</div>
                  <div className="text-xs font-medium">{st.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dual URL Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Your Website URL</label>
              <input
                type="text"
                value={compUrl1}
                onChange={(e) => setCompUrl1(e.target.value)}
                placeholder="https://yoursite.com"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Competitor Website URL</label>
              <input
                type="text"
                value={compUrl2}
                onChange={(e) => setCompUrl2(e.target.value)}
                placeholder="https://competitor.com"
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={checkCompare}
              disabled={compLoading || !compUrl1.trim() || !compUrl2.trim()}
              className="btn-primary disabled:opacity-50"
            >
              {compLoading ? "Running Audits..." : "Run Comparison"}
            </button>
          </div>

          {compError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
              {compError}
            </div>
          )}

          {compLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
              <p className="text-sm text-gray-500">Auditing both sites simultaneously...</p>
            </div>
          )}

          {/* Comparison Results */}
          {compResult1 && compResult2 && !compLoading && (
            <div className="space-y-6">
              {/* Score Rings Side-By-Side */}
              <div className="grid grid-cols-2 gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-6 text-center">
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 truncate">{compResult1.url}</h4>
                  <div className="relative inline-block">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke={compResult1.score >= 80 ? "#4ade80" : compResult1.score >= 50 ? "#facc15" : "#f87171"}
                        strokeWidth="8"
                        strokeDasharray={`${compResult1.score * 2.64} 264`}
                        transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="58" textAnchor="middle" className="text-xl font-bold" fill="white">{compResult1.score}</text>
                    </svg>
                  </div>
                  <div className={`text-xs font-bold mt-2 ${getScoreColor(compResult1.score)}`}>
                    Grade: {getGrade(compResult1.score)}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 truncate">{compResult2.url}</h4>
                  <div className="relative inline-block">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42"
                        fill="none"
                        stroke={compResult2.score >= 80 ? "#4ade80" : compResult2.score >= 50 ? "#facc15" : "#f87171"}
                        strokeWidth="8"
                        strokeDasharray={`${compResult2.score * 2.64} 264`}
                        transform="rotate(-90 50 50)"
                      />
                      <text x="50" y="58" textAnchor="middle" className="text-xl font-bold" fill="white">{compResult2.score}</text>
                    </svg>
                  </div>
                  <div className={`text-xs font-bold mt-2 ${getScoreColor(compResult2.score)}`}>
                    Grade: {getGrade(compResult2.score)}
                  </div>
                </div>
              </div>

              {/* Category Gap Breakdown Table */}
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">⚖️ Category Comparison</h3>
                <div className="space-y-4">
                  {compResult1.categories.map((cat1) => {
                    const cat2 = compResult2.categories.find((c) => c.key === cat1.key);
                    const score1 = cat1.score;
                    const score2 = cat2 ? cat2.score : 0;
                    const diff = score1 - score2;

                    return (
                      <div key={cat1.key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-gray-800/60 pb-3 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cat1.icon}</span>
                          <span className="text-xs font-medium text-gray-900 dark:text-white">{cat1.label}</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs">
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 mr-2">You:</span>
                            <span className={`font-semibold ${getScoreColor(score1)}`}>{score1}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500 dark:text-gray-400 mr-2">Competitor:</span>
                            <span className={`font-semibold ${getScoreColor(score2)}`}>{score2}%</span>
                          </div>
                          <div className="w-16 text-right">
                            {diff > 0 ? (
                              <span className="text-green-400 font-bold">+{diff}% ▲</span>
                            ) : diff < 0 ? (
                              <span className="text-red-400 font-bold">{diff}% ▼</span>
                            ) : (
                              <span className="text-gray-500 font-semibold">Tied</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!result && !compResult1 && !loading && !compLoading && !error && !compError && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-8 text-center text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-sm mb-2">
            Enter your website URL above to run a comprehensive AI readiness audit.
          </p>
          <p className="text-xs text-gray-600">
            We check 30+ factors across 7 categories including AI crawler access, structured data, content quality, security, and AI agent readiness.
          </p>
        </div>
      )}

      {/* Educational FAQ Section */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">📊 AI Readiness Assessment Pillars &amp; FAQ</h2>
          <p className="text-gray-500 dark:text-gray-400">Discover the details behind our 30+ audit checks and how to optimize your site for Large Language Models.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">🛡️ 1. AI Crawler Access</h3>
            <p>
              AI models rely on web scrapers to build training corpuses or fetch real-time search context. We check if your <code>robots.txt</code> allows crawlers like <code>GPTBot</code> or <code>ClaudeBot</code>. Blocking these bots keeps your content secure but prevents your brand from being cited in answers.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">💎 2. Structured JSON-LD Schema</h3>
            <p>
              Schema markup provides clear semantic context. AI search engines are 3x more likely to cite pages with well-defined <code>FAQPage</code>, <code>Product</code>, or <code>Person</code> schemas because they present answers in pre-parsed, structured blocks.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">✏️ 3. Content Structure &amp; Depth</h3>
            <p>
              AI models evaluate content depth and heading clarity. We analyze heading levels (H1-H6), word counts, readability (mix of short/long sentences), and keyword density to ensure your content is authoritative and easy to index.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">📑 4. Machine-Readable Files</h3>
            <p>
              Modern AI agents search for specific helper files at your domain root. We scan for the existence of <code>llms.txt</code> (high-level index) and <code>llms-full.txt</code> (full plain text corpus) to check if your site provides an optimized road map.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">🔒 5. Technical &amp; SSR Rendering</h3>
            <p>
              Many crawlers do not execute JavaScript. If your website relies entirely on Client-Side Rendering (SPA), bots will fetch an empty page. We check for Server-Side Rendering (SSR) signals and security headers to confirm bots can access your site.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">🔗 6. How can I improve my score?</h3>
            <p>
              Start by defining a clear <code>llms.txt</code> file at your root, adding structured <code>FAQPage</code> and <code>Organization</code> schemas, and ensuring your site content doesn't rely entirely on client-side JS rendering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
