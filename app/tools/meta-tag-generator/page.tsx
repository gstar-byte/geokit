"use client";

import { useState } from "react";

function generateMetaTags(data: Record<string, string>): string {
  let tags: string[] = [];

  // Basic meta
  if (data.title) tags.push(`<title>${data.title}</title>`);
  if (data.description) tags.push(`<meta name="description" content="${data.description}" />`);
  if (data.keywords) tags.push(`<meta name="keywords" content="${data.keywords}" />`);
  if (data.author) tags.push(`<meta name="author" content="${data.author}" />`);
  if (data.robots) tags.push(`<meta name="robots" content="${data.robots}" />`);

  // Canonical
  if (data.canonical) tags.push(`<link rel="canonical" href="${data.canonical}" />`);

  // Open Graph
  if (data.ogTitle || data.title) tags.push(`<meta property="og:title" content="${data.ogTitle || data.title}" />`);
  if (data.ogDesc || data.description) tags.push(`<meta property="og:description" content="${data.ogDesc || data.description}" />`);
  if (data.ogUrl || data.canonical) tags.push(`<meta property="og:url" content="${data.ogUrl || data.canonical}" />`);
  if (data.ogImage) tags.push(`<meta property="og:image" content="${data.ogImage}" />`);
  if (data.ogType) tags.push(`<meta property="og:type" content="${data.ogType}" />`);
  if (data.siteName) tags.push(`<meta property="og:site_name" content="${data.siteName}" />`);

  // Twitter Card
  if (data.twitterCard) tags.push(`<meta name="twitter:card" content="${data.twitterCard}" />`);
  if (data.twitterSite) tags.push(`<meta name="twitter:site" content="${data.twitterSite}" />`);
  if (data.twitterCreator) tags.push(`<meta name="twitter:creator" content="${data.twitterCreator}" />`);
  if (data.twitterImage || data.ogImage) tags.push(`<meta name="twitter:image" content="${data.twitterImage || data.ogImage}" />`);

  // AI-specific meta tags
  if (data.aiTitle || data.title) tags.push(`<meta name="ai:title" content="${data.aiTitle || data.title}" />`);
  if (data.aiSummary) tags.push(`<meta name="ai:summary" content="${data.aiSummary}" />`);
  if (data.aiKeywords) tags.push(`<meta name="ai:keywords" content="${data.aiKeywords}" />`);
  if (data.citationAuthor) tags.push(`<meta name="citation_author" content="${data.citationAuthor}" />`);
  if (data.citationTitle || data.title) tags.push(`<meta name="citation_title" content="${data.citationTitle || data.title}" />`);
  if (data.citationDate) tags.push(`<meta name="citation_publication_date" content="${data.citationDate}" />`);
  if (data.citationUrl || data.canonical) tags.push(`<meta name="citation_online_date" content="${data.citationUrl || data.canonical}" />`);

  // Article tags
  if (data.articleSection) tags.push(`<meta property="article:section" content="${data.articleSection}" />`);
  if (data.articleTag) tags.push(`<meta property="article:tag" content="${data.articleTag}" />`);
  if (data.publishedTime) tags.push(`<meta property="article:published_time" content="${data.publishedTime}" />`);
  if (data.modifiedTime) tags.push(`<meta property="article:modified_time" content="${data.modifiedTime}" />`);

  return tags.join("\n");
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-base font-medium text-gray-300 mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field" />
    </div>
  );
}

