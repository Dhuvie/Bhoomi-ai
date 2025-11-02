import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateText, hasGeminiKey } from "@/lib/gemini";

const MODEL_VERSION = "bhoomi-voice-gemini-3.1-flash-lite";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { query, locale = "en", farmContext } = body as {
      query?: string;
      locale?: "en" | "hi" | "or" | "te";
      farmContext?: any;
    };

    if (!query || !query.trim()) {
      return NextResponse.json({ error: "query is required" }, { status: 400 });
    }

    const ctxStr = farmContext
      ? `Farm context (use this to ground your answer):\n${JSON.stringify(farmContext, null, 2)}\n`
      : "";

    const prompt = `You are Bhoomi, a voice assistant for Indian farmers. A farmer asked you a question. Answer in a warm, practical, spoken-friendly way — short enough to speak in under 15 seconds.

${ctxStr}

Farmer's question: "${query}"

Respond ONLY with valid JSON (no markdown):
{
  "text": { "en": "...", "hi": "...", "or": "...", "te": "..." }
}

Rules:
- Primary language: ${locale}. Make that one the most natural and complete.
- Under 40 words per language. Speakable, no jargon, no bullet points.
- If about weather, refer to actual forecast (specific mm, specific dates).
- If about a field, refer by name with concrete numbers.
- If insufficient context, give best general advice and say so plainly.
- Never invent pesticide brand names; use generic active ingredients.

JSON only:`;

    let raw: string;
    const systemPrompt = "You are a helpful, concise voice assistant for Indian farmers. You output only valid JSON.";

    if (!hasGeminiKey()) {
      return NextResponse.json({ error: "Gemini API key is required" }, { status: 500 });
    }
    raw = await geminiGenerateText(prompt, systemPrompt);

    let parsed: any = null;
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) { try { parsed = JSON.parse(match[0]); } catch {} }
    }

    const inferenceMs = Date.now() - startTime;

    if (!parsed?.text) {
      return NextResponse.json({ error: "Could not parse voice response", inferenceMs, modelVersion: MODEL_VERSION }, { status: 502 });
    }

    return NextResponse.json({
      text: {
        en: String(parsed.text.en ?? ""),
        hi: String(parsed.text.hi ?? parsed.text.en ?? ""),
        or: String(parsed.text.or ?? parsed.text.en ?? ""),
        te: String(parsed.text.te ?? parsed.text.en ?? ""),
      },
      modelVersion: MODEL_VERSION,
      inferenceMs,
    });
  } catch (error: any) {
    const inferenceMs = Date.now() - startTime;
    console.error("[/api/ai/voice-query] error:", error?.message ?? error);
    return NextResponse.json({ error: error?.message ?? "Voice query failed", inferenceMs, modelVersion: MODEL_VERSION }, { status: 500 });
  }
}
