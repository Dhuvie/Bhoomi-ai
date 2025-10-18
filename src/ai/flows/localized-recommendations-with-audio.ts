'use server';
/**
 * @fileOverview A flow to provide localized, actionable recommendations for optimizing crop yield, including audio readouts.
 *
 * - getLocalizedRecommendationsWithAudio - A function that handles the process of generating localized recommendations and audio readouts.
 * - LocalizedRecommendationsWithAudioInput - The input type for the getLocalizedRecommendationsWithAudio function.
 * - LocalizedRecommendationsWithAudioOutput - The return type for the getLocalizedRecommendationsWithAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

const LocalizedRecommendationsWithAudioInputSchema = z.object({
  cropType: z.string().describe('The type of crop.'),
  sowingDate: z.string().describe('The sowing date of the crop (YYYY-MM-DD).'),
  latitude: z.number().describe('The latitude of the field.'),
  longitude: z.number().describe('The longitude of the field.'),
  seasonalRainfall: z.number().describe('The seasonal rainfall amount.'),
  ndviDeclineRate: z.number().describe('The NDVI decline rate.'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Odia").'),
});
export type LocalizedRecommendationsWithAudioInput = z.infer<
  typeof LocalizedRecommendationsWithAudioInputSchema
>;

const LocalizedRecommendationsWithAudioOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('The list of recommendations in the specified language.'),
  audioUri: z.string().optional().describe('The data URI for the audio readout of the recommendations.'),
});
export type LocalizedRecommendationsWithAudioOutput = z.infer<
  typeof LocalizedRecommendationsWithAudioOutputSchema
>;

export async function getLocalizedRecommendationsWithAudio(
  input: LocalizedRecommendationsWithAudioInput
): Promise<LocalizedRecommendationsWithAudioOutput> {
  return localizedRecommendationsWithAudioFlow(input);
}

const recommendationPrompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: {
    schema: LocalizedRecommendationsWithAudioInputSchema,
  },
  output: {
    schema: z.object({
      recommendations: z.array(z.string()).describe('The list of recommendations.'),
    }),
  },
  prompt: `You are an expert agricultural advisor for farmers in India. You provide recommendations in the specified language based on the following information. Recommendations should be actionable and easy to understand for farmers.

Language: {{{language}}}
Crop Type: {{{cropType}}}
Sowing Date: {{{sowingDate}}}
Latitude: {{{latitude}}}
Longitude: {{{longitude}}}
Seasonal Rainfall: {{{seasonalRainfall}}}
NDVI Decline Rate: {{{ndviDeclineRate}}}

Based on the above information, provide a list of recommendations in {{{language}}} to optimize crop yield. Consider irrigation, fertilization, and pest control. Be specific and provide actionable advice.
`,
});

const localizedRecommendationsWithAudioFlow = ai.defineFlow(
  {
    name: 'localizedRecommendationsWithAudioFlow',
    inputSchema: LocalizedRecommendationsWithAudioInputSchema,
    outputSchema: LocalizedRecommendationsWithAudioOutputSchema,
  },
  async input => {
    const {output} = await recommendationPrompt(input);
    const recommendations = output?.recommendations || [];

    // Only generate audio for Odia
    if (input.language.toLowerCase() === 'odia' && recommendations.length > 0) {
      const odiaText = recommendations.join('. ');
      const audioResult = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'or-IN-SubhasiniNeural' },
            },
          },
        },
        prompt: odiaText,
      });

      if (audioResult.media) {
        const audioBuffer = Buffer.from(
          audioResult.media.url.substring(audioResult.media.url.indexOf(',') + 1),
          'base64'
        );
        const audioUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
        return { recommendations, audioUri };
      }
    }
    
    return { recommendations };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
