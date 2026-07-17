import { useState, useEffect } from "react";

export type Language = "en" | "zh";

// Global language state listeners
const listeners = new Set<(lang: Language) => void>();

let currentLang: Language = "en";

// Initialize on client
if (typeof window !== "undefined") {
  currentLang = (localStorage.getItem("geokit-lang") as Language) || "en";
}

export function setGlobalLanguage(lang: Language) {
  currentLang = lang;
  if (typeof window !== "undefined") {
    localStorage.setItem("geokit-lang", lang);
    // Dispatch custom event to notify other tabs/components
    window.dispatchEvent(new CustomEvent("geokit-lang-change", { detail: lang }));
  }
  listeners.forEach((l) => l(lang));
}

export function useLanguage() {
  const [lang, setLang] = useState<Language>(currentLang);

  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const customEvent = e as CustomEvent<Language>;
      setLang(customEvent.detail);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("geokit-lang-change", handleLangChange);
    }

    const listener = (newLang: Language) => {
      setLang(newLang);
    };
    listeners.add(listener);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("geokit-lang-change", handleLangChange);
      }
      listeners.delete(listener);
    };
  }, []);

  return {
    lang,
    setLang: setGlobalLanguage,
    t: (key: string, englishText: string): string => {
      if (lang === "en") return englishText;
      return TRANSLATIONS[lang]?.[key] || englishText;
    },
  };
}

