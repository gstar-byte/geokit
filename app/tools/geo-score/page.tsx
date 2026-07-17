"use client";

import { useState } from "react";

/* ─── Types ─── */
interface DimensionResult {
  name: string;
  score: number;
  max: number;
  tip: string;
}

/* ─── Helpers ─── */
function getScoreColor(score: number) {
  if (score >= 80) return "text-green-400";
  if (score >= 50) return "text-yellow-400";
  return "text-red-400";
}

function getStrokeColor(score: number) {
  if (score >= 80) return "#4ade80";
  if (score >= 50) return "#facc15";
  return "#f87171";
}

function getBarColor(score: number, max: number) {
  const pct = max === 0 ? 0 : score / max;
  if (pct >= 0.8) return "bg-green-500";
  if (pct >= 0.5) return "bg-yellow-500";
  return "bg-red-500";
}

function getVerdict(score: number) {
  if (score >= 90) return "Outstanding — Your content is primed for AI citation.";
  if (score >= 80) return "Excellent — AI search engines are very likely to cite this.";
  if (score >= 65) return "Good — Solid foundation, a few tweaks will boost citability.";
  if (score >= 50) return "Fair — Noticeable gaps that reduce AI citation potential.";
  if (score >= 30) return "Weak — Significant improvements needed for AI visibility.";
  return "Poor — This content is unlikely to be cited by AI engines as-is.";
}

/* ─── Scoring Engine ─── */
function analyzeContent(text: string): { total: number; dimensions: DimensionResult[] } {
  const lines = text.split("\n");
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const firstParagraph = text.slice(0, 200);

  /* 1. Direct Answer Potential (20 pts) */
  let dap = 0;
  const declarativeVerbs = /\b(is|are|was|were|means|refers to|defines|describes|represents|consists of|involves)\b/gi;
  const firstMatches = firstParagraph.match(declarativeVerbs) || [];
  dap += Math.min(8, firstMatches.length * 2);

  // First sentence is concise and definitive (not a question)
  const firstSentence = text.split(/[.!?]/)[0] || "";
  if (firstSentence.length > 10 && firstSentence.length < 200 && !firstSentence.includes("?")) {
    dap += 6;
  }

  // Declarative density in full text
  const fullMatches = text.match(declarativeVerbs) || [];
  dap += Math.min(6, Math.floor(fullMatches.length / 3));

  dap = Math.min(20, dap);
  const dapTip =
    dap >= 16
      ? "Your opening is strong and declarative — great for AI snippets."
      : "Start with a clear, concise definition or statement. Avoid opening with a question.";

  /* 2. Structure Quality (20 pts) */
  let sq = 0;
  const headingLines = lines.filter((l) => /^#{1,6}\s/.test(l.trim()) || /^[A-Z][A-Z\s]{4,}$/.test(l.trim()));
  sq += Math.min(8, headingLines.length * 2);

  const bulletLines = lines.filter((l) => /^\s*[-*•]\s/.test(l));
  sq += Math.min(5, Math.floor(bulletLines.length / 2));

  const numberedLines = lines.filter((l) => /^\s*\d+[.)]\s/.test(l));
  sq += Math.min(4, numberedLines.length);

  // Bonus for having both headings and lists
  if (headingLines.length >= 2 && (bulletLines.length >= 3 || numberedLines.length >= 2)) {
    sq += 3;
  }

  sq = Math.min(20, sq);
  const sqTip =
    sq >= 16
      ? "Well-structured with clear headings and lists — easy for AI to parse."
      : "Add more headings (##), bullet points, and numbered lists to improve scannability.";

  /* 3. Citation Worthiness (20 pts) */
  let cw = 0;
  const statsPattern = /\d+(\.\d+)?%/g;
  const statsMatches = text.match(statsPattern) || [];
  cw += Math.min(6, statsMatches.length * 2);

  const quotedText = text.match(/[""][^""]+[""]|["'][^"']+["']/g) || [];
  cw += Math.min(4, quotedText.length * 2);

  const authoritySignals =
    /\b(according to|research shows|studies show|data from|survey found|report by|published in|experts say|evidence suggests)\b/gi;
  const authMatches = text.match(authoritySignals) || [];
  cw += Math.min(6, authMatches.length * 2);

  // Proper nouns (simple heuristic: capitalized words not at line start, min 2 chars)
  const properNounPattern = /(?<!\.\s)(?<!^)\b[A-Z][a-zA-Z]{2,}\b/gm;
  const properNouns = text.match(properNounPattern) || [];
  cw += Math.min(4, Math.floor(properNouns.length / 5));

  cw = Math.min(20, cw);
  const cwTip =
    cw >= 16
      ? "Strong authority signals — statistics, quotes, and source references are present."
      : 'Add statistics (e.g. "73% of…"), quotes from experts, and phrases like "according to" or "research shows".';

  /* 4. Question Coverage (15 pts) */
  let qc = 0;
  const questionLines = lines.filter((l) => l.trim().endsWith("?"));
  qc += Math.min(6, questionLines.length * 2);

  // Q&A pattern: question followed by answer
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].trim().endsWith("?") && lines[i + 1].trim().length > 20) {
      qc += 2;
    }
  }
  qc = Math.min(15, qc);
  // Bonus if no questions but content is otherwise answer-oriented
  if (questionLines.length === 0 && wordCount > 300) {
    qc = Math.max(qc, 3);
  }

  const qcTip =
    qc >= 12
      ? "Great question coverage — your content mirrors what users ask AI engines."
      : 'Include common user questions (e.g. "What is…?", "How does…?") and answer them directly below.';

  /* 5. Content Length (10 pts) */
  let cl = 0;
  if (wordCount >= 500 && wordCount <= 2500) cl = 10;
  else if (wordCount > 2500 && wordCount <= 3000) cl = 9;
  else if (wordCount > 3000) cl = 7;
  else if (wordCount >= 300) cl = 6;
  else if (wordCount >= 100) cl = 3;
  else cl = 1;

  const clTip =
    cl >= 9
      ? `Ideal length (${wordCount} words) — comprehensive without being overwhelming.`
      : wordCount < 500
        ? `Too short (${wordCount} words). Aim for 500–2,500 words for optimal AI citability.`
        : `Consider trimming (${wordCount} words). Content over 3,000 words may dilute focus.`;

  /* 6. Entity Density (15 pts) */
  let ed = 0;
  // Capitalized multi-word phrases (e.g. "Google Search", "Machine Learning")
  const multiWordEntities = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || [];
  ed += Math.min(7, Math.floor(multiWordEntities.length / 2));

  // Technical terms / acronyms (2+ uppercase letters)
  const acronyms = text.match(/\b[A-Z]{2,}\b/g) || [];
  ed += Math.min(4, Math.floor(acronyms.length / 2));

  // Unique entity diversity bonus
  const uniqueEntities = new Set([...multiWordEntities, ...acronyms]);
  ed += Math.min(4, Math.floor(uniqueEntities.size / 4));

  ed = Math.min(15, ed);
  const edTip =
    ed >= 12
      ? "Rich entity density — proper nouns, brands, and technical terms are well-represented."
      : "Include more specific names, brands, acronyms, and technical terms to increase entity density.";

  const dimensions: DimensionResult[] = [
    { name: "Direct Answer Potential", score: dap, max: 20, tip: dapTip },
    { name: "Structure Quality", score: sq, max: 20, tip: sqTip },
    { name: "Citation Worthiness", score: cw, max: 20, tip: cwTip },
    { name: "Question Coverage", score: qc, max: 15, tip: qcTip },
    { name: "Content Length", score: cl, max: 10, tip: clTip },
    { name: "Entity Density", score: ed, max: 15, tip: edTip },
  ];

  const total = dimensions.reduce((sum, d) => sum + d.score, 0);
  return { total, dimensions };
}

