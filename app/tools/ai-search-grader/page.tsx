"use client";

import { useState, useEffect } from "react";

interface CompetitorData {
  name: string;
  visibility: number;
  averageRanking: number | null;
  score: number;
}

interface ModelSummary {
  id: string;
  name: string;
  marketShare: number;
  free: boolean;
  brandVisibility: number;
  brandAverageRanking: number | null;
  brandAppearedIn: number;
  brandTotalPrompts: number;
  brandScore: number;
  competitorData: CompetitorData[];
  error?: string;
  sampleResponse: string;
}

interface GraderResponse {
  brand: string;
  niche: string;
  prompts: string[];
  modelSummaries: ModelSummary[];
  overallScore: number;
  competitorOverallScores: { name: string; score: number }[];
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function getScoreBg(score: number) {
  if (score >= 70) return "border-green-500/30 bg-green-500/10";
  if (score >= 40) return "border-yellow-500/30 bg-yellow-500/10";
  return "border-red-500/30 bg-red-500/10";
}

function getScoreLabel(score: number) {
  if (score >= 70) return "Excellent — Your brand is highly visible in AI search";
  if (score >= 40) return "Moderate — Your brand appears but not consistently";
  if (score > 0) return "Low — Your brand rarely appears in AI answers";
  return "No visibility — Your brand was not mentioned by any AI model";
}

export default function AiSearchGraderPage() {
  const [brand, setBrand] = useState("");
  const [niche, setNiche] = useState("");
  const [competitors, setCompetitors] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GraderResponse | null>(null);
  const [error, setError] = useState("");
  const [showPrompts, setShowPrompts] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const [serverHasKey, setServerHasKey] = useState<boolean | null>(null);
  const [serverProvider, setServerProvider] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  useEffect(() => {
    fetch("/api/ai-search-grader/status")
      .then((r) => r.json())
      .then((data) => {
        setServerHasKey(data.hasApiKey);
        setServerProvider(data.provider);
      })
      .catch(() => setServerHasKey(false));
  }, []);

  const grade = async () => {
    if (!brand.trim() || !niche.trim()) return;
    if (!serverHasKey && !apiKey.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    const modelNames =
      serverProvider === "google"
        ? ["Gemini 2.0 Flash", "Gemini 2.0 Flash Lite", "Gemini 1.5 Flash"]
        : ["ChatGPT", "Google Gemini", "Claude", "Meta Llama", "Mistral", "DeepSeek"];
    const estimatedMs = serverProvider === "google" ? 15000 : 25000;

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        const next = p + 100 / (estimatedMs / 200);
        return next >= 95 ? 95 : next;
      });
    }, 200);

    const statusInterval = setInterval(() => {
      const model = modelNames[Math.floor(Date.now() / 3000) % modelNames.length];
      setStatusText(`Querying ${model}...`);
    }, 3000);

    setStatusText(`Querying ${modelNames[0]}...`);

    try {
      const res = await fetch("/api/ai-search-grader", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: brand.trim(),
          niche: niche.trim(),
          competitors: competitors.trim(),
          apiKey: apiKey.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to grade brand");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
      setProgress(100);
      setStatusText("Analysis complete");
      setLoading(false);
    }
  };

  const allScores = result
    ? [
        { name: result.brand, score: result.overallScore, isBrand: true },
        ...result.competitorOverallScores.map((c) => ({
          name: c.name,
          score: c.score,
          isBrand: false,
        })),
      ].sort((a, b) => b.score - a.score)
    : [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">
          AI Search Grader — Test Your Brand Visibility in ChatGPT, Gemini &amp; Claude
        </h1>
        <p className="text-lg text-gray-400">
          Enter your brand name and niche to see how visible you are across AI search engines.
          We&apos;ll query 6 AI models with niche prompts and measure your brand&apos;s visibility, ranking, and share of voice vs competitors.
        </p>
      </div>

      {/* Input form */}
      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Brand Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. GEOKit"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Niche / Product Description <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. SEO tools for AI search optimization"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            Competitors (optional, comma-separated)
          </label>
          <input
            type="text"
            value={competitors}
            onChange={(e) => setCompetitors(e.target.value)}
            placeholder="e.g. Ahrefs, SEMrush, Moz"
            className="input-field"
          />
        </div>

        {serverHasKey === false && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              API Key <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Google AI Studio key (AIza...) or OpenRouter key (sk-or-v1-...)"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1.5">
              Get a free key from{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 underline"
              >
                Google AI Studio
              </a>{" "}
              (tests 3 Gemini models) or{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 underline"
              >
                OpenRouter
              </a>{" "}
              (tests 6 models including ChatGPT, Claude, Gemini). Your key is sent only to our API route and never stored.
            </p>
          </div>
        )}

        <button
          onClick={grade}
          disabled={loading || !brand.trim() || !niche.trim() || (!serverHasKey && !apiKey.trim())}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Querying AI models..." : "Grade My AI Visibility"}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 space-y-5">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500" />
          </div>
          <div className="text-center">
            <p className="text-brand-400 font-medium text-base mb-1">{statusText}</p>
            <p className="text-gray-500 text-sm">
              Sending 5 prompts to {serverProvider === "google" ? "3 Gemini" : "6"} AI models
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-2.5 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-200 ease-linear"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Est. time: {serverProvider === "google" ? "10-15" : "15-30"} seconds</span>
              <span>{Math.round(Math.min(progress, 100))}%</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-600">
            Free-tier models may take longer during peak hours. Paid models usually respond faster.
          </p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className={`rounded-xl border p-8 text-center ${getScoreBg(result.overallScore)}`}>
            <div className="text-sm text-gray-400 mb-2">AI Search Score for</div>
            <div className="text-xl font-semibold text-white mb-3">{result.brand}</div>
            <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)} mb-2`}>
              {result.overallScore}
            </div>
            <div className="text-sm text-gray-400 mb-1">out of 100</div>
            <p className={`text-base font-medium ${getScoreColor(result.overallScore)}`}>
              {getScoreLabel(result.overallScore)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Niche: {result.niche} · Tested across {result.modelSummaries.filter((m) => !m.error).length} AI models
            </p>
          </div>

          {/* Competitor Comparison */}
          {allScores.length > 1 && (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Brand vs Competitors</h3>
              <div className="space-y-3">
                {allScores.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-32 flex-shrink-0">
                      <span
                        className={`text-sm font-medium ${item.isBrand ? "text-brand-400" : "text-gray-300"}`}
                      >
                        {item.name}
                        {item.isBrand && " (You)"}
                      </span>
                    </div>
                    <div className="flex-1 h-8 bg-gray-800 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full rounded-lg transition-all ${
                          item.isBrand
                            ? "bg-gradient-to-r from-brand-500 to-brand-400"
                            : "bg-gradient-to-r from-gray-600 to-gray-500"
                        }`}
                        style={{ width: `${Math.max(item.score, 2)}%` }}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white">
                        {item.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-Model Results */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Per-Model Breakdown</h3>
            <div className="space-y-3">
              {result.modelSummaries.map((model, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-4 ${
                    model.error
                      ? "border-red-500/20 bg-red-500/5"
                      : "border-gray-700 bg-gray-800/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white">{model.name}</span>
                      {model.free && (
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-400">
                          Free
                        </span>
                      )}
                    </div>
                    {model.error ? (
                      <span className="text-xs text-red-400">Error: {model.error}</span>
                    ) : (
                      <span className={`text-2xl font-bold ${getScoreColor(model.brandScore)}`}>
                        {model.brandScore}
                      </span>
                    )}
                  </div>
                  {!model.error && (
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Visibility</span>
                        <p className="text-gray-200">
                          {model.brandAppearedIn}/{model.brandTotalPrompts} prompts
                          <span className="text-gray-500"> ({model.brandVisibility}%)</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Ranking</span>
                        <p className="text-gray-200">
                          {model.brandAverageRanking !== null
                            ? `#${model.brandAverageRanking}`
                            : "N/A"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Market Share</span>
                        <p className="text-gray-200">{Math.round(model.marketShare * 100)}%</p>
                      </div>
                    </div>
                  )}
                  {/* Per-model competitor data */}
                  {!model.error && model.competitorData.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700/50">
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
                        {model.competitorData.map((comp, j) => (
                          <span key={j} className="text-gray-400">
                            {comp.name}:{" "}
                            <span className={getScoreColor(comp.score)}>{comp.score}</span>
                            <span className="text-gray-600">
                              {" "}
                              ({comp.visibility}% ·{" "}
                              {comp.averageRanking !== null ? `#${comp.averageRanking}` : "N/A"})
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prompts Used */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <button
              onClick={() => setShowPrompts(!showPrompts)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-lg font-semibold text-white">Prompts Used ({result.prompts.length})</h3>
              <span className="text-gray-400 text-sm">{showPrompts ? "Hide" : "Show"}</span>
            </button>
            {showPrompts && (
              <ol className="mt-4 space-y-2 list-decimal list-inside">
                {result.prompts.map((p, i) => (
                  <li key={i} className="text-sm text-gray-300">
                    {p}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Sample Responses */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <button
              onClick={() => setShowSamples(!showSamples)}
              className="flex items-center justify-between w-full"
            >
              <h3 className="text-lg font-semibold text-white">Sample AI Responses</h3>
              <span className="text-gray-400 text-sm">{showSamples ? "Hide" : "Show"}</span>
            </button>
            {showSamples && (
              <div className="mt-4 space-y-4">
                {result.modelSummaries
                  .filter((m) => !m.error && m.sampleResponse)
                  .map((model, i) => (
                    <div key={i} className="rounded-lg border border-gray-700 bg-gray-800/30 p-4">
                      <div className="text-xs font-medium text-gray-400 mb-2">{model.name}</div>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {model.sampleResponse}
                        {model.sampleResponse.length >= 500 && "..."}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-brand-500/30 bg-brand-500/10 p-6 text-center">
            <p className="text-white font-medium mb-3 text-lg">
              Want to improve your AI visibility?
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/tools/llms-txt-generator" className="btn-secondary text-sm">
                Generate llms.txt
              </a>
              <a href="/tools/schema-generator" className="btn-secondary text-sm">
                Add Schema Markup
              </a>
              <a href="/tools/ai-readiness-checker" className="btn-secondary text-sm">
                Check AI Readiness
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
          <p className="text-sm mb-4">
            Enter your brand name and niche above. We&apos;ll send prompts to{" "}
            {serverProvider === "google" ? "3 Google Gemini models" : "6 AI models (ChatGPT, Gemini, Claude, Llama, Mistral, DeepSeek)"}{" "}
            and analyze how often your brand appears in their answers. Free-tier models (Llama, Mistral, DeepSeek) use OpenRouter&apos;s free routing.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            {(serverProvider === "google"
              ? ["Gemini 2.0 Flash", "Gemini 2.0 Flash Lite", "Gemini 1.5 Flash"]
              : ["ChatGPT", "Gemini", "Claude", "Llama 3.3", "Mistral", "DeepSeek"]
            ).map((m) => (
              <span
                key={m}
                className="rounded-full bg-gray-800 px-3 py-1 text-gray-400 border border-gray-700"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Educational FAQ Section */}
      <div className="mt-16 border-t border-gray-800 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">📊 AI Search Brand Visibility FAQ</h2>
          <p className="text-gray-400">Discover how AI answer engines evaluate your brand and how to benchmark your share of voice.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-400">
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">1. What is an AI Search Grader?</h3>
            <p>
              It is a specialized diagnostic utility that simulates user inquiries on multiple LLMs (such as ChatGPT, Gemini, and Claude). It scans the model's text responses to check if, when, and how your brand is recommended or cited for niche topics.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">2. How is my AI Brand Visibility score calculated?</h3>
            <p>
              The score (0–100) measures how frequently your brand appears in recommendations, your average ranking position when listed alongside competitors, the sentiment (positive vs. neutral), and your relative share of voice across the 6 queried models.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">3. Why does my brand rank differently across different LLMs?</h3>
            <p>
              Each model uses distinct training databases, crawl schedules, and retrieval pipelines. Anthropic's Claude favors deep, technical documentation (making <code>llms.txt</code> highly effective), Google's Gemini prioritizes live Google search integration, and ChatGPT favors broad brand consensus.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">4. How can I boost my brand visibility in AI responses?</h3>
            <p>
              Focus on entity-building: establish consistent brand descriptions on authoritative off-site domains (LinkedIn, Crunchbase, Wikipedia). Earn positive discussions on forums like Reddit, and ensure your site has complete schema metadata to make it easily readable for real-time search crawlers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
