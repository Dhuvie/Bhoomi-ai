import { config } from 'dotenv';
config();

import '@/ai/flows/yield-prediction-from-prompt.ts';
import '@/ai/flows/localized-recommendations-with-audio.ts';
import '@/ai/flows/explainable-prediction.ts';
import '@/ai/flows/diagnose-plant-flow.ts';
import '@/ai/flows/get-market-prices-flow.ts';
import '@/ai/flows/get-weather-data-flow.ts';
import '@/ai/flows/yield-prediction-from-model.ts';
