"use client";

import { useState } from "react";

type SchemaType = "Article" | "Product" | "FAQPage" | "Organization" | "HowTo" | "SoftwareApplication";

const schemaTypes: { value: SchemaType; label: string; desc: string }[] = [
  { value: "Article", label: "Article", desc: "Blog posts, news articles, editorial content" },
  { value: "Product", label: "Product", desc: "E-commerce products with pricing" },
  { value: "FAQPage", label: "FAQ Page", desc: "Question and answer pages — 3.2x more likely to be cited in AI Overviews" },
  { value: "Organization", label: "Organization", desc: "Company/brand info for knowledge panels" },
  { value: "HowTo", label: "How-To", desc: "Step-by-step guides and tutorials" },
  { value: "SoftwareApplication", label: "Software Application", desc: "SaaS products and apps" },
];

interface FaqItem {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
}

function generateSchema(
  type: SchemaType,
  data: Record<string, string>,
  faqs: FaqItem[],
  steps: HowToStep[]
): string {
  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": type,
  };

  if (type === "Article") {
    base.headline = data.headline || "";
    base.description = data.description || "";
    base.datePublished = data.datePublished || "";
    base.dateModified = data.dateModified || data.datePublished || "";
    if (data.image) base.image = data.image;
    if (data.url) base.url = data.url;
    base.author = { "@type": "Person", name: data.author || "" };
    base.publisher = {
      "@type": "Organization",
      name: data.publisher || "",
      ...(data.logo ? { logo: { "@type": "ImageObject", url: data.logo } } : {}),
    };
  } else if (type === "Product") {
    base.name = data.name || "";
    base.description = data.description || "";
    if (data.image) base.image = data.image;
    if (data.brand) base.brand = data.brand;
    base.offers = {
      "@type": "Offer",
      price: data.price || "",
      priceCurrency: data.currency || "USD",
      availability: `https://schema.org/${data.availability || "InStock"}`,
    };
    if (data.rating && data.reviewCount) {
      base.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: data.rating,
        reviewCount: data.reviewCount,
      };
    }
  } else if (type === "FAQPage") {
    base.mainEntity = faqs
      .filter((f) => f.question && f.answer)
      .map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      }));
  } else if (type === "Organization") {
    base.name = data.name || "";
    base.url = data.url || "";
    if (data.logo) base.logo = data.logo;
    if (data.description) base.description = data.description;
    if (data.sameAs) {
      base.sameAs = data.sameAs.split(",").map((s) => s.trim()).filter(Boolean);
    }
  } else if (type === "HowTo") {
    base.name = data.name || "";
    base.description = data.description || "";
    base.step = steps
      .filter((s) => s.name)
      .map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text || s.name,
      }));
  } else if (type === "SoftwareApplication") {
    base.name = data.name || "";
    base.description = data.description || "";
    base.applicationCategory = data.category || "BusinessApplication";
    base.operatingSystem = data.os || "Web";
    base.offers = {
      "@type": "Offer",
      price: data.price || "0",
      priceCurrency: data.currency || "USD",
    };
    if (data.rating && data.reviewCount) {
      base.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: data.rating,
        reviewCount: data.reviewCount,
      };
    }
  }

  return JSON.stringify(base, null, 2);
}