const TRANSLATIONS: Record<string, Record<string, string>> = {
  zh: {
    // Navbar
    "Tools": "工具集",
    "Badge": "徽章",
    "About": "关于",
    "How to deploy:": "如何部署：",
    "Download": "下载",
    "Copy": "复制",
    "Preview": "预览",

    // Homepage
    "Free GEO toolkit to optimize your site for AI search: llms.txt generator, schema markup, robots.txt, readiness checker & more. No signup.":
      "免费的生成引擎优化 (GEO) 工具集，帮助优化您的网站以在 ChatGPT、Perplexity 和 Google AI Overviews 中获得更高引用率，无需注册。",
    "Thirteen free tools to make your website visible to AI search engines.":
      "13 个免费工具，让您的网站对 AI 搜索引擎清晰可见。",
    "All Tools": "全部工具",
    "Frequently Asked Questions": "常见问题",
    "What is GEO (Generative Engine Optimization)?": "什么是 GEO（生成引擎优化）？",
    "GEO is the practice of optimizing your website so that AI search engines like ChatGPT, Perplexity, and Google AI Overviews can understand, cite, and recommend your content. It includes technical signals like llms.txt, AI crawler access, and structured data.":
      "GEO 是指对网站进行优化的实践，以便 ChatGPT、Perplexity 和 Google AI Overviews 等 AI 搜索引擎能够理解、引用和推荐您的内容。它包括 llms.txt、AI 爬虫访问控制和结构化数据等技术信号。",
    "What is llms.txt?": "什么是 llms.txt？",
    "llms.txt is a markdown file placed at the root of your website (e.g., example.com/llms.txt) that provides LLM-friendly content. It tells AI models what your site is about and which pages are most important, similar to how robots.txt guides search engine crawlers.":
      "llms.txt 是放置在网站根目录下（例如 example.com/llms.txt）的 Markdown 文件，用于提供对 LLM 友好的内容。它告诉 AI 模型您的网站主题以及哪些页面最重要，类似于 robots.txt 引导传统搜索引擎爬虫的方式。",
    "Do I need to sign up or pay?": "我需要注册或付费吗？",
    "No. All GEOKit tools are 100% free with no signup required. Just open a tool and start using it. Everything runs in your browser.":
      "不需要。所有 GEOKit 工具完全免费，无需注册。只需打开即可开始使用，所有操作均在您的浏览器中完成。",
    "Are these tools safe to use?": "这些工具安全吗？",
    "Yes. All processing happens client-side in your browser. Your inputs and outputs are never sent to any server. You can verify this by checking your browser's network tab.":
      "安全。所有计算都在您的浏览器本地（客户端）运行。您的输入和输出绝不会发送到任何服务器，您可以通过浏览器的开发者工具网络面板进行验证。",

    // Tool Cards
    "llms.txt Generator": "llms.txt 生成器",
    "Create an llms.txt file that tells AI models what your site is about and which pages matter most.":
      "创建 llms.txt 文件，告诉 AI 模型您的网站主题以及哪些网页最重要。",
    "AI Robots.txt Generator": "AI Robots.txt 生成器",
    "Control which AI crawlers (GPTBot, ClaudeBot, PerplexityBot) can access your site with a production-ready robots.txt.":
      "通过生产级 robots.txt，控制哪些 AI 爬虫（如 GPTBot, ClaudeBot, PerplexityBot）能访问您的网站。",
    "Schema for AI Generator": "AI 结构化数据生成器",
    "Generate AI-friendly JSON-LD structured data that helps ChatGPT, Perplexity, and Google AI Overviews understand your content.":
      "生成对 AI 友好的 JSON-LD 结构化数据，帮助 ChatGPT、Perplexity 和 Google AI Overviews 理解您的内容。",
    "AI Readiness Checker": "AI 就绪度检测器",
    "Enter your URL and get an instant 0–100 score showing how well AI search engines can read and cite your site.":
      "输入网址，获取 0-100 的即时就绪评分，检测 AI 搜索引擎抓取和引用您网站的难易程度。",
    "llms.txt Validator": "llms.txt 验证器",
    "Paste your llms.txt content to check if it follows the spec — H1 title, valid markdown, link format, and more.":
      "粘贴并验证您的 llms.txt 内容是否符合规范——包括 H1 标题、有效 markdown 语法和链接格式检查。",
    "GEO Checklist": "GEO 优化清单",
    "A step-by-step checklist to optimize your site for AI search engines. Track your progress across all GEO tasks.":
      "优化 AI 搜索可见性的逐步指南清单，帮助跟踪每项 GEO 任务的进度。",
    "AI Sitemap Generator": "AI 网站地图生成器",
    "Generate an XML sitemap optimized for AI crawlers with priority hints and update frequencies.":
      "生成优化过的 XML 网站地图，包含针对 AI 爬虫的优先级提示和更新频率。",
    "Meta Tag Generator": "元标签生成器",
    "Generate search and AI-friendly meta tags including title, description, Open Graph, and Twitter Cards.":
      "生成适合 AI 和搜索的元标签，包括标题、描述、Open Graph 和 Twitter Card 标签。",
    "Q&A Content Formatter": "Q&A 内容格式化工具",
    "Convert your content into question-and-answer formats that are 3.2x more likely to be cited by AI search engines.":
      "将您的文章格式化为 Q&A 问答结构，这能使内容被 AI 引用率提高 3.2 倍。",
    "AI Crawler Tester": "AI 爬虫测试器",
    "Simulate how AI crawlers see your page. Check what content GPTBot, ClaudeBot, and others can extract.":
      "模拟 AI 爬虫（如 GPTBot, ClaudeBot 等）的抓取视角，检查它们能提取出哪些核心内容。",
    "AI Search Grader": "AI 搜索评分器",
    "See how visible your brand is in AI search. We query 6 AI models with niche-relevant prompts and measure your brand's visibility and ranking.":
      "评估您的品牌在 AI 搜索中的曝光度。使用特定提示词模拟查询 6 个主流 AI 模型，并测量品牌的可见性与排名。",
    "GEO Score": "GEO 内容评分器",
    "Paste your content and get an instant 0–100 score measuring how likely AI search engines are to cite it.":
      "粘贴您的文章，即时测算 0-100 的 GEO 引用分，评估被 AI 搜索引擎采纳的概率。",
    "Schema Validator & Preview": "Schema 验证与预览工具",
    "Validate your JSON-LD structured data and preview how it appears in Google Rich Results.":
      "验证 JSON-LD 结构化数据是否正确，并实时模拟它在 Google 富媒体搜索结果中的展示效果。",
    "Sitemap Validator & Checker": "Sitemap 验证与死链检测工具",
    "Enter your sitemap URL to check XML syntax compliance, sitemaps.org format, file weight, and run instant HTTP status checks for page URLs to find broken links.":
      "输入您的网站地图 URL，检查 XML 语法合规性、sitemaps.org 格式声明、文件体积，并对页面 URL 运行即时 HTTP 状态检测以查找死链。",

    // Common Tool Buttons
    "Check Now": "开始检测",
    "Generate →": "一键生成 →",
    "Validate": "开始验证",
    "Clear": "清空",
    "Copy to Clipboard": "复制到剪贴板",
  },
};
