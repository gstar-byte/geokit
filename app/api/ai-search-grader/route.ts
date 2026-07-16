import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

type Provider = "openrouter" | "google";

interface ModelDef {
  id: string;
  name: string;
  marketShare: number;
  free: boolean;
  provider: Provider;
  googleModel?: string;
}

const OPENROUTER_MODELS: ModelDef[] = [
  { id: "openai/gpt-4o-mini", name: "ChatGPT (GPT-4o mini)", marketShare: 0.45, free: false, provider: "openrouter" },
  { id: "google/gemini-2.0-flash-001", name: "Google Gemini (2.0 Flash)", marketShare: 0.20, free: false, provider: "openrouter" },
  { id: "anthropic/claude-3.5-haiku", name: "Claude (3.5 Haiku)", marketShare: 0.15, free: false, provider: "openrouter" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Meta Llama 3.3 (70B)", marketShare: 0.10, free: true, provider: "openrouter" },
  { id: "mistralai/mistral-small-3.2-24b-instruct", name: "Mistral Small (3.2 24B)", marketShare: 0.05, free: true, provider: "openrouter" },
  { id: "deepseek/deepseek-chat", name: "DeepSeek V3", marketShare: 0.05, free: true, provider: "openrouter" },
];

const GOOGLE_MODELS: ModelDef[] = [
  { id: "gemini-2.0-flash", name: "Google Gemini (2.0 Flash)", marketShare: 0.20, free: true, provider: "google", googleModel: "gemini-2.0-flash" },
  { id: "gemini-2.0-flash-lite", name: "Google Gemini (2.0 Flash Lite)", marketShare: 0.10, free: true, provider: "google", googleModel: "gemini-2.0-flash-lite" },
  { id: "gemini-1.5-flash", name: "Google Gemini (1.5 Flash)", marketShare: 0.08, free: true, provider: "google", googleModel: "gemini-1.5-flash" },
];

const PROMPT_TEMPLATES = [
  "What are the best {niche}?",
  "Can you recommend some good {niche}?",
  "I'm looking for {niche}. What are the top options?",
  "List the most popular {niche} available today.",
  "Which {niche} would you recommend and why?",
];

function generatePrompts(niche: string): string[] {
  return PROMPT_TEMPLATES.map((t) => t.replace("{niche}", niche));
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectBrandMention(response: string, brand: string): boolean {
  const regex = new RegExp(`\\b${escapeRegex(brand.toLowerCase())}\\b`, "i");
  return regex.test(response);
}

function detectRanking(response: string, brand: string): number | null {
  const lines = response.split("\n");
  const brandRegex = new RegExp(`\\b${escapeRegex(brand.toLowerCase())}\\b`, "i");

  const listItems: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^(\d+[\.\)]\s|[-*•‣◦]\s|#{1,6}\s)/.test(trimmed)) {
      listItems.push(trimmed);
    }
  }

  if (listItems.length >= 2) {
    for (let i = 0; i < listItems.length; i++) {
      if (brandRegex.test(listItems[i])) {
        return i + 1;
      }
    }
  }

  const brandPos = response.toLowerCase().search(brandRegex);
  if (brandPos === -1) return null;

  const textBefore = response.substring(0, brandPos);
  const paragraphs = textBefore.split(/\n\s*\n/).length;
  return Math.min(20, paragraphs);
}

function calculateScore(visibility: number, averageRanking: number | null): number {
  if (visibility === 0) return 0;
  const visibilityScore = visibility;
  const rankingScore =
    averageRanking !== null ? Math.max(0, ((21 - averageRanking) / 20) * 100) : 0;
  return Math.round(visibilityScore * 0.6 + rankingScore * 0.4);
}

interface PromptResult {
  prompt: string;
  response: string;
  error: string | null;
}

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

