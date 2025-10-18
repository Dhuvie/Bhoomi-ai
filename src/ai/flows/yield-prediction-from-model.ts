// src/ai/flows/yield-prediction-from-model.ts
'use server';

/**
 * @fileOverview A flow to predict crop yield using a custom ML model on Vertex AI
 * and provide an explanation using a language model.
 *
 * - predictYieldFromModel - A function that handles the prediction and explanation.
 * - YieldPredictionFromModelInput - The input type for the function.
 * - YieldPredictionFromModelOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';

const YieldPredictionFromModelInputSchema = z.object({
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

export type YieldPredictionFromModelInput = z.infer<typeof YieldPredictionFromModelInputSchema>;

const NdviDataPointSchema = z.object({
  date: z.string().describe("The date of the NDVI reading in ISO 8601 format (YYYY-MM-DD)."),
  ndvi: z.number().min(0).max(1).describe("The NDVI value for that date."),
});

const YieldPredictionFromModelOutputSchema = z.object({
  predictedYield: z.number().describe('The predicted crop yield in tonnes per hectare, as determined by the custom ML model.'),
  explanation: z.string().describe('An explanation of the key factors influencing the crop yield prediction.'),
  recommendations: z.array(z.string()).describe('Actionable recommendations for the farmer based on the field conditions.'),
  ndviData: z.array(NdviDataPointSchema).describe("A series of 8-10 simulated NDVI data points over the growing season for charting purposes."),
});

export type YieldPredictionFromModelOutput = z.infer<typeof YieldPredictionFromModelOutputSchema>;


// =================================================================================
// STEP 1: Define the Tool for your Custom ML Model
// This tool tells the AI how to call your Vertex AI endpoint.
//
// TODO: Replace the placeholder values with your actual Vertex AI endpoint details.
// =================================================================================
const predictYieldFromCustomModel = ai.defineTool(
    {
      name: 'predictYieldFromCustomModel',
      description: 'Predicts crop yield in tonnes per hectare based on structured agricultural data. Use this to get the primary yield prediction.',
      inputSchema: YieldPredictionFromModelInputSchema.omit({ language: true }), // The ML model doesn't need the language
      outputSchema: z.object({
        predictedYield: z.number(),
      }),
    },
    async (input) => {
      // This is a placeholder for calling your actual Vertex AI endpoint.
      // In a real implementation, you would use the Google AI Platform client library
      // to send a request to your deployed model.

      console.log('Calling placeholder ML model with input:', input);

      // =======================================================================================
      // TODO: Replace this placeholder logic with a real call to your Vertex AI endpoint.
      //
      // You will need:
      // 1. Your GCP Project ID.
      // 2. The region where your endpoint is deployed (e.g., "us-central1").
      // 3. The ID of your Vertex AI Endpoint.
      //
      // Example using `google-auth-library` and `node-fetch` (or axios):
      /*
      const { GoogleAuth } = require('google-auth-library');
      const auth = new GoogleAuth({ scopes: 'https://www.googleapis.com/auth/cloud-platform' });
      const client = await auth.getClient();
      const accessToken = (await client.getAccessToken()).token;

      const projectId = 'YOUR_GCP_PROJECT_ID';
      const location = 'us-central1'; // e.g., 'us-central1'
      const endpointId = 'YOUR_VERTEX_AI_ENDPOINT_ID';
      
      const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [input], // Your model will expect an array of instances
        }),
      });

      const data = await response.json();
      const predictedYield = data.predictions[0][0]; // Adjust based on your model's output format
      
      return { predictedYield };
      */
      // =======================================================================================

      // Placeholder Response: Simulates a prediction based on historical yield and rainfall.
      const simulatedYield = input.historicalYield * (input.seasonalRainfall / 800) * 1.1;
      return { predictedYield: parseFloat(simulatedYield.toFixed(2)) };
    }
  );


// =================================================================================
// STEP 2: Define the AI Flow that USES the Tool
// This flow orchestrates calling the ML model via the tool and then asks
// a language model to provide explanations and recommendations.
// =================================================================================
const yieldPredictionFromModelFlow = ai.defineFlow(
  {
    name: 'yieldPredictionFromModelFlow',
    inputSchema: YieldPredictionFromModelInputSchema,
    outputSchema: YieldPredictionFromModelOutputSchema,
  },
  async (input) => {

    const llm = googleAI.model('gemini-2.5-flash');

    // Here, we let the LLM orchestrate the call.
    // It sees the prompt, understands it needs a yield prediction,
    // finds the `predictYieldFromCustomModel` tool, and calls it with the input.
    const { output } = await ai.generate({
      model: llm,
      tools: [predictYieldFromCustomModel],
      output: { schema: YieldPredictionFromModelOutputSchema },
      prompt: `You are an expert agricultural advisor. Your primary task is to explain a crop yield prediction that was generated by a specialized machine learning model.

      1.  First, use the 'predictYieldFromCustomModel' tool to obtain the crop yield prediction.
      2.  Once you have the prediction, generate an easy-to-understand explanation for the farmer about the factors that likely influenced this result. Consider all the input data provided.
      3.  Provide a list of 3-4 actionable recommendations to help the farmer optimize their yield in the future based on the inputs.
      4.  Finally, create a simulated array of 8-10 plausible NDVI data points for the growing season that would be consistent with the other input data.
      
      Respond *entirely* in the following language: ${input.language}.
      
      Input Data:
      ${JSON.stringify(input, null, 2)}
      `,
    });
    
    return output!;
  }
);

// Export a server action that wraps the flow
export async function predictYieldFromModel(input: YieldPredictionFromModelInput): Promise<YieldPredictionFromModelOutput> {
    return yieldPredictionFromModelFlow(input);
}
