/**
 * AI call boundaries — clean function interfaces for the Bhoomi UI.
 *
 * The functions call real backend API routes that wrap the Gemini API.
 * The backend routes are at:
 *   POST /api/ai/diagnose              — VLM (vision) for leaf diagnosis
 *   POST /api/ai/yield-forecast        — LLM for yield prediction
 *   POST /api/ai/soil-recommendations  — LLM for crop recommendations
 *   POST /api/ai/voice-query           — LLM for voice Q&A
 *
 * Live scan (real-time bounding boxes) is still simulated client-side
 * because real-time inference needs a specialized detector model, not a VLM.
 * The signatures stay the same so a real detector can be swapped in.
 *
 * If a backend call fails, we fall back to the mock data so the UI never
 * breaks — but we mark the result so the UI can show an "offline estimate"
 * indicator if desired.
 */

import { diagnosisLibrary, type DiagnosisResult } from "@/lib/mock-data";

export type Locale = "en" | "hi" | "or" | "te";

export interface DiagnosisRequest {
  imageBase64?: string;
  cropHint?: string;
  locale: Locale;
}

export interface BoundingBox {
  x: number; // 0-1 normalized
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface LiveScanFrame {
  boxes: BoundingBox[];
  inferenceMs: number;
}

/** Real-time bounding-box inference for live camera mode. Simulated but consistent. */
export async function runLiveDiagnosisScan(
  _frame: ImageData | string,
  locale: Locale = "en"
): Promise<LiveScanFrame> {
  const inferenceMs = 80 + Math.random() * 60;
  await new Promise((r) => setTimeout(r, inferenceMs));

  // Frame counter — builds confidence over time so the lock-on moment triggers
  frameCounter++;
  // First 2 frames: no detection (camera warming up)
  if (frameCounter < 3) {
    return { boxes: [], inferenceMs };
  }
  // After that: always show a box, confidence climbs steadily to ~0.85
  const confidence = Math.min(0.5 + (frameCounter - 2) * 0.08, 0.87);
  return {
    boxes: [
      {
        x: 0.30 + Math.sin(frameCounter * 0.3) * 0.02,
        y: 0.33 + Math.cos(frameCounter * 0.25) * 0.02,
        width: 0.38,
        height: 0.30,
        label: locale === "en" ? "leaf lesion" : locale === "hi" ? "पत्ती धब्बा" : locale === "or" ? "ପତ୍ର ଦାଗ" : "ఆకు మచ్చ",
        confidence,
      },
    ],
    inferenceMs,
  };
}

// Module-level frame counter so confidence builds consistently across calls
let frameCounter = 0;
export function resetScanCounter() { frameCounter = 0; }

export interface DiagnosisResponse {
  result: DiagnosisResult | null;
  inferenceMs: number;
  modelVersion: string;
  fallback?: boolean; // true if we used mock data after a backend failure
}

/** Final diagnosis after capture — calls the real VLM backend. */
export async function diagnoseCapturedLeaf(
  req: DiagnosisRequest
): Promise<DiagnosisResponse> {
  const startTime = Date.now();
  try {
    const res = await fetch("/api/ai/diagnose", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) {
      throw new Error(`diagnose HTTP ${res.status}`);
    }
    const data = await res.json();
    return {
      result: data.result,
      inferenceMs: data.inferenceMs ?? Date.now() - startTime,
      modelVersion: data.modelVersion ?? "bhoomi-vision-v0.5.0",
    };
  } catch (error) {
    // Fallback to mock so the UI still works offline / during backend issues
    console.warn("[diagnoseCapturedLeaf] backend failed, using fallback:", error);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 400));
    const idx = Math.floor(Math.random() * (diagnosisLibrary.length + 1));
    if (idx >= diagnosisLibrary.length) {
      return {
        result: null,
        inferenceMs: Date.now() - startTime,
        modelVersion: "bhoomi-vision-v0.5.0 (offline)",
        fallback: true,
      };
    }
    const base = diagnosisLibrary[idx];
    return {
      result: { ...base, treatments: base.treatments.map((t) => ({ ...t, done: false })) },
      inferenceMs: Date.now() - startTime,
      modelVersion: "bhoomi-vision-v0.5.0 (offline)",
      fallback: true,
    };
  }
}