export async function POST(req: NextRequest) {
  try {
    const { brand, niche, competitors, apiKey } = await req.json();

    if (!brand || typeof brand !== "string") {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }
    if (!niche || typeof niche !== "string") {
      return NextResponse.json({ error: "Niche or product description is required" }, { status: 400 });
    }

    const envKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const key = envKey || apiKey;
    if (!key) {
      return NextResponse.json(
        {
          error:
            "API key is required. Get a free Google AI Studio key at https://aistudio.google.com/apikey or an OpenRouter key at https://openrouter.ai/keys",
        },
        { status: 400 }
      );
    }

    const isGoogleKey = key.startsWith("AIza") || (!!process.env.GEMINI_API_KEY && !process.env.OPENROUTER_API_KEY);
    const provider: Provider = isGoogleKey ? "google" : "openrouter";
    const models = isGoogleKey ? GOOGLE_MODELS : OPENROUTER_MODELS;

    const competitorList: string[] = Array.isArray(competitors)
      ? competitors.filter((c: string) => c.trim())
      : typeof competitors === "string"
        ? competitors
            .split(",")
            .map((c: string) => c.trim())
            .filter(Boolean)
        : [];

    const prompts = generatePrompts(niche);

    const callModel = async (model: ModelDef, prompt: string): Promise<PromptResult> => {
      try {
        if (model.provider === "google") {
          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model.googleModel}:generateContent?key=${key}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 2000 },
              }),
              signal: AbortSignal.timeout(20000),
            }
          );

          if (!res.ok) {
            const errBody = await res.text();
            return { prompt, response: "", error: `Google API error: ${res.status} ${errBody.slice(0, 200)}` };
          }

          const data = await res.json();
          const response = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          return { prompt, response, error: null };
        } else {
          const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: model.id,
              messages: [{ role: "user", content: prompt }],
              max_tokens: 2000,
            }),
            signal: AbortSignal.timeout(20000),
          });

          if (!res.ok) {
            return { prompt, response: "", error: `OpenRouter API error: ${res.status}` };
          }

          const data = await res.json();
          const response = data.choices?.[0]?.message?.content || "";
          return { prompt, response, error: null };
        }
      } catch (err) {
        return {
          prompt,
          response: "",
          error: err instanceof Error ? err.message : "Request failed",
        };
      }
    };

    const modelPromises = models.map(async (model): Promise<ModelSummary> => {
      const promptPromises = prompts.map((prompt) => callModel(model, prompt));
      const promptResults = await Promise.all(promptPromises);

      let brandAppearances = 0;
      let brandRankings: number[] = [];
      let sampleResponse = "";

      for (const result of promptResults) {
        if (result.error) continue;
        if (!sampleResponse && result.response) sampleResponse = result.response;

        if (detectBrandMention(result.response, brand)) {
          brandAppearances++;
          const ranking = detectRanking(result.response, brand);
          if (ranking !== null) brandRankings.push(ranking);
        }
      }

      const brandVisibility = (brandAppearances / prompts.length) * 100;
      const brandAverageRanking =
        brandRankings.length > 0
          ? brandRankings.reduce((a, b) => a + b, 0) / brandRankings.length
          : null;
      const brandScore = calculateScore(brandVisibility, brandAverageRanking);

      const competitorData: CompetitorData[] = competitorList.map((comp) => {
        let compAppearances = 0;
        let compRankings: number[] = [];

        for (const result of promptResults) {
          if (result.error) continue;
          if (detectBrandMention(result.response, comp)) {
            compAppearances++;
            const ranking = detectRanking(result.response, comp);
            if (ranking !== null) compRankings.push(ranking);
          }
        }

        const compVisibility = (compAppearances / prompts.length) * 100;
        const compAverageRanking =
          compRankings.length > 0
            ? compRankings.reduce((a, b) => a + b, 0) / compRankings.length
            : null;
        const compScore = calculateScore(compVisibility, compAverageRanking);

        return {
          name: comp,
          visibility: Math.round(compVisibility),
          averageRanking:
            compAverageRanking !== null ? Math.round(compAverageRanking * 10) / 10 : null,
          score: compScore,
        };
      });

      const allErrored = promptResults.every((r) => r.error);
      const firstError = promptResults.find((r) => r.error)?.error;

      return {
        id: model.id,
        name: model.name,
        marketShare: model.marketShare,
        free: model.free,
        brandVisibility: Math.round(brandVisibility),
        brandAverageRanking:
          brandAverageRanking !== null ? Math.round(brandAverageRanking * 10) / 10 : null,
        brandAppearedIn: brandAppearances,
        brandTotalPrompts: prompts.length,
        brandScore,
        competitorData,
        error: allErrored ? (firstError ?? undefined) : undefined,
        sampleResponse: sampleResponse.slice(0, 500),
      };
    });

    const modelSummaries = await Promise.all(modelPromises);

    const validModels = modelSummaries.filter((m) => !m.error);
    const totalWeight = validModels.reduce((sum, m) => sum + m.marketShare, 0);
    const overallScore =
      totalWeight > 0
        ? Math.round(
            validModels.reduce((sum, m) => sum + m.brandScore * m.marketShare, 0) / totalWeight
          )
        : 0;

    const competitorOverallScores = competitorList.map((comp) => {
      const compValidModels = modelSummaries.filter((m) => !m.error);
      const compTotalWeight = compValidModels.reduce((sum, m) => sum + m.marketShare, 0);
      const compScore =
        compTotalWeight > 0
          ? Math.round(
              compValidModels.reduce((sum, m) => {
                const compData = m.competitorData.find((c) => c.name === comp);
                return sum + (compData?.score || 0) * m.marketShare;
              }, 0) / compTotalWeight
            )
          : 0;
      return { name: comp, score: compScore };
    });

    return NextResponse.json({
      brand,
      niche,
      prompts,
      modelSummaries,
      overallScore,
      competitorOverallScores,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