export default function SchemaGeneratorPage() {
  const [type, setType] = useState<SchemaType>("Article");
  const [data, setData] = useState<Record<string, string>>({});
  const [faqs, setFaqs] = useState<FaqItem[]>([
    { question: "", answer: "" },
  ]);
  const [steps, setSteps] = useState<HowToStep[]>([
    { name: "", text: "" },
  ]);
  const [copied, setCopied] = useState(false);

  const update = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  const output = generateSchema(type, data, faqs, steps);
  const jsonLdBlock = `<script type="application/ld+json">\n${output}\n</script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonLdBlock);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFields = () => {
    switch (type) {
      case "Article":
        return (
          <>
            <Field label="Headline *" value={data.headline} onChange={(v) => update("headline", v)} placeholder="Your article title" />
            <Field label="Description" value={data.description} onChange={(v) => update("description", v)} placeholder="Article summary" />
            <Field label="URL" value={data.url} onChange={(v) => update("url", v)} placeholder="https://yoursite.com/article" />
            <Field label="Image URL" value={data.image} onChange={(v) => update("image", v)} placeholder="https://yoursite.com/image.jpg" />
            <Field label="Date Published *" value={data.datePublished} onChange={(v) => update("datePublished", v)} placeholder="2026-01-15" />
            <Field label="Date Modified" value={data.dateModified} onChange={(v) => update("dateModified", v)} placeholder="2026-01-16" />
            <Field label="Author *" value={data.author} onChange={(v) => update("author", v)} placeholder="John Doe" />
            <Field label="Publisher *" value={data.publisher} onChange={(v) => update("publisher", v)} placeholder="Company name" />
            <Field label="Publisher Logo URL" value={data.logo} onChange={(v) => update("logo", v)} placeholder="https://yoursite.com/logo.png" />
          </>
        );
      case "Product":
        return (
          <>
            <Field label="Product Name *" value={data.name} onChange={(v) => update("name", v)} placeholder="Product name" />
            <Field label="Description" value={data.description} onChange={(v) => update("description", v)} placeholder="Product description" />
            <Field label="Image URL" value={data.image} onChange={(v) => update("image", v)} placeholder="https://yoursite.com/product.jpg" />
            <Field label="Brand" value={data.brand} onChange={(v) => update("brand", v)} placeholder="Brand name" />
            <Field label="Price *" value={data.price} onChange={(v) => update("price", v)} placeholder="29.99" />
            <Field label="Currency" value={data.currency} onChange={(v) => update("currency", v)} placeholder="USD" />
            <Field label="Availability" value={data.availability} onChange={(v) => update("availability", v)} placeholder="InStock" />
            <Field label="Rating (0-5)" value={data.rating} onChange={(v) => update("rating", v)} placeholder="4.5" />
            <Field label="Review Count" value={data.reviewCount} onChange={(v) => update("reviewCount", v)} placeholder="128" />
          </>
        );
      case "FAQPage":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">Add your FAQ questions and answers. FAQPage schema is 3.2x more likely to be cited in Google AI Overviews.</p>
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Q&A {i + 1}</span>
                  {faqs.length > 1 && (
                    <button onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
                <input type="text" value={faq.question} onChange={(e) => setFaqs(faqs.map((f, idx) => idx === i ? { ...f, question: e.target.value } : f))} placeholder="Question" className="input-field text-sm" />
                <textarea value={faq.answer} onChange={(e) => setFaqs(faqs.map((f, idx) => idx === i ? { ...f, answer: e.target.value } : f))} placeholder="Answer" rows={2} className="input-field text-sm" />
              </div>
            ))}
            <button onClick={() => setFaqs([...faqs, { question: "", answer: "" }])} className="text-sm text-brand-400 hover:text-brand-300">+ Add Q&A</button>
          </div>
        );
      case "Organization":
        return (
          <>
            <Field label="Organization Name *" value={data.name} onChange={(v) => update("name", v)} placeholder="Company name" />
            <Field label="Website URL *" value={data.url} onChange={(v) => update("url", v)} placeholder="https://yoursite.com" />
            <Field label="Logo URL" value={data.logo} onChange={(v) => update("logo", v)} placeholder="https://yoursite.com/logo.png" />
            <Field label="Description" value={data.description} onChange={(v) => update("description", v)} placeholder="Company description" />
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Social Profiles (comma-separated URLs)</label>
              <textarea value={data.sameAs} onChange={(e) => update("sameAs", e.target.value)} placeholder="https://twitter.com/yourbrand, https://github.com/yourbrand" rows={2} className="input-field text-sm" />
            </div>
          </>
        );
      case "HowTo":
        return (
          <div className="space-y-4">
            <Field label="Guide Title *" value={data.name} onChange={(v) => update("name", v)} placeholder="How to optimize for AI search" />
            <Field label="Description" value={data.description} onChange={(v) => update("description", v)} placeholder="A brief description of the guide" />
            {steps.map((step, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Step {i + 1}</span>
                  {steps.length > 1 && (
                    <button onClick={() => setSteps(steps.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
                <input type="text" value={step.name} onChange={(e) => setSteps(steps.map((s, idx) => idx === i ? { ...s, name: e.target.value } : s))} placeholder="Step title" className="input-field text-sm" />
                <textarea value={step.text} onChange={(e) => setSteps(steps.map((s, idx) => idx === i ? { ...s, text: e.target.value } : s))} placeholder="Step instructions" rows={2} className="input-field text-sm" />
              </div>
            ))}
            <button onClick={() => setSteps([...steps, { name: "", text: "" }])} className="text-sm text-brand-400 hover:text-brand-300">+ Add Step</button>
          </div>
        );
      case "SoftwareApplication":
        return (
          <>
            <Field label="App Name *" value={data.name} onChange={(v) => update("name", v)} placeholder="Your SaaS name" />
            <Field label="Description" value={data.description} onChange={(v) => update("description", v)} placeholder="App description" />
            <Field label="Category" value={data.category} onChange={(v) => update("category", v)} placeholder="BusinessApplication" />
            <Field label="Operating System" value={data.os} onChange={(v) => update("os", v)} placeholder="Web" />
            <Field label="Price" value={data.price} onChange={(v) => update("price", v)} placeholder="0" />
            <Field label="Currency" value={data.currency} onChange={(v) => update("currency", v)} placeholder="USD" />
            <Field label="Rating (0-5)" value={data.rating} onChange={(v) => update("rating", v)} placeholder="4.5" />
            <Field label="Review Count" value={data.reviewCount} onChange={(v) => update("reviewCount", v)} placeholder="128" />
          </>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-3">Schema for AI Generator</h1>
        <p className="text-gray-400">
          Generate AI-friendly JSON-LD structured data that helps ChatGPT, Perplexity, and Google AI Overviews understand and cite your content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Schema Type</label>
            <div className="grid grid-cols-2 gap-2">
              {schemaTypes.map((st) => (
                <button
                  key={st.value}
                  onClick={() => { setType(st.value); setData({}); }}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    type === st.value
                      ? "border-brand-500 bg-brand-500/10"
                      : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                  }`}
                >
                  <div className="text-sm font-medium text-white">{st.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>
          {renderFields()}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-300">JSON-LD Output</h3>
            <button onClick={copyToClipboard} className="btn-secondary text-sm py-1.5 px-3">
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre className="code-block min-h-[400px] whitespace-pre-wrap">{jsonLdBlock}</pre>
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4 text-sm text-gray-400">
            <p className="mb-2 font-medium text-gray-300">How to deploy:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the JSON-LD script tag</li>
              <li>Paste into your page&apos;s <code className="text-brand-400">&lt;head&gt;</code> section</li>
              <li>Test with Google&apos;s Rich Results Test</li>
              <li>Monitor in Google Search Console</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field" />
    </div>
  );
}
