// src/ai/flows/get-market-prices-flow.ts
'use server';
/**
 * @fileOverview A flow to get simulated market prices for crops.
 *
 * - getMarketPrices - A function that returns simulated market prices.
 * - MarketPricesInput - The input type for the getMarketPrices function.
 * - MarketPricesOutput - The return type for the getMarketPrices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketPricesInputSchema = z.object({
  location: z.string().describe('The location (e.g., city or district) for which to fetch prices.'),
  crop: z.string().describe('The crop for which to fetch prices.'),
});
export type MarketPricesInput = z.infer<typeof MarketPricesInputSchema>;

const PriceInfoSchema = z.object({
  grade: z.string().describe('The descriptive name for the crop grade (e.g., "Premium Quality").'),
  price: z.number().describe('The price per quintal for this grade.'),
  trend: z.enum(['up', 'down', 'stable']).describe('The recent price trend.'),
});

const MarketPricesOutputSchema = z.object({
    location: z.string(),
    crop: z.string(),
    lastUpdated: z.string().describe('The ISO 8601 date string when the prices were generated.'),
    prices: z.array(PriceInfoSchema).describe('An array of price information for different grades.'),
});
export type MarketPricesOutput = z.infer<typeof MarketPricesOutputSchema>;

export async function getMarketPrices(input: MarketPricesInput): Promise<MarketPricesOutput> {
  return getMarketPricesFlow(input);
}


// In a real application, this flow would fetch data from a real market data API.
// For this prototype, we are simulating the response with a generative model
// to create plausible-looking but not real-time data.
const getMarketPricesFlow = ai.defineFlow(
  {
    name: 'getMarketPricesFlow',
    inputSchema: MarketPricesInputSchema,
    outputSchema: MarketPricesOutputSchema,
  },
  async ({location, crop}) => {
    
    const prompt = ai.definePrompt({
      name: 'marketPriceGeneratorPrompt',
      input: { schema: MarketPricesInputSchema },
      output: { schema: MarketPricesOutputSchema },
      prompt: `You are a market data provider for agricultural produce in India.
Generate realistic but fictional market prices for the given crop and location.
Provide prices for three quality grades: "Premium Quality", "Standard Quality", and "Fair Quality".
The price should be per quintal. Also, provide a price trend (up, down, or stable) for each grade.
Location: {{{location}}}
Crop: {{{crop}}}
`,
    });

    const { output } = await prompt({ location, crop });

    return {
        ...output!,
        lastUpdated: new Date().toISOString(),
    };
  }
);
