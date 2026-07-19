"use client";

import { useState } from "react";

type SchemaType =
  | "Article"
  | "Product"
  | "FAQPage"
  | "Organization"
  | "HowTo"
  | "SoftwareApplication"
  | "Person"
  | "LocalBusiness"
  | "BreadcrumbList"
  | "VideoObject";

const schemaTypes: { value: SchemaType; label: string; desc: string }[] = [
  { value: "Article", label: "Article", desc: "Blog posts, news articles, editorial content" },
  { value: "Product", label: "Product", desc: "E-commerce products with pricing" },
  { value: "FAQPage", label: "FAQ Page", desc: "Question and answer pages — 3.2x more cited in AI Overviews" },
  { value: "Organization", label: "Organization", desc: "Company/brand info for knowledge panels" },
  { value: "HowTo", label: "How-To", desc: "Step-by-step guides and tutorials" },
  { value: "SoftwareApplication", label: "Software Application", desc: "SaaS products and apps" },
  { value: "Person", label: "Person", desc: "Personal E-E-A-T credentials and social links" },
  { value: "LocalBusiness", label: "Local Business", desc: "Physical stores, offices, and services" },
  { value: "BreadcrumbList", label: "Breadcrumbs", desc: "Navigation structure for rich snippets" },
  { value: "VideoObject", label: "Video", desc: "Video descriptions, thumbnails, and dates" },
];