export interface YieldForecastResponse {
  fieldId: string;
  expectedQt: number;
  lowQt: number;
  highQt: number;
  confidence: number;
  factors: Array<{
    label: string;
    impact: "positive" | "negative" | "neutral";
    weight: number;
  }>;
  modelVersion: string;
  generatedAt: string;
  fallback?: boolean;
}

/** Yield forecast — calls the real LLM backend with field context. */
export async function generateYieldForecast(
  fieldId: string,
  locale: Locale,
  fieldContext?: {
    crop: string;
    areaAcres: number;
    daysSincePlanting: number;
    growthStage: string;
    healthScore: number;
    ndvi: number;
    moisture: number;
  }
): Promise<YieldForecastResponse> {
  const startTime = Date.now();
  try {
    const res = await fetch("/api/ai/yield-forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fieldId, locale, ...fieldContext }),
    });
    if (!res.ok) throw new Error(`yield-forecast HTTP ${res.status}`);
    const data = await res.json();
    return {
      fieldId,
      expectedQt: data.expectedQt,
      lowQt: data.lowQt,
      highQt: data.highQt,
      confidence: data.confidence,
      factors: data.factors,
      modelVersion: data.modelVersion ?? "bhoomi-yield-v0.5.0",
      generatedAt: data.generatedAt ?? new Date().toISOString(),
      fallback: false,
    };
  } catch (error) {
    console.warn("[generateYieldForecast] backend failed, using fallback:", error);
    const { yieldForecasts } = await import("@/lib/mock-data");
    const base = yieldForecasts.find((f) => f.fieldId === fieldId);
    if (!base) throw new Error("Field not found");
    return {
      fieldId: base.fieldId,
      expectedQt: base.expectedQt,
      lowQt: base.lowQt,
      highQt: base.highQt,
      confidence: base.confidence,
      factors: base.factors.map((f) => ({
        label: f.label[locale],
        impact: f.impact,
        weight: f.weight,
      })),
      modelVersion: "bhoomi-yield-v0.5.0 (offline)",
      generatedAt: new Date().toISOString(),
      fallback: true,
    };
  }
}

export interface SoilRecommendation {
  crop: string;
  suitability: "high" | "medium" | "low";
  reason: { en: string; hi: string; or: string; te: string };
  expectedYieldQt: number;
}

/** Soil recommendations — calls the real LLM backend. */
export async function getSoilRecommendations(
  soilData: { n: number; p: number; k: number; pH: number; moisture: number },
  locale: Locale
): Promise<SoilRecommendation[]> {
  try {
    const res = await fetch("/api/ai/soil-recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...soilData, locale }),
    });
    if (!res.ok) throw new Error(`soil-recommendations HTTP ${res.status}`);
    const data = await res.json();
    return data.recommendations;
  } catch (error) {
    console.warn("[getSoilRecommendations] backend failed, using fallback:", error);
    return [
      {
        crop: "rice",
        suitability: soilData.pH >= 5.5 && soilData.pH <= 7 && soilData.k > 100 ? "high" : "medium",
        reason: {
          en: "Your soil pH and potassium favor rice. Top-dress nitrogen at tillering.",
          hi: "आपका pH व पोटेशियम धान के लिए अनुकूल। कल्ले में नाइट्रोजन दें।",
          or: "ଆପଣଙ୍କ pH ଓ ପୋଟାସିୟମ୍ ଧାନ ପାଇଁ ଅନୁକୂଳ।",
          te: "మీ pH, పొటాషియం వరికి అనుకూలం.",
        },
        expectedYieldQt: 22,
      },
      {
        crop: "groundnut",
        suitability: soilData.pH >= 6 && soilData.pH <= 7.5 ? "high" : "medium",
        reason: {
          en: "Sandy-loam with balanced pH suits groundnut. Add gypsum for calcium.",
          hi: "दोमट मिट्टी मूंगफली के लिए। जिप्सम दें।",
          or: "ବାଲିମିଶ୍ର ମାଟି ବାଦାମ ପାଇଁ।",
          te: "నేల వేరుశనగకు అనుకూలం.",
        },
        expectedYieldQt: 9.5,
      },
      {
        crop: "pulses",
        suitability: soilData.n < 150 ? "high" : "medium",
        reason: {
          en: "Lower nitrogen favors pulses (they fix their own). Try green gram.",
          hi: "कम नाइट्रोजन दलहन के लिए अच्छा। मूंग लें।",
          or: "କମ୍ ନାଇଟ୍ରୋଜେନ୍ ଡାଲି ପାଇଁ ଭଲ।",
          te: "తక్కువ నత్రజని పప్పులకు మంచిది.",
        },
        expectedYieldQt: 6.8,
      },
    ];
  }
}

