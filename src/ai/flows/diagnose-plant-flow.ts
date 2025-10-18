// src/ai/flows/diagnose-plant-flow.ts
'use server';
/**
 * @fileOverview An AI flow to diagnose plant health from an image.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi", "Odia").'),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  identification: z.object({
    isPlant: z.boolean().describe('Whether or not the input image is determined to be a plant.'),
    commonName: z.string().describe('The common name of the identified plant.').optional(),
    latinName: z.string().describe('The Latin name of the identified plant.').optional(),
  }),
  diagnosis: z.object({
    isHealthy: z.boolean().describe('Whether or not the plant is healthy.').optional(),
    disease: z.string().describe('The name of the disease or pest identified.').optional(),
    symptoms: z.array(z.string()).describe('A list of symptoms observed on the plant.').optional(),
    precautions: z.array(z.string()).describe('A list of preventive measures.').optional(),
    cure: z.array(z.string()).describe('A list of steps to cure the plant.').optional(),
  }),
  plantInfo: z.object({
      history: z.string().describe('A brief history or general information about the plant.').optional(),
      idealConditions: z.string().describe('The ideal growing conditions (weather, soil) for the plant.').optional(),
  }).optional(),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert botanist and plant pathologist. Your task is to analyze the provided image of a plant and respond *entirely* in the specified language.

Language for response: {{{language}}}

1.  First, determine if the image contains a plant. Set 'isPlant' accordingly.
2.  If it is a plant, identify its common and Latin names.
3.  Provide a brief history and the ideal growing conditions for this plant.
4.  Examine the plant for any signs of disease, pests, or nutrient deficiencies.
5.  Determine if the plant is healthy ('isHealthy').
6.  If the plant is unhealthy:
    - Identify the specific disease or pest.
    - List the symptoms you observe.
    - Provide a list of precautions to prevent this issue in the future.
    - Provide a list of steps to cure the current issue.
7.  If the plant is healthy, state that in the 'disease' field and provide general care tips in the 'cure' field.
8. If the image is not a plant, simply return with 'isPlant' as false and do not fill out the other fields.

Image: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
