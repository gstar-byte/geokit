"use client";

import { useState } from "react";

/* ─── Types ─── */
interface DimensionResult {
  name: string;
  score: number;
  max: number;
  tip: string;
}

interface AnalysisResult {
  total: number;
  dimensions: DimensionResult[];
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

function getGeoVerdict(score: number) {
  if (score >= 90) return "Outstanding — Your content is primed for AI citation.";
  if (score >= 80) return "Excellent — AI search engines are very likely to cite this.";
  if (score >= 65) return "Good — Solid foundation, a few tweaks will boost citability.";
  if (score >= 50) return "Fair — Noticeable gaps that reduce AI citation potential.";
  if (score >= 30) return "Weak — Significant improvements needed for AI visibility.";
  return "Poor — This content is unlikely to be cited by AI engines as-is.";
}

function getSeoVerdict(score: number) {
  if (score >= 90) return "Outstanding — Excellent SEO fundamentals across the board.";
  if (score >= 80) return "Excellent — Strong SEO signals; search engines will love this.";
  if (score >= 65) return "Good — Solid SEO base, minor optimizations can push it higher.";
  if (score >= 50) return "Fair — Several SEO areas need attention for better rankings.";
  if (score >= 30) return "Weak — Major SEO gaps; significant rework recommended.";
  return "Poor — Minimal SEO signals detected; needs a full optimization pass.";
}

/* ─── GEO Scoring Engine (unchanged) ─── */
function analyzeGEO(text: string): AnalysisResult {
  const lines = text.split("\n");
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const firstParagraph = text.slice(0, 200);

  /* 1. Direct Answer Potential (20 pts) */
  let dap = 0;
  const declarativeVerbs = /\b(is|are|was|were|means|refers to|defines|describes|represents|consists of|involves)\b/gi;
  const firstMatches = firstParagraph.match(declarativeVerbs) || [];
  dap += Math.min(8, firstMatches.length * 2);

  const firstSentence = text.split(/[.!?]/)[0] || "";
  if (firstSentence.length > 10 && firstSentence.length < 200 && !firstSentence.includes("?")) {
    dap += 6;
  }

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

  const quotedText = text.match(/["""][^""]+["""]|["'][^"']+["']/g) || [];
  cw += Math.min(4, quotedText.length * 2);

  const authoritySignals =
    /\b(according to|research shows|studies show|data from|survey found|report by|published in|experts say|evidence suggests)\b/gi;
  const authMatches = text.match(authoritySignals) || [];
  cw += Math.min(6, authMatches.length * 2);

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

  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].trim().endsWith("?") && lines[i + 1].trim().length > 20) {
      qc += 2;
    }
  }
  qc = Math.min(15, qc);
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
  const multiWordEntities = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g) || [];
  ed += Math.min(7, Math.floor(multiWordEntities.length / 2));

  const acronyms = text.match(/\b[A-Z]{2,}\b/g) || [];
  ed += Math.min(4, Math.floor(acronyms.length / 2));

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