interface FaqItem {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

function generateSchema(
  type: SchemaType,
  data: Record<string, string>,
  faqs: FaqItem[],
  steps: HowToStep[],
  breadcrumbs: BreadcrumbItem[]
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
  } else if (type === "Person") {
    base.name = data.name || "";
    if (data.jobTitle) base.jobTitle = data.jobTitle;
    if (data.worksFor) base.worksFor = { "@type": "Organization", name: data.worksFor };
    if (data.url) base.url = data.url;
    if (data.image) base.image = data.image;
    if (data.sameAs) {
      base.sameAs = data.sameAs.split(",").map((s) => s.trim()).filter(Boolean);
    }
  } else if (type === "LocalBusiness") {
    base.name = data.name || "";
    if (data.image) base.image = data.image;
    if (data.telephone) base.telephone = data.telephone;
    if (data.url) base.url = data.url;
    if (data.priceRange) base.priceRange = data.priceRange;
    base.address = {
      "@type": "PostalAddress",
      streetAddress: data.streetAddress || "",
      addressLocality: data.locality || "",
      addressRegion: data.region || "",
      postalCode: data.postalCode || "",
      addressCountry: data.country || "US",
    };
  } else if (type === "BreadcrumbList") {
    base.itemListElement = breadcrumbs
      .filter((b) => b.name && b.url)
      .map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.url,
      }));
  } else if (type === "VideoObject") {
    base.name = data.name || "";
    base.description = data.description || "";
    if (data.thumbnailUrl) base.thumbnailUrl = data.thumbnailUrl.split(",").map((s) => s.trim()).filter(Boolean);
    if (data.uploadDate) base.uploadDate = data.uploadDate;
    if (data.contentUrl) base.contentUrl = data.contentUrl;
    if (data.embedUrl) base.embedUrl = data.embedUrl;
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
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { name: "Home", url: "https://yoursite.com" },
    { name: "Blog", url: "https://yoursite.com/blog" },
  ]);
  const [copied, setCopied] = useState(false);

  const update = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  const output = generateSchema(type, data, faqs, steps, breadcrumbs);
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
            <p className="text-sm text-gray-500 dark:text-gray-400">Add your FAQ questions and answers. FAQPage schema is 3.2x more likely to be cited in Google AI Overviews.</p>
            {faqs.map((faq, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-3">
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
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Social Profiles (comma-separated URLs)</label>
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
              <div key={i} className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-3">
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
      case "Person":
        return (
          <>
            <Field label="Person Name *" value={data.name} onChange={(v) => update("name", v)} placeholder="Jane Doe" />
            <Field label="Job Title" value={data.jobTitle} onChange={(v) => update("jobTitle", v)} placeholder="Chief SEO Specialist" />
            <Field label="Works For (Organization)" value={data.worksFor} onChange={(v) => update("worksFor", v)} placeholder="Acme Corp" />
            <Field label="Website URL" value={data.url} onChange={(v) => update("url", v)} placeholder="https://janedoe.com" />
            <Field label="Image URL" value={data.image} onChange={(v) => update("image", v)} placeholder="https://janedoe.com/avatar.jpg" />
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Social Profiles (comma-separated URLs)</label>
              <textarea value={data.sameAs} onChange={(e) => update("sameAs", e.target.value)} placeholder="https://linkedin.com/in/jane, https://github.com/jane" rows={2} className="input-field text-sm" />
            </div>
          </>
        );
      case "LocalBusiness":
        return (
          <>
            <Field label="Business Name *" value={data.name} onChange={(v) => update("name", v)} placeholder="SuperDental Clinic" />
            <Field label="Street Address" value={data.streetAddress} onChange={(v) => update("streetAddress", v)} placeholder="123 Main St" />
            <Field label="Locality / City" value={data.locality} onChange={(v) => update("locality", v)} placeholder="New York" />
            <Field label="Region / State" value={data.region} onChange={(v) => update("region", v)} placeholder="NY" />
            <Field label="Postal / Zip Code" value={data.postalCode} onChange={(v) => update("postalCode", v)} placeholder="10001" />
            <Field label="Country Code" value={data.country} onChange={(v) => update("country", v)} placeholder="US" />
            <Field label="Telephone" value={data.telephone} onChange={(v) => update("telephone", v)} placeholder="+1-555-555-5555" />
            <Field label="Price Range ($$, $$$)" value={data.priceRange} onChange={(v) => update("priceRange", v)} placeholder="$$" />
            <Field label="Website URL" value={data.url} onChange={(v) => update("url", v)} placeholder="https://superdental.com" />
            <Field label="Image URL" value={data.image} onChange={(v) => update("image", v)} placeholder="https://superdental.com/facade.jpg" />
          </>
        );
      case "BreadcrumbList":
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Define the breadcrumb navigation items in hierarchical order.</p>
            {breadcrumbs.map((bc, i) => (
              <div key={i} className="space-y-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Breadcrumb {i + 1}</span>
                  {breadcrumbs.length > 1 && (
                    <button onClick={() => setBreadcrumbs(breadcrumbs.filter((_, idx) => idx !== i))} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
                <input type="text" value={bc.name} onChange={(e) => setBreadcrumbs(breadcrumbs.map((b, idx) => idx === i ? { ...b, name: e.target.value } : b))} placeholder="Page Name (e.g. Products)" className="input-field text-sm" />
                <input type="text" value={bc.url} onChange={(e) => setBreadcrumbs(breadcrumbs.map((b, idx) => idx === i ? { ...b, url: e.target.value } : b))} placeholder="URL (e.g. https://yoursite.com/products)" className="input-field text-sm" />
              </div>
            ))}
            <button onClick={() => setBreadcrumbs([...breadcrumbs, { name: "", url: "" }])} className="text-sm text-brand-400 hover:text-brand-300">+ Add Level</button>
          </div>
        );
      case "VideoObject":
        return (
          <>
            <Field label="Video Title *" value={data.name} onChange={(v) => update("name", v)} placeholder="Product Walkthrough" />
            <Field label="Description" value={data.description} onChange={(v) => update("description", v)} placeholder="A detailed walk through video of the SaaS tool" />
            <Field label="Thumbnail URLs (comma-separated)" value={data.thumbnailUrl} onChange={(v) => update("thumbnailUrl", v)} placeholder="https://yoursite.com/thumb.jpg" />
            <Field label="Upload Date" value={data.uploadDate} onChange={(v) => update("uploadDate", v)} placeholder="2026-01-15T08:00:00+08:00" />
            <Field label="Content Video File URL" value={data.contentUrl} onChange={(v) => update("contentUrl", v)} placeholder="https://yoursite.com/video.mp4" />
            <Field label="Embed HTML Page URL" value={data.embedUrl} onChange={(v) => update("embedUrl", v)} placeholder="https://yoursite.com/video-embed" />
          </>
        );
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Schema for AI Generator</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Generate AI-friendly JSON-LD structured data that helps ChatGPT, Perplexity, and Google AI Overviews understand and cite your content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">Schema Type</label>
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
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{st.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{st.desc}</div>
                </button>
              ))}
            </div>
          </div>
          {renderFields()}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">JSON-LD Output</h3>
            <button onClick={copyToClipboard} className="btn-secondary text-sm py-1.5 px-3">
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <pre className="code-block min-h-[400px] whitespace-pre-wrap">{jsonLdBlock}</pre>
          <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-50 dark:bg-gray-900/50 p-4 text-sm text-gray-500 dark:text-gray-400">
            <p className="mb-2 font-medium text-gray-600 dark:text-gray-300">How to deploy:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copy the JSON-LD script tag</li>
              <li>Paste into your page&apos;s <code className="text-brand-400">&lt;head&gt;</code> section</li>
              <li>Test with Google&apos;s Rich Results Test</li>
              <li>Monitor in Google Search Console</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Educational FAQ Section */}
      <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">💎 Schema Markup &amp; AI Entity Optimization FAQ</h2>
          <p className="text-gray-500 dark:text-gray-400">Learn how structured JSON-LD helps ChatGPT, Claude, and Perplexity index and attribute your website.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">1. Why is Schema markup important for AI search?</h3>
            <p>
              AI models construct "knowledge graphs" of entities (people, products, places, organizations). Standard HTML is difficult to parse reliably. JSON-LD schema acts as an explicit translation layer, feeding AI crawlers clear relationships, which increases your citation rate by up to 3.2x.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">2. How does the Person schema help with E-E-A-T?</h3>
            <p>
              AI crawlers look for signs of Experience, Expertise, Authoritativeness, and Trust (E-E-A-T). By generating a <code>Person</code> schema for your authors—including links to their LinkedIn or GitHub via the <code>sameAs</code> attribute—you verify their identity and authority in the model's training data.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">3. What is the difference between Schema.org Validator and Google Rich Results Test?</h3>
            <p>
              The **Schema.org Validator** checks general vocabulary syntax and logical schema compliance globally. The **Google Rich Results Test** checks if your markup qualifies for specific search features on Google (like review stars, product prices, or FAQ dropdowns). You should use both.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-white text-base">4. Where should I insert the JSON-LD script?</h3>
            <p>
              You can insert the generated <code>&lt;script type="application/ld+json"&gt;</code> block anywhere in the HTML—either in the <code>&lt;head&gt;</code> or the <code>&lt;body&gt;</code>. We recommend pasting it into the head section for better crawling speed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="input-field" />
    </div>
  );
}
