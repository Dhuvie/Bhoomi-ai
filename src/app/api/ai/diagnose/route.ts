import { NextRequest, NextResponse } from "next/server";
import { geminiGenerateVision, parseDataUrl, hasGeminiKey } from "@/lib/gemini";

/**
 * POST /api/ai/diagnose
 * Real pest & disease diagnosis.
 * Uses Gemini 3.1 Flash Lite (vision).
 */

const MODEL_VERSION = "bhoomi-vision-gemini-3.1-flash-lite";

const localeNames: Record<string, string> = {
  en: "English", hi: "Hindi (Devanagari)", or: "Odia", te: "Telugu",
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { imageBase64, cropHint, locale = "en" } = body as {
      imageBase64?: string; cropHint?: string; locale?: "en" | "hi" | "or" | "te";
    };

    if (!imageBase64) {
      return NextResponse.json({ error: "imageBase64 is required" }, { status: 400 });
    }

    const prompt = `You are Bhoomi, an agricultural pest & disease diagnosis assistant for Indian farmers.
Analyze this leaf image and diagnose any pest, disease, or deficiency visible.

Respond ONLY with valid JSON (no markdown, no prose outside JSON) in this exact shape:
{
  "diseaseEn": "short English name",
  "diseaseLocal": { "en": "...", "hi": "...", "or": "...", "te": "..." },
  "confidence": 0.0-1.0,
  "severity": "low" | "medium" | "high",
  "treatments": [
    { "id": "t1", "text": { "en": "...", "hi": "...", "or": "...", "te": "..." } }
  ]
}

Rules:
- If the image is not a leaf or no disease is visible, return { "diseaseEn": null } and an empty treatments array.
- confidence is your honest confidence in the diagnosis (0.0-1.0). Do not inflate.
- Provide 3-4 practical treatments an Indian smallholder can actually do (specific products, doses in g/L or ml/L, timing).
- All four language strings must be present and meaningful. Primary language: ${localeNames[locale] || "English"}.
- Treatment text should be concrete and actionable, never generic.
${cropHint ? `- The farmer thinks this crop is: ${cropHint}. Use as a hint but verify from the image.` : ""}
- Common rice diseases: blast, brown spot, bacterial blight, sheath blight, tungro.
- Common cotton diseases: pink bollworm, leaf curl, aphids, jassids, thrips.
- Common groundnut diseases: tikka leaf spot, rust, early leaf spot.

JSON only:`;

    let raw: string;

    if (!hasGeminiKey()) {
      return NextResponse.json({ error: "Gemini API key is required" }, { status: 500 });
    }

    const { data, mimeType } = parseDataUrl(imageBase64);
    raw = await geminiGenerateVision(prompt, data, mimeType);

    // Parse JSON — be defensive about markdown fences
    let parsed: any = null;
    try {
      const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) { try { parsed = JSON.parse(match[0]); } catch {} }
    }

    const inferenceMs = Date.now() - startTime;

    if (!parsed || !parsed.diseaseEn) {
      return NextResponse.json({ result: null, inferenceMs, modelVersion: MODEL_VERSION });
    }

    const confidence = Math.max(0, Math.min(1, Number(parsed.confidence) || 0));
    const confidenceLabel = confidence >= 0.9 ? "veryHigh" : confidence >= 0.75 ? "high" : confidence >= 0.55 ? "med" : "low";

    const result = {
      id: `diag-${Date.now()}`,
      diseaseEn: String(parsed.diseaseEn),
      diseaseLocal: {
        en: String(parsed.diseaseLocal?.en ?? parsed.diseaseEn),
        hi: String(parsed.diseaseLocal?.hi ?? parsed.diseaseEn),
        or: String(parsed.diseaseLocal?.or ?? parsed.diseaseEn),
        te: String(parsed.diseaseLocal?.te ?? parsed.diseaseEn),
      },
      confidence,
      severity: (["low", "medium", "high"].includes(parsed.severity) ? parsed.severity : "medium") as "low" | "medium" | "high",
      confidenceLabel: confidenceLabel as "low" | "med" | "high" | "veryHigh",
      treatments: Array.isArray(parsed.treatments)
        ? parsed.treatments.slice(0, 5).map((t: any, i: number) => ({
            id: t.id ?? `t${i + 1}`,
            text: {
              en: String(t.text?.en ?? ""),
              hi: String(t.text?.hi ?? t.text?.en ?? ""),
              or: String(t.text?.or ?? t.text?.en ?? ""),
              te: String(t.text?.te ?? t.text?.en ?? ""),
            },
            done: false,
          })).filter((t: any) => t.text.en)
        : [],
    };

    return NextResponse.json({ result, inferenceMs, modelVersion: MODEL_VERSION });
  } catch (error: any) {
    const inferenceMs = Date.now() - startTime;
    console.error("[/api/ai/diagnose] error:", error?.message ?? error);
    return NextResponse.json(
      { error: error?.message ?? "Diagnosis failed", inferenceMs, modelVersion: MODEL_VERSION },
      { status: 500 }
    );
  }
}
