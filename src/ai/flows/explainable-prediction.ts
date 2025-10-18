// src/ai/flows/explainable-prediction.ts
'use server';

/**
 * @fileOverview A flow to explain the key factors influencing the crop yield prediction.
 *
 * - explainablePrediction - A function that handles the explanation of crop yield prediction.
 * - ExplainablePredictionInput - The input type for the explainablePrediction function.
 * - ExplainablePredictionOutput - The return type for the explainablePrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainablePredictionInputSchema = z.object({
  latitude: z.number().describe('Latitude of the field.'),
  longitude: z.number().describe('Longitude of the field.'),
  cropType: z.string().describe('Type of crop.'),
  sowingDate: z.string().describe('Sowing date of the crop (YYYY-MM-DD).'),
  seasonalRainfall: z.number().describe('Seasonal rainfall during the crop-growing window.'),
  consecutiveDryDays: z.number().describe('Maximum streak of consecutive dry days.'),
  gdd: z.number().describe('Growing degree days.'),
  soilPh: z.number().describe('Soil pH.'),
  soilSoc: z.number().describe('Soil organic carbon.'),
  soilClayPct: z.number().describe('Soil clay percentage.'),
  ndviMean: z.number().describe('Mean NDVI value.'),
  ndviMax: z.number().describe('Maximum NDVI value.'),
  ndviAuc: z.number().describe('Area under the NDVI curve.'),
  ndviPeakDate: z.string().describe('Date of peak NDVI (YYYY-MM-DD).'),
  ndviDeclineRate: z.number().describe('NDVI decline rate.'),
  historicalYield: z.number().describe('Historical yield of the crop.'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Odia").'),
});

export type ExplainablePredictionInput = z.infer<typeof ExplainablePredictionInputSchema>;

const NdviDataPointSchema = z.object({
    date: z.string().describe("The date of the NDVI reading in ISO 8601 format (YYYY-MM-DD)."),
    ndvi: z.number().min(0).max(1).describe("The NDVI value for that date."),
});

const ExplainablePredictionOutputSchema = z.object({
  explanation: z.string().describe('Explanation of the key factors influencing the crop yield prediction.'),
  ndviData: z.array(NdviDataPointSchema).describe("A series of 8-10 simulated NDVI data points over the growing season for charting purposes."),
});

export type ExplainablePredictionOutput = z.infer<typeof ExplainablePredictionOutputSchema>;

export async function explainablePrediction(input: ExplainablePredictionInput): Promise<ExplainablePredictionOutput> {
  return explainablePredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainablePredictionPrompt',
  input: {schema: ExplainablePredictionInputSchema},
  output: {schema: ExplainablePredictionOutputSchema},
  prompt: `You are an expert agricultural advisor explaining crop yield predictions to farmers.

  Based on the following factors, provide two things:
  1. An explanation of the key drivers influencing the predicted crop yield. Consider both positive and negative factors, and explain their impact in a way that is easy for a farmer to understand.
  2. A simulated array of 8-10 NDVI data points over the growing season. The NDVI curve should be plausible based on the input data (e.g., sowing date, crop type, weather factors). The dates should be in YYYY-MM-DD format.
  
  Respond entirely in the following language: {{{language}}}.

  Latitude: {{{latitude}}}
  Longitude: {{{longitude}}}
  Crop Type: {{{cropType}}}
  Sowing Date: {{{sowingDate}}}
  Seasonal Rainfall: {{{seasonalRainfall}}} mm
  Consecutive Dry Days: {{{consecutiveDryDays}}} days
  Growing Degree Days: {{{gdd}}}
  Soil pH: {{{soilPh}}}
  Soil Organic Carbon: {{{soilSoc}}}
  Soil Clay Percentage: {{{soilClayPct}}}
  NDVI Mean: {{{ndviMean}}}
  NDVI Max: {{{ndviMax}}}
  NDVI AUC: {{{ndviAuc}}}
  NDVI Peak Date: {{{ndviPeakDate}}}
  NDVI Decline Rate: {{{ndviDeclineRate}}}
  Historical Yield: {{{historicalYield}}} t/ha
  `,}
);

const explainablePredictionFlow = ai.defineFlow(
  {
    name: 'explainablePredictionFlow',
    inputSchema: ExplainablePredictionInputSchema,
    outputSchema: ExplainablePredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
