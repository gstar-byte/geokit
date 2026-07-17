"use client";

import { useState } from "react";

/* ── 类型定义 ── */
interface ValidationItem {
  status: "pass" | "fail" | "warn";
  label: string;
  message: string;
}

const KNOWN_TYPES = [
  "Article", "Product", "FAQPage", "Organization", "HowTo",
  "SoftwareApplication", "WebSite", "WebPage", "BreadcrumbList",
  "LocalBusiness", "Person", "Event", "Recipe", "Review", "VideoObject",
];

const REQUIRED_FIELDS: Record<string, string[]> = {
  Article: ["headline", "author"],
  Product: ["name", "offers"],
  FAQPage: ["mainEntity"],
  Organization: ["name", "url"],
  HowTo: ["name", "step"],
  SoftwareApplication: ["name", "offers"],
};

const statusConfig = {
  pass: { color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/30", icon: "✓" },
  fail: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30", icon: "✗" },
  warn: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/30", icon: "⚠" },
};

/* ── 校验逻辑 ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateSchema(raw: string): { items: ValidationItem[]; parsed: any | null } {
  const items: ValidationItem[] = [];

  // 1. JSON 语法
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
    items.push({ status: "pass", label: "JSON Syntax", message: "Valid JSON — parsed successfully." });
  } catch (e) {
    items.push({ status: "fail", label: "JSON Syntax", message: `Invalid JSON — ${(e as Error).message}` });
    return { items, parsed: null };
  }

  // 处理数组（取第一个元素做后续校验）
  const schema = Array.isArray(parsed) ? parsed[0] : parsed;
  if (!schema || typeof schema !== "object") {
    items.push({ status: "fail", label: "Schema Structure", message: "Root must be an object or non-empty array of objects." });
    return { items, parsed: null };
  }

  // 2. @context
  if (schema["@context"] === "https://schema.org") {
    items.push({ status: "pass", label: "@context", message: 'Context is set to "https://schema.org".' });
  } else if (schema["@context"]) {
    items.push({ status: "warn", label: "@context", message: `Context is "${schema["@context"]}" — expected "https://schema.org".` });
  } else {
    items.push({ status: "fail", label: "@context", message: "Missing @context — must be \"https://schema.org\"." });
  }

  // 3. @type
  const schemaType: string | undefined = schema["@type"];
  if (!schemaType) {
    items.push({ status: "fail", label: "@type", message: "Missing @type field." });
  } else if (KNOWN_TYPES.includes(schemaType)) {
    items.push({ status: "pass", label: "@type", message: `Type "${schemaType}" is a recognized schema.org type.` });
  } else {
    items.push({ status: "warn", label: "@type", message: `Type "${schemaType}" is not in the common rich-result types list.` });
  }

  // 4. 必填字段
  if (schemaType && REQUIRED_FIELDS[schemaType]) {
    for (const field of REQUIRED_FIELDS[schemaType]) {
      const value = schema[field];
      if (value !== undefined && value !== null && value !== "") {
        if (field === "mainEntity" && Array.isArray(value) && value.length === 0) {
          items.push({ status: "fail", label: `Required: ${field}`, message: `"${field}" array is empty — at least one entry needed.` });
        } else {
          items.push({ status: "pass", label: `Required: ${field}`, message: `"${field}" is present.` });
        }
      } else {
        items.push({ status: "fail", label: `Required: ${field}`, message: `Missing required field "${field}" for ${schemaType}.` });
      }
    }
  }

  // 5. URL 格式
  const urlKeys = Object.keys(schema).filter(
    (k) => /url|image|logo/i.test(k)
  );
  for (const key of urlKeys) {
    const val = typeof schema[key] === "string" ? schema[key] : (typeof schema[key] === "object" && schema[key]?.url ? schema[key].url : null);
    if (val && typeof val === "string") {
      if (/^https?:\/\//.test(val)) {
        items.push({ status: "pass", label: `URL format: ${key}`, message: `"${key}" starts with http(s)://.` });
      } else {
        items.push({ status: "warn", label: `URL format: ${key}`, message: `"${key}" value "${val}" does not start with http(s)://.` });
      }
    }
  }

  // 6. 日期格式
  const dateKeys = Object.keys(schema).filter((k) => /date/i.test(k));
  for (const key of dateKeys) {
    const val = schema[key];
    if (typeof val === "string" && val) {
      if (/^\d{4}-\d{2}-\d{2}/.test(val)) {
        items.push({ status: "pass", label: `Date format: ${key}`, message: `"${key}" follows YYYY-MM-DD format.` });
      } else {
        items.push({ status: "warn", label: `Date format: ${key}`, message: `"${key}" value "${val}" — expected YYYY-MM-DD format.` });
      }
    }
  }

  // 7. description
  if (!schema.description) {
    items.push({ status: "warn", label: "description", message: "No description field — recommended for rich results." });
  } else {
    items.push({ status: "pass", label: "description", message: "Description field is present." });
  }

  // 8. image / logo
  const hasVisual = schema.image || schema.logo || schema.thumbnailUrl;
  if (!hasVisual) {
    items.push({ status: "warn", label: "image / logo", message: "No image or logo field — recommended for visual rich results." });
  } else {
    items.push({ status: "pass", label: "image / logo", message: "Visual asset (image/logo) is present." });
  }

  return { items, parsed: schema };
}

/* ── 预览组件 ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RichResultsPreview({ schema }: { schema: any }) {
  const type: string = schema?.["@type"] || "";

  /* Article */
  if (type === "Article") {
    const title = schema.headline || schema.name || "Article Title";
    const desc = schema.description || "";
    const authorName = typeof schema.author === "string" ? schema.author : schema.author?.name || "";
    const date = schema.datePublished || "";
    const url = schema.url || "https://example.com/article";
    const image = typeof schema.image === "string" ? schema.image : schema.image?.url;
    return (
      <div className="space-y-1">
        <div className="text-sm text-green-700 truncate">{url}</div>
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl text-blue-700 hover:underline cursor-pointer font-medium leading-snug truncate">{title}</h3>
            {(date || authorName) && (
              <div className="text-xs text-gray-500 mt-1">
                {date && <span>{date}</span>}
                {date && authorName && <span> — </span>}
                {authorName && <span>{authorName}</span>}
              </div>
            )}
            {desc && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{desc}</p>}
          </div>
          {image && (
            <div className="w-24 h-24 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-400 text-xs">IMG</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* Product */
  if (type === "Product") {
    const name = schema.name || "Product Name";
    const desc = schema.description || "";
    const rating = parseFloat(schema.aggregateRating?.ratingValue || schema.ratingValue || "0");
    const reviewCount = schema.aggregateRating?.reviewCount || schema.reviewCount || "";
    const price = schema.offers?.price || schema.price || "";
    const currency = schema.offers?.priceCurrency || schema.priceCurrency || "USD";
    const availability = schema.offers?.availability || "";
    const avail = availability.includes("InStock") ? "In stock" : availability.includes("OutOfStock") ? "Out of stock" : availability ? availability.split("/").pop() : "";

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.round(rating) ? "text-yellow-400" : "text-gray-300"}>
          {i <= Math.round(rating) ? "★" : "☆"}
        </span>
      );
    }

    return (
      <div className="space-y-2">
        <h3 className="text-xl text-blue-700 font-medium">{name}</h3>
        {rating > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="flex gap-0.5">{stars}</span>
            <span className="text-gray-600 font-medium">{rating.toFixed(1)}</span>
            {reviewCount && <span className="text-gray-500">({reviewCount} reviews)</span>}
          </div>
        )}
        {price && (
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-gray-900">{currency === "USD" ? "$" : currency}{price}</span>
            {avail && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${avail === "In stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {avail}
              </span>
            )}
          </div>
        )}
        {desc && <p className="text-sm text-gray-600 line-clamp-2">{desc}</p>}
      </div>
    );
  }

  /* FAQPage */
  if (type === "FAQPage") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const questions: any[] = schema.mainEntity || [];
    return (
      <div className="space-y-0 divide-y divide-gray-200">
        <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold pb-2">People also ask</div>
        {questions.slice(0, 5).map((q, i) => (
          <FaqAccordionItem key={i} question={q.name || q.question || `Question ${i + 1}`} answer={q.acceptedAnswer?.text || q.answer || ""} defaultOpen={i < 2} />
        ))}
        {questions.length === 0 && <div className="text-sm text-gray-400 py-2">No questions found in mainEntity.</div>}
      </div>
    );
  }

  /* Organization */
  if (type === "Organization") {
    const name = schema.name || "Organization";
    const desc = schema.description || "";
    const url = schema.url || "";
    const logo = typeof schema.logo === "string" ? schema.logo : schema.logo?.url;
    const socials: string[] = Array.isArray(schema.sameAs) ? schema.sameAs : [];
    return (
      <div className="flex gap-5">
        {logo && (
          <div className="w-20 h-20 rounded-xl bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-400 text-xs font-bold">LOGO</div>
          </div>
        )}
        <div className="flex-1 min-w-0 space-y-1">
          <h3 className="text-xl font-bold text-gray-900">{name}</h3>
          {desc && <p className="text-sm text-gray-600 line-clamp-3">{desc}</p>}
          {url && <a className="text-sm text-blue-600 hover:underline block truncate" href="#">{url}</a>}
          {socials.length > 0 && (
            <div className="flex gap-2 pt-1 flex-wrap">
              {socials.map((s, i) => {
                let label = "Link";
                try { label = new URL(s).hostname.replace("www.", "").split(".")[0]; } catch { /* noop */ }
                return <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">{label}</span>;
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* HowTo */
  if (type === "HowTo") {
    const name = schema.name || "How-To Guide";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const steps: any[] = schema.step || [];
    return (
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">{name}</h3>
        {schema.description && <p className="text-sm text-gray-600">{schema.description}</p>}
        <div className="space-y-2">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-sm font-bold flex items-center justify-center">
                {s.position || i + 1}
              </span>
              <div className="pt-0.5">
                <div className="text-sm font-medium text-gray-900">{s.name || `Step ${i + 1}`}</div>
                {s.text && s.text !== s.name && <div className="text-xs text-gray-500 mt-0.5">{s.text}</div>}
              </div>
            </div>
          ))}
        </div>
        {steps.length === 0 && <div className="text-sm text-gray-400">No steps found.</div>}
      </div>
    );
  }

  /* Default / 其他 type */
  const title = schema.headline || schema.name || schema["@type"] || "Untitled";
  const desc = schema.description || "";
  const url = schema.url || "https://example.com";
  return (
    <div className="space-y-1">
      <div className="text-sm text-green-700 truncate">{url}</div>
      <h3 className="text-xl text-blue-700 hover:underline cursor-pointer font-medium leading-snug">{title}</h3>
      {desc && <p className="text-sm text-gray-600 line-clamp-3">{desc}</p>}
    </div>
  );
}

/* FAQ 手风琴子组件 */
function FaqAccordionItem({ question, answer, defaultOpen }: { question: string; answer: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="py-2">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between text-left group">
        <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700 transition-colors">{question}</span>
        <svg className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <p className="text-sm text-gray-600 mt-1 pl-0">{answer}</p>}
    </div>
  );
}

/* ── 示例 JSON-LD ── */
const EXAMPLE_JSON = `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Optimize Your Site for AI Search Engines",
  "description": "A comprehensive guide to GEO strategies that help ChatGPT, Perplexity, and Google AI Overviews cite your content.",
  "url": "https://example.com/geo-guide",
  "image": "https://example.com/images/geo-guide.jpg",
  "datePublished": "2026-07-15",
  "author": {
    "@type": "Person",
    "name": "Jane Doe"
  }
}`;

/* ── 主页面 ── */
export default function SchemaValidatorPage() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<ValidationItem[] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [parsedSchema, setParsedSchema] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleValidate = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const { items, parsed } = validateSchema(trimmed);
    setResults(items);
    setParsedSchema(parsed);
  };

  const loadExample = () => {
    setInput(EXAMPLE_JSON);
    setResults(null);
    setParsedSchema(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const passCount = results?.filter((r) => r.status === "pass").length || 0;
  const failCount = results?.filter((r) => r.status === "fail").length || 0;
  const warnCount = results?.filter((r) => r.status === "warn").length || 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Schema Validator &amp; Rich Results Preview</h1>
        <p className="text-gray-400">
          Paste your JSON-LD structured data to validate syntax, check required fields, and preview how it will appear in Google Rich Results and AI search.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ── 左列：输入 & 校验结果 ── */}
        <div className="space-y-6">
          {/* 输入框 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">JSON-LD Input</label>
              <div className="flex gap-2">
                <button onClick={loadExample} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Load Example
                </button>
                {input && (
                  <button onClick={handleCopy} className="text-xs text-gray-400 hover:text-gray-300 transition-colors">
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                )}
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleValidate();
              }}
              placeholder={'Paste your JSON-LD here...\n\n{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "...",\n  ...\n}'}
              className="input-field min-h-[400px] font-mono text-sm leading-relaxed"
              spellCheck={false}
            />
          </div>

          {/* 按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleValidate}
              disabled={!input.trim()}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Validate
            </button>
            {input && (
              <button
                onClick={() => { setInput(""); setResults(null); setParsedSchema(null); }}
                className="btn-secondary"
              >
                Clear
              </button>
            )}
          </div>

          {/* 校验结果 */}
          {results && (
            <div className="space-y-4">
              {/* 统计摘要 */}
              <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-400 font-medium">{passCount} passed</span>
                  <span className="text-red-400 font-medium">{failCount} failed</span>
                  <span className="text-yellow-400 font-medium">{warnCount} warnings</span>
                </div>
                {failCount === 0 && (
                  <p className="text-xs text-green-400/80 mt-2">
                    ✓ No critical errors — your schema looks valid for rich results!
                  </p>
                )}
              </div>

              {/* 逐项结果 */}
              <div className="space-y-2">
                {results.map((item, i) => {
                  const cfg = statusConfig[item.status];
                  return (
                    <div
                      key={i}
                      className={`rounded-lg border ${cfg.border} ${cfg.bg} p-3 flex items-start gap-3`}
                    >
                      <span className={`text-base ${cfg.color} flex-shrink-0 mt-0.5`}>{cfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white">{item.label}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{item.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── 右列：Rich Results Preview ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300">Rich Results Preview</h3>

          {parsedSchema ? (
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-400 ml-2">Google Search Preview</span>
              </div>
              <RichResultsPreview schema={parsedSchema} />
            </div>
          ) : (
            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-10 text-center">
              <div className="text-gray-600 text-4xl mb-3">🔍</div>
              <p className="text-sm text-gray-500">
                Paste valid JSON-LD and click <span className="text-brand-400">Validate</span> to see a preview of how your structured data will appear in Google Rich Results.
              </p>
            </div>
          )}

          {/* 支持的 type 列表 */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <p className="text-sm font-medium text-gray-300 mb-3">Supported Rich Result Types</p>
            <div className="flex flex-wrap gap-1.5">
              {KNOWN_TYPES.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-md bg-gray-800 text-gray-400 border border-gray-700">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* 提示 */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-sm text-gray-400">
            <p className="mb-2 font-medium text-gray-300">Tips for Rich Results</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Always include <code className="text-brand-400">@context</code> and <code className="text-brand-400">@type</code></li>
              <li>Add a <code className="text-brand-400">description</code> for better snippets</li>
              <li>Include an <code className="text-brand-400">image</code> for visual rich results</li>
              <li>Use YYYY-MM-DD format for date fields</li>
              <li>Validate with <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Google&apos;s Rich Results Test</a> before deployment</li>
            </ul>
          </div>

          {/* CTA — 链接到 Schema Generator */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-center">
            <p className="text-sm text-white font-medium mb-2">Need to create schema from scratch?</p>
            <a href="/tools/schema-generator" className="btn-secondary text-sm inline-block">
              Open Schema Generator →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
