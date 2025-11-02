/**
 * Gemini AI client helper.
 *
 * Uses Google's Generative AI (Gemini) as the primary backend.
 *
 * To use Gemini: add GEMINI_API_KEY=your_key_here to .env.local
 * Get a key at: https://aistudio.google.com/app/apikey
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

declare const process: { env: Record<string, string | undefined> };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const MODEL_NAME = "gemini-3.1-flash-lite";

let genAIClient: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAIClient;
}

export function hasGeminiKey(): boolean {
  return !!GEMINI_API_KEY;
}

/**
 * Generate text with Gemini. Returns the text response.
 */
export async function geminiGenerateText(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const client = getGeminiClient();
  if (!client) throw new Error("Gemini client not initialized");

  const model = client.getGenerativeModel({
    model: MODEL_NAME,
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Generate text with Gemini from an image + text prompt (vision).
 * base64Data should be the raw base64 string (not a data URL).
 */
export async function geminiGenerateVision(
  prompt: string,
  base64Data: string,
  mimeType: string = "image/jpeg"
): Promise<string> {
  const client = getGeminiClient();
  if (!client) throw new Error("Gemini client not initialized");

  const model = client.getGenerativeModel({ model: MODEL_NAME });

  const result = await model.generateContent([
    { text: prompt },
    {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    },
  ]);

  return result.response.text();
}

/**
 * Extract raw base64 data and mime type from a data URL.
 * "data:image/jpeg;base64,...." → { data: "....", mimeType: "image/jpeg" }
 */
export function parseDataUrl(dataUrl: string): { data: string; mimeType: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  // If it's already raw base64, assume jpeg
  return { mimeType: "image/jpeg", data: dataUrl };
}
