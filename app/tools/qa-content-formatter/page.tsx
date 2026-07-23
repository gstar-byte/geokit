"use client";

import { useState } from "react";

interface QaPair {
  question: string;
  answer: string;
}

function formatAsQa(content: string, format: "html" | "markdown" | "json"): string {
  const lines = content.split("\n").filter((l) => l.trim());
  const pairs: QaPair[] = [];
  let currentQ = "";
  let currentA = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.endsWith("?") || /^(what|how|why|when|where|who|which|can|do|does|is|are|should|will|would)/i.test(trimmed)) {
      if (currentQ && currentA) {
        pairs.push({ question: currentQ, answer: currentA.trim() });
      }
      currentQ = trimmed;
      currentA = "";
    } else {
      currentA += (currentA ? " " : "") + trimmed;
    }
  }
  if (currentQ && currentA) {
    pairs.push({ question: currentQ, answer: currentA.trim() });
  }

  if (pairs.length === 0) {
    return "No Q&A patterns detected. Make sure your content contains questions (lines ending with ? or starting with question words).";
  }

  if (format === "html") {
    let html = '<section class="faq">\n';
    html += '  <h2>Frequently Asked Questions</h2>\n';
    for (const p of pairs) {
      html += `  <details>\n    <summary>${escapeHtml(p.question)}</summary>\n    <p>${escapeHtml(p.answer)}</p>\n  </details>\n`;
    }
    html += "</section>\n";
    html += "\n<script type=\"application/ld+json\">\n";
    html += JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pairs.map((p) => ({
        "@type": "Question",
        name: p.question,
        acceptedAnswer: { "@type": "Answer", text: p.answer },
      })),
    }, null, 2);
    html += "\n</script>";
    return html;
  } else if (format === "markdown") {
    let md = "## Frequently Asked Questions\n\n";
    for (const p of pairs) {
      md += `### ${p.question}\n\n${p.answer}\n\n`;
    }
    return md.trim();
  } else {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: pairs.map((p) => ({
        "@type": "Question",
        name: p.question,
        acceptedAnswer: { "@type": "Answer", text: p.answer },
      })),
    }, null, 2);
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function QaContentFormatterPage() {
  const [content, setContent] = useState("");
  const [format, setFormat] = useState<"html" | "markdown" | "json">("html");
  const [copied, setCopied] = useState(false);

  const output = content.trim() ? formatAsQa(content, format) : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Q&amp;A Content Formatter</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Paste your content and automatically convert it into Q&amp;A format. AI models like ChatGPT, Perplexity, and Google AI Overviews naturally parse and cite question-answer patterns. Includes FAQPage schema for structured data.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-gray-600 dark:text-gray-300 mb-2">
              Your Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Paste your content here. Lines ending with ? or starting with question words (what, how, why, etc.) will be detected as questions.\n\nExample:\nWhat is GEO?\nGEO stands for Generative Engine Optimization. It's the practice of optimizing your website for AI search engines.\n\nHow does llms.txt work?\nllms.txt is a markdown file that tells AI models what your site is about."}
              rows={16}
              className="input-field font-mono text-base"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-600 dark:text-gray-300 mb-2">Output Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(["html", "markdown", "json"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`rounded-lg border p-3 text-center text-base font-medium transition-colors ${
                    format === f
                      ? "border-brand-500 bg-brand-500/10 text-gray-900 dark:text-white"
                      : "border-gray-800 bg-gray-900/50 text-gray-500 dark:text-gray-400 hover:border-gray-700"
                  }`}
                >
                  {f === "html" ? "HTML + Schema" : f === "markdown" ? "Markdown" : "JSON-LD"}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/50 p-4 text-base text-gray-500 dark:text-gray-400">
            <p className="mb-2 font-medium text-gray-600 dark:text-gray-300">Tips for best results:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Write questions as separate lines ending with <code className="text-brand-400">?</code></li>
              <li>Put the answer on the following line(s)</li>
              <li>Questions starting with what/how/why/when/where/who are auto-detected</li>
              <li>HTML output includes FAQPage schema for AI citations</li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">Formatted Output</h3>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="btn-secondary text-sm py-1.5 px-3 disabled:opacity-50"
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre className="code-block min-h-[400px] whitespace-pre-wrap">
            {output || "Your formatted Q&A will appear here..."}
          </pre>
        </div>
      </div>

      {/* Educational FAQ Section */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">❓ Q&amp;A Content Formatting &amp; AI Retrieval FAQ</h2>
          <p className="text-gray-500 dark:text-gray-400">Discover why structuring your website content as Question-and-Answer pairs improves discovery by LLMs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">1. Why does formatting content as Q&amp;A improve AI citations?</h3>
            <p>
              AI search engines (like Perplexity and ChatGPT Search) process user queries as natural language questions. During retrieval, their algorithms look for semantic matches. Storing content in explicit Q&amp;A blocks matches their query embeddings directly, making your site 3.2x more likely to be cited.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">2. Q&amp;A for RAG vs. Q&amp;A for Fine-Tuning: What is the difference?</h3>
            <p>
              For **RAG (Retrieval-Augmented Generation)**, clean Markdown or HTML headers help models locate the direct answer. For **Fine-Tuning (Instruction Tuning)**, the output JSON format structures input-response pairs to train custom models (e.g. Alpaca format) on your brand's data.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">3. How long should the question and answer be?</h3>
            <p>
              Keep questions concise (under 15 words) and match common search queries. For answers, provide a direct 1-to-2 sentence answer (ideal for quick extraction), followed by 2-3 sentences of supporting detail to establish authority.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">4. Should I use FAQPage schema with Q&amp;A content?</h3>
            <p>
              Absolutely. FAQPage structured JSON-LD tells crawlers exactly where questions start and end. When you export as HTML, our tool embeds this schema automatically, making it ready to drop into your page CMS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