/* ─── SEO Scoring Engine (new) ─── */
function analyzeSEO(text: string): AnalysisResult {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lowerWords = words.map((w) => w.toLowerCase().replace(/[^a-z0-9'-]/g, "")).filter((w) => w.length > 0);

  /* ── Stop words for keyword analysis ── */
  const stopWords = new Set([
    "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from",
    "is","are","was","were","be","been","being","have","has","had","do","does","did",
    "will","would","shall","should","may","might","can","could","this","that","these",
    "those","it","its","i","you","he","she","we","they","my","your","his","her","our",
    "their","me","him","us","them","not","no","if","then","else","when","where","how",
    "what","which","who","whom","why","so","as","up","out","about","into","over","after",
    "all","also","just","than","very","too","only","each","every","both","few","more",
    "most","other","some","such","any","new","old","get","got","like","know","think",
    "make","go","see","come","take","use","find","give","tell","say","said","much",
  ]);

  /* 1. Keyword Density (20 pts) */
  let kd = 0;
  const meaningfulWords = lowerWords.filter((w) => !stopWords.has(w) && w.length > 2);
  const freq: Record<string, number> = {};
  for (const w of meaningfulWords) {
    freq[w] = (freq[w] || 0) + 1;
  }
  const repeated = Object.entries(freq).filter(([, count]) => count >= 2);
  const repeatedWordCount = repeated.reduce((sum, [, count]) => sum + count, 0);
  const density = wordCount > 0 ? repeatedWordCount / wordCount : 0;

  // Ideal density: 1-3% (0.01 to 0.03)
  if (density >= 0.01 && density <= 0.03) {
    kd = 20;
  } else if (density > 0.03 && density <= 0.06) {
    // Slightly keyword-heavy but still OK
    kd = Math.round(20 - (density - 0.03) * 300);
  } else if (density > 0.06) {
    // Keyword stuffing territory
    kd = Math.max(2, Math.round(20 - (density - 0.03) * 400));
  } else if (density > 0.005) {
    // Some repetition
    kd = Math.round(density * 1500);
  } else {
    // Very sparse
    kd = Math.max(2, Math.round(density * 2000));
  }

  // Bonus: check for 2-word phrase repetition (bigrams)
  if (wordCount >= 20) {
    const bigrams: Record<string, number> = {};
    for (let i = 0; i < lowerWords.length - 1; i++) {
      if (!stopWords.has(lowerWords[i]) && !stopWords.has(lowerWords[i + 1])) {
        const bg = `${lowerWords[i]} ${lowerWords[i + 1]}`;
        bigrams[bg] = (bigrams[bg] || 0) + 1;
      }
    }
    const repeatedBigrams = Object.values(bigrams).filter((c) => c >= 2).length;
    if (repeatedBigrams >= 1 && repeatedBigrams <= 8) {
      kd = Math.min(20, kd + Math.min(4, repeatedBigrams));
    }
  }

  kd = Math.max(0, Math.min(20, kd));
  const kdTip =
    kd >= 16
      ? `Good keyword density (${(density * 100).toFixed(1)}%) — natural repetition without stuffing.`
      : density > 0.06
        ? `Keyword density is high (${(density * 100).toFixed(1)}%). Reduce repetition to avoid appearing spammy.`
        : `Low keyword density (${(density * 100).toFixed(1)}%). Repeat key terms naturally 2–5 times throughout your content.`;

  /* 2. Readability (20 pts) */
  let rd = 0;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 5);
  const sentenceCount = sentences.length;

  if (sentenceCount > 0) {
    const avgWordsPerSentence = wordCount / sentenceCount;

    // Ideal: 15-20 words per sentence
    if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 22) {
      rd += 10;
    } else if (avgWordsPerSentence >= 8 && avgWordsPerSentence <= 30) {
      rd += 6;
    } else {
      rd += 3;
    }

    // Sentence length variety
    const sentenceLengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
    const minLen = Math.min(...sentenceLengths);
    const maxLen = Math.max(...sentenceLengths);
    const range = maxLen - minLen;
    if (range >= 10) rd += 5; // Good mix of short and long
    else if (range >= 5) rd += 3;
    else rd += 1;

    // Paragraph structure
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    if (paragraphs.length >= 3) rd += 5;
    else if (paragraphs.length >= 2) rd += 3;
    else rd += 1;
  } else {
    rd = 2;
  }

  rd = Math.min(20, rd);
  const avgWPS = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;
  const rdTip =
    rd >= 16
      ? `Excellent readability — avg ${avgWPS} words/sentence with good variety.`
      : avgWPS > 25
        ? `Sentences are long (avg ${avgWPS} words). Break them up for easier scanning.`
        : avgWPS < 10
          ? `Sentences are very short (avg ${avgWPS} words). Mix in some longer, detailed sentences.`
          : `Readability is fair (avg ${avgWPS} words/sentence). Add paragraph breaks and vary sentence length.`;

  /* 3. Title & Heading Signals (20 pts) */
  let th = 0;
  const allLines = text.split("\n");

  // Check if first non-empty line looks like a title
  const firstNonEmpty = allLines.find((l) => l.trim().length > 0);
  if (firstNonEmpty) {
    const trimmed = firstNonEmpty.trim();
    const isMarkdownHeading = /^#{1,3}\s/.test(trimmed);
    const isAllCaps = /^[A-Z][A-Z\s:—\-–]{4,}$/.test(trimmed);
    const isShortTitle = trimmed.length <= 100 && trimmed.length >= 5 && !trimmed.endsWith(".");
    if (isMarkdownHeading || isAllCaps || isShortTitle) {
      th += 8;
    } else {
      th += 2; // Some content but not clearly a title
    }
  }

  // Check for heading patterns throughout
  const headingPatterns = allLines.filter((l) => {
    const t = l.trim();
    return (
      /^#{1,6}\s/.test(t) ||
      /^[A-Z][A-Z\s]{4,}$/.test(t) ||
      /^\*\*[^*]+\*\*$/.test(t) || // Bold lines that are standalone
      /^__[^_]+__$/.test(t)
    );
  });
  th += Math.min(8, headingPatterns.length * 2);

  // Hierarchy bonus: multiple heading levels
  const h1Count = allLines.filter((l) => /^#\s/.test(l.trim())).length;
  const h2Count = allLines.filter((l) => /^##\s/.test(l.trim())).length;
  const h3Count = allLines.filter((l) => /^###\s/.test(l.trim())).length;
  if (h1Count >= 1 && h2Count >= 1) th += 2;
  if (h2Count >= 2 && h3Count >= 1) th += 2;

  th = Math.min(20, th);
  const thTip =
    th >= 16
      ? "Strong heading structure — clear title and well-organized sections."
      : headingPatterns.length === 0
        ? "No headings detected. Add a clear title (# Title) and section headings (## Section) for better SEO."
        : "Add more heading levels (##, ###) to create a clear content hierarchy.";

  /* 4. Meta-Friendliness (15 pts) */
  let mf = 0;
  const first160 = text.slice(0, 160).trim();

  // First 160 chars should form a good meta description
  if (first160.length >= 50) {
    mf += 4;
    // Complete sentence check (ends with punctuation)
    if (/[.!?]/.test(first160)) mf += 3;
    // No code or special chars
    if (!/[{}<>]|```|function\s|const\s|var\s/.test(first160)) mf += 3;
    // Not starting with a heading marker
    if (!/^#+\s/.test(first160)) mf += 2;
    else mf += 1; // Headings are okay but not ideal for meta
  } else {
    mf += 2;
  }

  // Good opening paragraph
  const firstPara = text.split(/\n\s*\n/)[0] || "";
  const firstParaWords = firstPara.split(/\s+/).filter(Boolean).length;
  if (firstParaWords >= 20 && firstParaWords <= 60) mf += 3;
  else if (firstParaWords >= 10) mf += 2;

  mf = Math.min(15, mf);
  const mfTip =
    mf >= 12
      ? "Meta-friendly — your opening paragraph works well as a search snippet."
      : first160.length < 50
        ? "Opening is too short. Write a compelling 50–160 character summary as your first paragraph."
        : "Improve your opening paragraph: make it a complete sentence, avoid code, and summarize the content clearly.";

  /* 5. Link Worthiness (15 pts) */
  let lw = 0;

  // URLs
  const urlPattern = /https?:\/\/[^\s<>)"']+/gi;
  const urls = text.match(urlPattern) || [];
  lw += Math.min(5, urls.length * 2);

  // Markdown links
  const mdLinks = text.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  lw += Math.min(4, mdLinks.length * 2);

  // Citation patterns: [1], (Smith, 2023), etc.
  const citationPatterns = text.match(/\[\d+\]|\([A-Z][a-z]+(?:\s+(?:et\s+al\.?|&\s+[A-Z][a-z]+))?,?\s*\d{4}\)/g) || [];
  lw += Math.min(3, citationPatterns.length);

  // Reference section indicators
  const refIndicators = /\b(references|bibliography|sources|further reading|works cited|see also)\b/gi;
  if (refIndicators.test(text)) lw += 3;

  lw = Math.min(15, lw);
  const lwTip =
    lw >= 12
      ? "Rich in links and references — signals authoritative, well-sourced content."
      : urls.length === 0 && mdLinks.length === 0
        ? "No links detected. Add external references, sources, and citations to boost authority."
        : "Add more external links, citations, and a references section to strengthen link signals.";

  /* 6. Word Diversity (10 pts) */
  let wd = 0;
  if (wordCount > 0) {
    const uniqueWords = new Set(lowerWords);
    const diversityRatio = uniqueWords.size / lowerWords.length;

    // Score based on diversity ratio (typically 0.3-0.8 for natural text)
    if (diversityRatio >= 0.55) wd = 10;
    else if (diversityRatio >= 0.45) wd = 8;
    else if (diversityRatio >= 0.35) wd = 6;
    else if (diversityRatio >= 0.25) wd = 4;
    else wd = 2;
  }

  wd = Math.min(10, wd);
  const diversityPct = wordCount > 0 ? Math.round((new Set(lowerWords).size / lowerWords.length) * 100) : 0;
  const wdTip =
    wd >= 8
      ? `Great word diversity (${diversityPct}% unique words) — varied vocabulary keeps readers engaged.`
      : `Word diversity is low (${diversityPct}% unique). Use synonyms and varied phrasing to avoid repetitiveness.`;

  const dimensions: DimensionResult[] = [
    { name: "Keyword Density", score: kd, max: 20, tip: kdTip },
    { name: "Readability", score: rd, max: 20, tip: rdTip },
    { name: "Title & Heading Signals", score: th, max: 20, tip: thTip },
    { name: "Meta-Friendliness", score: mf, max: 15, tip: mfTip },
    { name: "Link Worthiness", score: lw, max: 15, tip: lwTip },
    { name: "Word Diversity", score: wd, max: 10, tip: wdTip },
  ];

  const total = dimensions.reduce((sum, d) => sum + d.score, 0);
  return { total, dimensions };
}

/* ─── SVG Score Ring ─── */
function ScoreRing({ score, label }: { score: number; label: string }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = getStrokeColor(score);

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto">
      {/* Background ring */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#1f2937"
        strokeWidth="9"
      />
      {/* Progress ring */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
        className="transition-all duration-1000 ease-out"
      />
      {/* Score text */}
      <text
        x="80"
        y="72"
        textAnchor="middle"
        className="fill-white font-bold"
        style={{ fontSize: "40px", fontWeight: 700 }}
      >
        {score}
      </text>
      <text
        x="80"
        y="92"
        textAnchor="middle"
        className="fill-gray-400"
        style={{ fontSize: "11px" }}
      >
        out of 100
      </text>
      <text
        x="80"
        y="110"
        textAnchor="middle"
        className="fill-gray-500"
        style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}
      >
        {label}
      </text>
    </svg>
  );
}

/* ─── Dimension Card List ─── */
function DimensionCards({ dimensions }: { dimensions: DimensionResult[] }) {
  return (
    <div className="space-y-2">
      {dimensions.map((dim, i) => {
        const pct = dim.max === 0 ? 0 : Math.round((dim.score / dim.max) * 100);
        return (
          <div
            key={i}
            className="rounded-lg border border-gray-800 bg-gray-900/50 p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-medium text-white">{dim.name}</h3>
              <span className={`text-xs font-bold ${getScoreColor(pct)}`}>
                {dim.score}/{dim.max}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-700 rounded-full mb-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(dim.score, dim.max)}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">{dim.tip}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Page ─── */
export default function GeoScorePage() {
  const [content, setContent] = useState("");
  const [geoResult, setGeoResult] = useState<AnalysisResult | null>(null);
  const [seoResult, setSeoResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!content.trim()) return;
    setGeoResult(analyzeGEO(content));
    setSeoResult(analyzeSEO(content));
  };

  const hasResults = geoResult && seoResult;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-3">
          GEO + SEO Score — Dual Content Grader
        </h1>
        <p className="text-lg text-gray-400 max-w-3xl">
          Paste your content and get instant 0–100 scores for both{" "}
          <span className="text-brand-400 font-medium">GEO</span> (AI citability) and{" "}
          <span className="text-blue-400 font-medium">SEO</span> (search engine optimization).
          Analyze all 12 dimensions across both scoring systems simultaneously.
        </p>
      </div>

      {/* Input area */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Paste your article or page content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={"Paste your article, blog post, or page content here…\n\nThe analyzer will evaluate 12 dimensions across two scoring systems:\n\n🤖 GEO Score — AI Citability\n• Direct answer potential  • Structure quality\n• Citation worthiness  • Question coverage\n• Content length  • Entity density\n\n🔍 SEO Score — Search Optimization\n• Keyword density  • Readability\n• Title & heading signals  • Meta-friendliness\n• Link worthiness  • Word diversity"}
          className="input-field w-full min-h-[220px] resize-y font-mono text-sm"
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-gray-500">
            {content.trim() ? `${content.split(/\s+/).filter(Boolean).length} words` : "No content yet"}
          </span>
          <div className="flex gap-3">
            {hasResults && (
              <button
                onClick={() => {
                  setContent("");
                  setGeoResult(null);
                  setSeoResult(null);
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

      {/* Results area */}
      {!hasResults ? (
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-12 text-center text-gray-500">
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
            Paste your content above and click{" "}
            <span className="text-brand-400 font-medium">Analyze Content</span> to
            get both your GEO and SEO scores.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Dual Score Rings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* GEO Score Panel */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20">
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">🤖 GEO Score</span>
                </div>
                <ScoreRing score={geoResult.total} label="GEO" />
                <p className={`text-sm font-medium mt-3 ${getScoreColor(geoResult.total)}`}>
                  {getGeoVerdict(geoResult.total)}
                </p>
              </div>
              <DimensionCards dimensions={geoResult.dimensions} />
            </div>

            {/* SEO Score Panel */}
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">🔍 SEO Score</span>
                </div>
                <ScoreRing score={seoResult.total} label="SEO" />
                <p className={`text-sm font-medium mt-3 ${getScoreColor(seoResult.total)}`}>
                  {getSeoVerdict(seoResult.total)}
                </p>
              </div>
              <DimensionCards dimensions={seoResult.dimensions} />
            </div>
          </div>

          {/* Combined Summary */}
          <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-6">
            <div className="flex items-center justify-center gap-8 mb-4">
              <div className="text-center">
                <span className="text-3xl font-bold text-white">{geoResult.total}</span>
                <span className="text-sm text-gray-400 ml-1">GEO</span>
              </div>
              <div className="text-2xl text-gray-600">+</div>
              <div className="text-center">
                <span className="text-3xl font-bold text-white">{seoResult.total}</span>
                <span className="text-sm text-gray-400 ml-1">SEO</span>
              </div>
              <div className="text-2xl text-gray-600">=</div>
              <div className="text-center">
                <span className="text-3xl font-bold text-brand-400">{Math.round((geoResult.total + seoResult.total) / 2)}</span>
                <span className="text-sm text-gray-400 ml-1">Avg</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-400">
              Combined score averages both dimensions — aim for 80+ on each for maximum visibility in both AI and traditional search.
            </p>
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6 text-center">
            <p className="text-white font-medium mb-3">
              Improve your scores with these tools
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
  );
}