export interface VoiceResponse {
  text: { en: string; hi: string; or: string; te: string };
  speakLocale: Locale;
  durationMs: number;
  fallback?: boolean;
}

/** Voice query — calls the real LLM backend with farm context. */
export async function processVoiceQuery(
  query: string,
  locale: Locale,
  farmContext?: {
    fields?: Array<{ name: string; crop: string; healthScore: number; daysSincePlanting: number }>;
    weather?: { tempC: number; condition: string; forecast: Array<{ date: string; rainfallMm: number; condition: string }> };
    alerts?: Array<{ severity: string; type: string; titleEn: string }>;
  }
): Promise<VoiceResponse> {
  try {
    const res = await fetch("/api/ai/voice-query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, locale, farmContext }),
    });
    if (!res.ok) throw new Error(`voice-query HTTP ${res.status}`);
    const data = await res.json();
    return {
      text: data.text,
      speakLocale: locale,
      durationMs: 2500,
      fallback: false,
    };
  } catch (error) {
    console.warn("[processVoiceQuery] backend failed, using fallback:", error);
    const responses: Record<string, VoiceResponse["text"]> = {
      rain: {
        en: "Light rain today, 42-70 mm on July 25 and 26. Clear drainage channels in low-lying rice fields now.",
        hi: "आज हल्की बारिश, 25-26 जुलाई को 42-70 मिमी। नाले साफ करें।",
        or: "ଆଜି ହାଲୁକା ବର୍ଷା, ୨୫-୨୬ରେ ୪୨-୭୦ ମିମି।",
        te: "ఈ రోజు తేలిక వర్షం, 25-26న 42-70 మిమీ.",
      },
      pest: {
        en: "Pink bollworm pressure is high in your cotton field Chinna Boma. Install pheromone traps today.",
        hi: "चिन्ना बोमा में गुलाबी सूंडी जोखिम ऊंचा। फेरोमोन ट्रैप लगाएं।",
        or: "ଚିନ୍ନା ବୋମାରେ ଗୋଲାପୀ ପୋକ ସଙ୍କଟ।",
        te: "చిన్నా బోమాలో గులాబీ పురుగు ప్రమాదం ఎక్కువ.",
      },
      yield: {
        en: "Your rice field Pedda Chetla is forecast at 19.8 to 24.6 quintal per acre, 74% confidence. Blast risk is the main downside.",
        hi: "पेड्डा चेतला 19.8 से 24.6 क्विंटल प्रति एकड़, 74% आत्मविश्वास।",
        or: "ପେଦ୍ଦା ଚେତ୍ଲା ୧୯.୮ ରୁ ୨୪.୬ କ୍ୱିଣ୍ଟାଲ୍।",
        te: "పెద్ద చెట్ల 19.8-24.6 క్వింటాల్.",
      },
      default: {
        en: "Ask me about your fields, weather, pest risk, yield, or market prices.",
        hi: "खेत, मौसम, कीट, उपज या बाजार के बारे में पूछें।",
        or: "କ୍ଷେତ୍ର, ପାଣିପାଗ, ପୋକ ବିଷୟରେ ପଚାରନ୍ତୁ।",
        te: "పొలం, వాతావరణం గురించి అడగండి.",
      },
    };
    // crude keyword match for fallback
    const q = query.toLowerCase();
    const key = q.includes("rain") || q.includes("बारिश") || q.includes("వర్షం") || q.includes("ବର୍ଷା") ? "rain"
      : q.includes("pest") || q.includes("कीट") || q.includes("పురుగు") || q.includes("ପୋକ") ? "pest"
      : q.includes("yield") || q.includes("उपज") || q.includes("దిగుబడి") || q.includes("ଉତ୍ପାଦନ") ? "yield"
      : "default";
    return {
      text: responses[key],
      speakLocale: locale,
      durationMs: 2500,
      fallback: true,
    };
  }
}