export default function MetaTagGeneratorPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const update = (key: string, value: string) => setData({ ...data, [key]: value });
  const output = generateMetaTags(data);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Meta Tag Generator</h1>
        <p className="text-lg text-gray-400">
          Generate Open Graph, Twitter Card, and AI-specific meta tags. Includes citation tags that help AI search engines attribute and cite your content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-brand-400 mb-4">Basic Meta</h3>
            <div className="space-y-4">
              <Field label="Title" value={data.title} onChange={(v) => update("title", v)} placeholder="Page title (under 60 chars)" />
              <Field label="Description" value={data.description} onChange={(v) => update("description", v)} placeholder="Page description (under 160 chars)" />
              <Field label="Keywords" value={data.keywords} onChange={(v) => update("keywords", v)} placeholder="comma, separated, keywords" />
              <Field label="Author" value={data.author} onChange={(v) => update("author", v)} placeholder="Author name" />
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Robots</label>
                <select value={data.robots} onChange={(e) => update("robots", e.target.value)} className="input-field">
                  <option value="" className="bg-gray-800">—</option>
                  <option value="index, follow" className="bg-gray-800">index, follow</option>
                  <option value="noindex, follow" className="bg-gray-800">noindex, follow</option>
                  <option value="index, nofollow" className="bg-gray-800">index, nofollow</option>
                  <option value="noindex, nofollow" className="bg-gray-800">noindex, nofollow</option>
                </select>
              </div>
              <Field label="Canonical URL" value={data.canonical} onChange={(v) => update("canonical", v)} placeholder="https://yoursite.com/page" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-400 mb-4">Open Graph</h3>
            <div className="space-y-4">
              <Field label="OG Title" value={data.ogTitle} onChange={(v) => update("ogTitle", v)} placeholder="Defaults to Title" />
              <Field label="OG Description" value={data.ogDesc} onChange={(v) => update("ogDesc", v)} placeholder="Defaults to Description" />
              <Field label="OG URL" value={data.ogUrl} onChange={(v) => update("ogUrl", v)} placeholder="Defaults to Canonical URL" />
              <Field label="OG Image URL" value={data.ogImage} onChange={(v) => update("ogImage", v)} placeholder="https://yoursite.com/image.jpg (1200x630)" />
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">OG Type</label>
                <select value={data.ogType} onChange={(e) => update("ogType", e.target.value)} className="input-field">
                  <option value="" className="bg-gray-800">—</option>
                  <option value="website" className="bg-gray-800">website</option>
                  <option value="article" className="bg-gray-800">article</option>
                  <option value="product" className="bg-gray-800">product</option>
                </select>
              </div>
              <Field label="Site Name" value={data.siteName} onChange={(v) => update("siteName", v)} placeholder="Your Site Name" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-400 mb-4">Twitter Card</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-gray-300 mb-2">Card Type</label>
                <select value={data.twitterCard} onChange={(e) => update("twitterCard", e.target.value)} className="input-field">
                  <option value="" className="bg-gray-800">—</option>
                  <option value="summary" className="bg-gray-800">summary</option>
                  <option value="summary_large_image" className="bg-gray-800">summary_large_image</option>
                </select>
              </div>
              <Field label="Twitter Site (@handle)" value={data.twitterSite} onChange={(v) => update("twitterSite", v)} placeholder="@yoursite" />
              <Field label="Twitter Creator (@handle)" value={data.twitterCreator} onChange={(v) => update("twitterCreator", v)} placeholder="@author" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-400 mb-4">AI-Specific Tags</h3>
            <div className="space-y-4">
              <Field label="AI Summary" value={data.aiSummary} onChange={(v) => update("aiSummary", v)} placeholder="One-sentence summary for AI models" />
              <Field label="AI Keywords" value={data.aiKeywords} onChange={(v) => update("aiKeywords", v)} placeholder="AI-targeted keywords" />
              <Field label="Citation Author" value={data.citationAuthor} onChange={(v) => update("citationAuthor", v)} placeholder="Author for citation" />
              <Field label="Citation Title" value={data.citationTitle} onChange={(v) => update("citationTitle", v)} placeholder="Defaults to Title" />
              <Field label="Citation Date" value={data.citationDate} onChange={(v) => update("citationDate", v)} placeholder="2026-01-15" />
              <Field label="Published Time" value={data.publishedTime} onChange={(v) => update("publishedTime", v)} placeholder="2026-01-15T08:00:00Z" />
              <Field label="Modified Time" value={data.modifiedTime} onChange={(v) => update("modifiedTime", v)} placeholder="2026-01-16T10:00:00Z" />
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-gray-300">Generated Meta Tags</h3>
            <button onClick={copyToClipboard} className="btn-secondary text-sm py-1.5 px-3">
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre className="code-block min-h-[400px] whitespace-pre-wrap">{output || "<!-- Fill in fields to generate tags -->"}</pre>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-base text-gray-400">
            <p className="mb-2 font-medium text-gray-300">How to deploy:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the generated tags</li>
              <li>Paste into your page&apos;s <code className="text-brand-400">&lt;head&gt;</code> section</li>
              <li>Test with Facebook Debugger &amp; Twitter Card Validator</li>
              <li>Verify in Google Search Console</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Educational FAQ Section */}
      <div className="mt-16 border-t border-gray-800 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">🏷️ Open Graph &amp; AI-Specific Meta Tags FAQ</h2>
          <p className="text-gray-400">Understand how social metadata and AI attribution tags help chatbots index and cite your pages.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-400">
          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">1. Do AI search engines use Open Graph and Twitter Cards?</h3>
            <p>
              Yes. When Perplexity or ChatGPT Search cites your website in an answer, they generate a rich visual preview card. They crawl your <code>og:title</code>, <code>og:description</code>, and <code>og:image</code> tags to build these preview snippets.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">2. What are AI-specific tags (like ai:summary)?</h3>
            <p>
              AI-specific meta tags (such as <code>ai:summary</code> or <code>ai:keywords</code>) are custom tags that target LLM crawlers. By providing a clean, one-sentence page summary, you give AI models an instant summary that bypasses parsing noise, reducing hallucination in citations.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">3. What is the role of Google Scholar Citation tags?</h3>
            <p>
              If you host technical papers, case studies, or blog guides, adding citation metadata (e.g. <code>citation_title</code>, <code>citation_author</code>) helps academic and technical search models (like Consensus or Google Scholar) parse and cite your pages correctly.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-white text-base">4. How do I test if my meta tags are active?</h3>
            <p>
              You can test your metadata by using official sharing checkers like the **Facebook Sharing Debugger** or **LinkedIn Post Inspector**, or use our **AI Crawler Tester** to see exactly how bots scrape your tag blocks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
