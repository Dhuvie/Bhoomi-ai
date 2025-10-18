// src/ai/flows/yield-prediction-from-prompt.ts
'use server';
/**
 * @fileOverview Predicts crop yields based on a user-provided description of field conditions.
 *
 * - predictYieldFromPrompt - A function that takes a descriptive prompt and returns a yield prediction.
 * - YieldPredictionInput - The input type for the predictYieldFromPrompt function.
 * - YieldPredictionOutput - The return type for the predictYieldFromPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const YieldPredictionInputSchema = z.object({
  fieldDescription: z
    .string()
    .describe(
      'A detailed description of the field conditions, including location, soil type, weather patterns, and crop type.'
    ),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Odia").'),
});
export type YieldPredictionInput = z.infer<typeof YieldPredictionInputSchema>;

const YieldPredictionOutputSchema = z.object({
  predictedYield: z
    .number()
    .describe('The predicted crop yield in tonnes per hectare.'),
  confidenceIntervalLower: z
    .number()
    .optional()
    .describe('The lower bound of the confidence interval for the yield prediction.'),
  confidenceIntervalUpper: z
    .number()
    .optional()
    .describe('The upper bound of the confidence interval for the yield prediction.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable recommendations for the farmer based on the field conditions.'),
  explanation: z
    .string()
    .describe('An explanation of the factors influencing the yield prediction.'),
});
export type YieldPredictionOutput = z.infer<typeof YieldPredictionOutputSchema>;

export async function predictYieldFromPrompt(input: YieldPredictionInput): Promise<YieldPredictionOutput> {
  return predictYieldFromPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'yieldPredictionPrompt',
  input: {schema: YieldPredictionInputSchema},
  output: {schema: YieldPredictionOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the following description of a farmer's field conditions, provide a prediction of the crop yield in tonnes per hectare, a confidence interval for the prediction if possible, actionable recommendations for the farmer to improve their yield, and an explanation of the factors influencing your prediction.

Respond entirely in the following language: {{{language}}}.

Field Description: {{{fieldDescription}}}

Respond in the following JSON format:
{
  "predictedYield": number,
  "confidenceIntervalLower": number | null,
  "confidenceIntervalUpper": number | null,
  "recommendations": string[],
  "explanation": string
}
`,
});

const predictYieldFromPromptFlow = ai.defineFlow(
  {
    name: 'predictYieldFromPromptFlow',
    inputSchema: YieldPredictionInputSchema,
    outputSchema: YieldPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
