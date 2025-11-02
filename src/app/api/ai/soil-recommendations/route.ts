import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateText, hasGeminiKey } from "@/lib/gemini";

const MODEL_VERSION = "bhoomi-soil-gemini-3.1-flash-lite";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { n, p, k, pH, moisture, locale = "en" } = body as {
      n: number; p: number; k: number; pH: number; moisture: number;
      locale?: "en" | "hi" | "or" | "te";
    };

    if ([n, p, k, pH, moisture].some((v) => typeof v !== "number" || Number.isNaN(v))) {
      return NextResponse.json({ error: "n, p, k, pH, moisture (numbers) are required" }, { status: 400 });
    }

    const prompt = `You are Bhoomi's soil advisor for Indian smallholder farms. Given the soil test results, recommend 3 crops suited to these conditions.

Soil test:
- Nitrogen (N): ${n} ppm
- Phosphorus (P, Olsen): ${p} ppm
- Potassium (K): ${k} ppm
- pH: ${pH}
- Moisture: ${moisture}%

Respond ONLY with valid JSON (no markdown):
{
  "recommendations": [
    {
      "crop": "lowercase english name",
      "suitability": "high" | "medium" | "low",
      "reason": { "en": "...", "hi": "...", "or": "...", "te": "..." },
      "expectedYieldQt": number
    }
  ]
}

Rules:
- 3 crops, ranked best-fit first.
- suitability "high" only when pH and NPK clearly favor that crop.
- reason: one concrete sentence mentioning specific nutrient or pH value.
- All four language strings present. Primary: ${locale}.
- expectedYieldQt: realistic quintal/acre for this soil.

JSON only:`;

    let raw: string;
    const systemPrompt = "You are a precise soil scientist. You output only valid JSON.";

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

    if (!parsed || !Array.isArray(parsed.recommendations)) {
      return NextResponse.json({ error: "Could not parse recommendations", inferenceMs, modelVersion: MODEL_VERSION }, { status: 502 });
    }

    const recommendations = parsed.recommendations.slice(0, 4).map((r: any, i: number) => ({
      crop: String(r.crop ?? `crop-${i + 1}`),
      suitability: (["high", "medium", "low"].includes(r.suitability) ? r.suitability : "medium") as "high" | "medium" | "low",
      reason: {
        en: String(r.reason?.en ?? ""),
        hi: String(r.reason?.hi ?? r.reason?.en ?? ""),
        or: String(r.reason?.or ?? r.reason?.en ?? ""),
        te: String(r.reason?.te ?? r.reason?.en ?? ""),
      },
      expectedYieldQt: Math.max(0, Number(r.expectedYieldQt) || 0),
    }));

    return NextResponse.json({ recommendations, modelVersion: MODEL_VERSION, inferenceMs });
  } catch (error: any) {
    const inferenceMs = Date.now() - startTime;
    console.error("[/api/ai/soil-recommendations] error:", error?.message ?? error);
    return NextResponse.json({ error: error?.message ?? "Recommendations failed", inferenceMs, modelVersion: MODEL_VERSION }, { status: 500 });
  }
}
