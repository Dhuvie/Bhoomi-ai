import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateText, hasGeminiKey } from "@/lib/gemini";

/**
 * POST /api/ai/yield-forecast
 * Uses Gemini 3.1 Flash Lite.
 */

const MODEL_VERSION = "bhoomi-yield-gemini-3.1-flash-lite";

const cropTypicalYields: Record<string, { low: number; high: number }> = {
  rice: { low: 15, high: 28 }, cotton: { low: 6, high: 12 }, groundnut: { low: 7, high: 12 },
  maize: { low: 18, high: 35 }, pulses: { low: 4, high: 9 }, sugarcane: { low: 280, high: 400 },
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { fieldId, crop, areaAcres, daysSincePlanting, growthStage, healthScore, ndvi, moisture, locale = "en" } = body as {
      fieldId: string; crop: string; areaAcres: number; daysSincePlanting: number;
      growthStage: string; healthScore: number; ndvi: number; moisture: number;
      locale?: "en" | "hi" | "or" | "te";
    };

    if (!fieldId || !crop) {
      return NextResponse.json({ error: "fieldId and crop are required" }, { status: 400 });
    }

    const typical = cropTypicalYields[crop] ?? { low: 10, high: 20 };

    const prompt = `You are Bhoomi's yield forecast model for Indian smallholder farms. Forecast the harvest yield in quintal per acre.

Field data:
- Crop: ${crop}
- Area: ${areaAcres} acres
- Days since planting: ${daysSincePlanting}
- Growth stage: ${growthStage}
- Field health score (0-100): ${healthScore}
- NDVI: ${ndvi}
- Soil moisture: ${moisture}%

Typical ${crop} yield in this region: ${typical.low}-${typical.high} qt/acre.

Respond ONLY with valid JSON (no markdown):
{
  "expectedQt": number,
  "lowQt": number,
  "highQt": number,
  "confidence": 0.0-1.0,
  "factors": [
    { "label": "factor name in ${locale}", "impact": "positive" | "negative" | "neutral", "weight": 0.0-1.0 }
  ]
}

Rules:
- Never return a single number — always a range (lowQt/highQt is the 80% uncertainty band).
- Wider range when confidence is lower.
- 4-5 factors with weights summing roughly to 1.0. Labels in ${locale}.
- Be calibrated: healthScore 78 + NDVI 0.62 should pull expectedQt toward upper half, not above it.

JSON only:`;

    let raw: string;
    const systemPrompt = "You are a precise agricultural yield forecaster. You output only valid JSON.";

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

    if (!parsed) {
      return NextResponse.json({ error: "Could not parse forecast", inferenceMs, modelVersion: MODEL_VERSION }, { status: 502 });
    }

    const expectedQt = Math.max(0, Number(parsed.expectedQt) || (typical.low + typical.high) / 2);
    const lowQt = Math.max(0, Number(parsed.lowQt) || expectedQt * 0.85);
    const highQt = Math.max(expectedQt, Number(parsed.highQt) || expectedQt * 1.15);
    const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0.6));

    return NextResponse.json({
      fieldId, expectedQt, lowQt, highQt, confidence,
      factors: Array.isArray(parsed.factors)
        ? parsed.factors.slice(0, 6).map((f: any, i: number) => ({
            label: String(f.label ?? `Factor ${i + 1}`),
            impact: (["positive", "negative", "neutral"].includes(f.impact) ? f.impact : "neutral") as "positive" | "negative" | "neutral",
            weight: Math.max(0, Math.min(1, Number(f.weight) || 0.2)),
          }))
        : [],
      modelVersion: MODEL_VERSION,
      generatedAt: new Date().toISOString(),
      inferenceMs,
    });
  } catch (error: any) {
    const inferenceMs = Date.now() - startTime;
    console.error("[/api/ai/yield-forecast] error:", error?.message ?? error);
    return NextResponse.json({ error: error?.message ?? "Forecast failed", inferenceMs, modelVersion: MODEL_VERSION }, { status: 500 });
  }
}
