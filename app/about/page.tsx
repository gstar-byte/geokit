import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-6">About GEOKit</h1>
      <div className="prose prose-invert max-w-none space-y-6 text-gray-400">
        <p>
          GEOKit is a free toolkit for <strong className="text-white">Generative Engine Optimization (GEO)</strong> —
          the practice of optimizing your website so that AI search engines like
          ChatGPT, Perplexity, and Google AI Overviews can understand, cite, and
          recommend your content.
        </p>
        <p>
          As AI search engines grow in popularity, traditional SEO is no longer
          enough. GEO focuses on making your site readable and citable by AI
          models through technical signals like <code className="text-brand-400">llms.txt</code>,
          AI crawler access, and structured data.
        </p>
        <h2 className="text-xl font-semibold text-white">Why GEOKit?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong className="text-white">100% Free</strong> — No signup, no premium plans, no limits</li>
          <li><strong className="text-white">100% Private</strong> — All tools run in your browser, nothing is sent to servers</li>
          <li><strong className="text-white">All-in-one</strong> — Everything you need for GEO in one place</li>
          <li><strong className="text-white">No tracking</strong> — We don&apos;t track you or store your data</li>
        </ul>
        <h2 className="text-xl font-semibold text-white">The Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
          <Link href="/tools/llms-txt-generator" className="tool-card group">
            <h3 className="text-white font-medium group-hover:text-brand-400">llms.txt Generator</h3>
            <p className="text-sm text-gray-500 mt-1">Create an llms.txt file for AI models</p>
          </Link>
          <Link href="/tools/ai-robots-txt-generator" className="tool-card group">
            <h3 className="text-white font-medium group-hover:text-brand-400">AI Robots.txt Generator</h3>
            <p className="text-sm text-gray-500 mt-1">Control AI crawler access</p>
          </Link>
          <Link href="/tools/schema-generator" className="tool-card group">
            <h3 className="text-white font-medium group-hover:text-brand-400">Schema for AI Generator</h3>
            <p className="text-sm text-gray-500 mt-1">Generate AI-friendly JSON-LD</p>
          </Link>
          <Link href="/tools/ai-readiness-checker" className="tool-card group">
            <h3 className="text-white font-medium group-hover:text-brand-400">AI Readiness Checker</h3>
            <p className="text-sm text-gray-500 mt-1">Score your site&apos;s AI readiness</p>
          </Link>
          <Link href="/tools/llms-txt-validator" className="tool-card group">
            <h3 className="text-white font-medium group-hover:text-brand-400">llms.txt Validator</h3>
            <p className="text-sm text-gray-500 mt-1">Validate your llms.txt file</p>
          </Link>
          <Link href="/tools/geo-checklist" className="tool-card group">
            <h3 className="text-white font-medium group-hover:text-brand-400">GEO Checklist</h3>
            <p className="text-sm text-gray-500 mt-1">Step-by-step GEO optimization guide</p>
          </Link>
        </div>
        <h2 className="text-xl font-semibold text-white">What is GEO?</h2>
        <p>
          GEO (Generative Engine Optimization) is a new discipline that focuses on
          optimizing websites for AI-powered search engines. Unlike traditional SEO
          which targets Google&apos;s keyword-based ranking, GEO targets AI models
          that generate answers by reading and synthesizing web content.
        </p>
        <p>
          Key GEO signals include:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li><code className="text-brand-400">llms.txt</code> — A markdown file that tells AI models what your site is about</li>
          <li><strong className="text-white">AI crawler access</strong> — Allowing GPTBot, ClaudeBot, etc. in robots.txt</li>
          <li><strong className="text-white">Structured data</strong> — JSON-LD schema that helps AI understand your content</li>
          <li><strong className="text-white">Semantic HTML</strong> — Clean, structured markup for AI comprehension</li>
          <li><strong className="text-white">Q&amp;A format</strong> — Content formatted as questions and answers</li>
        </ul>
      </div>
    </div>
  );
}