/* ─── SVG Score Ring ─── */
function ScoreRing({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getStrokeColor(score);

  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
      {/* Background ring */}
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke="#1f2937"
        strokeWidth="10"
      />
      {/* Progress ring */}
      <circle
        cx="90"
        cy="90"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 90 90)"
        className="transition-all duration-1000 ease-out"
      />
      {/* Score text */}
      <text
        x="90"
        y="82"
        textAnchor="middle"
        className="fill-white text-5xl font-bold"
        style={{ fontSize: "48px", fontWeight: 700 }}
      >
        {score}
      </text>
      <text
        x="90"
        y="108"
        textAnchor="middle"
        className="fill-gray-400"
        style={{ fontSize: "14px" }}
      >
        out of 100
      </text>
    </svg>
  );
}

/* ─── Main Page ─── */
export default function GeoScorePage() {
  const [content, setContent] = useState("");
  const [result, setResult] = useState<{
    total: number;
    dimensions: DimensionResult[];
  } | null>(null);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    const analysis = analyzeContent(content);
    setResult(analysis);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">
          GEO Score — Content AI Citability Grader
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl">
          Paste your content and get an instant 0–100 GEO Score measuring how likely AI
          search engines are to cite it. Analyze direct answer potential, structure,
          citation worthiness, and more.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Paste your article or page content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={"Paste your article, blog post, or page content here…\n\nThe analyzer will evaluate:\n• Direct answer potential\n• Structure quality\n• Citation worthiness\n• Question coverage\n• Content length\n• Entity density"}
            className="input-field w-full min-h-[300px] resize-y font-mono text-sm"
          />
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-500">
              {content.trim() ? `${content.split(/\s+/).filter(Boolean).length} words` : "No content yet"}
            </span>
            <div className="flex gap-3">
              {result && (
                <button
                  onClick={() => {
                    setContent("");
                    setResult(null);
                  }}
                  className="btn-secondary text-sm"
                >
                  Clear
                </button>
              )}
              <button
                onClick={handleAnalyze}
                disabled={!content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze Content
              </button>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {!result ? (
            <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-8 text-center text-gray-500 h-full flex flex-col items-center justify-center">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
              <p className="text-sm">
                Paste your content on the left and click{" "}
                <span className="text-brand-400 font-medium">Analyze Content</span> to
                get your GEO Score.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Score Ring */}
              <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-8 text-center">
                <ScoreRing score={result.total} />
                <p className={`text-lg font-medium mt-4 ${getScoreColor(result.total)}`}>
                  {getVerdict(result.total)}
                </p>
              </div>

              {/* Dimension Cards */}
              <div className="space-y-3">
                {result.dimensions.map((dim, i) => {
                  const pct = dim.max === 0 ? 0 : Math.round((dim.score / dim.max) * 100);
                  return (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-white">{dim.name}</h3>
                        <span className={`text-sm font-bold ${getScoreColor(pct)}`}>
                          {dim.score}/{dim.max}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full h-2 bg-gray-700 rounded-full mb-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(dim.score, dim.max)}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400">{dim.tip}</p>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center">
                <p className="text-white font-medium mb-3">
                  Improve your GEO Score with these tools
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <a href="/tools/ai-readiness-checker" className="btn-secondary text-sm">
                    AI Readiness Checker
                  </a>
                  <a href="/tools/llms-txt-generator" className="btn-secondary text-sm">
                    Generate llms.txt
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
        </div>
      </div>
    </div>
  );
}
