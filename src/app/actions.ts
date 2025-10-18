'use server';

import { predictYieldFromPrompt as predictYieldFromPromptFlow, YieldPredictionInput } from '@/ai/flows/yield-prediction-from-prompt';
import { getLocalizedRecommendationsWithAudio as getLocalizedRecommendationsWithAudioFlow, LocalizedRecommendationsWithAudioInput } from '@/ai/flows/localized-recommendations-with-audio';
import { explainablePrediction as explainablePredictionFlow, ExplainablePredictionInput } from '@/ai/flows/explainable-prediction';
import { diagnosePlant as diagnosePlantFlow, DiagnosePlantInput } from '@/ai/flows/diagnose-plant-flow';
import { getMarketPrices as getMarketPricesFlow, MarketPricesInput } from '@/ai/flows/get-market-prices-flow';
import { getWeatherData as getWeatherDataFlow } from '@/ai/flows/get-weather-data-flow';
import { predictYieldFromModel as predictYieldFromModelFlow, YieldPredictionFromModelInput } from '@/ai/flows/yield-prediction-from-model';


export async function predictYieldFromPrompt(input: YieldPredictionInput) {
  try {
    const result = await predictYieldFromPromptFlow(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
  }
}

export async function getLocalizedRecommendationsWithAudio(input: LocalizedRecommendationsWithAudioInput) {
    try {
        const result = await getLocalizedRecommendationsWithAudioFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function explainablePrediction(input: ExplainablePredictionInput) {
    try {
        const result = await explainablePredictionFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function diagnosePlant(input: DiagnosePlantInput) {
    try {
      const result = await diagnosePlantFlow(input);
      return { success: true, data: result };
    } catch (error) {
      console.error(error);
      return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function getMarketPrices(input: MarketPricesInput) {
    try {
        const result = await getMarketPricesFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function getWeatherData(lat?: number, lon?: number) {
    try {
        const result = await getWeatherDataFlow(lat, lon);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}

export async function predictYieldFromModel(input: YieldPredictionFromModelInput) {
    try {
        const result = await predictYieldFromModelFlow(input);
        return { success: true, data: result };
    } catch (error) {
        console.error(error);
        return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred.' };
    }
}
