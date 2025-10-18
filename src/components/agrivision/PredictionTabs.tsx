'use client';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { predictYieldFromPrompt, predictYieldFromModel } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import type { Location } from './AnalysisPage';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/lib/translations';
import type { YieldPredictionFromModelOutput } from '@/ai/flows/yield-prediction-from-model';
import type { YieldPredictionOutput } from '@/ai/flows/yield-prediction-from-prompt';


// Define schemas for form validation
const quickPredictionSchema = z.object({
  fieldDescription: z.string().min(20, 'Please provide a more detailed description.'),
});

const detailedAnalysisSchema = z.object({
  cropType: z.string().default('Rice'),
  sowingDate: z.string().default('2024-06-15'),
  seasonalRainfall: z.coerce.number().default(800),
  consecutiveDryDays: z.coerce.number().default(10),
  gdd: z.coerce.number().default(2500),
  soilPh: z.coerce.number().default(6.5),
  soilSoc: z.coerce.number().default(0.5),
  soilClayPct: z.coerce.number().default(30),
  ndviMean: z.coerce.number().default(0.6),
  ndviMax: z.coerce.number().default(0.85),
  ndviAuc: z.coerce.number().default(50),
  ndviPeakDate: z.string().default('2024-08-01'),
  ndviDeclineRate: z.coerce.number().default(0.1),
  historicalYield: z.coerce.number().default(3.5),
});

type DetailedAnalysisValues = z.infer<typeof detailedAnalysisSchema>;

interface PredictionTabsProps {
  location: Location | null;
  onYieldPrediction: (data: YieldPredictionOutput) => void;
  onDetailedAnalysis: (data: YieldPredictionFromModelOutput) => void;
  onLoading: (loading: boolean) => void;
  fieldData?: any;
  weatherData?: any;
  soilData?: any;
}

export function PredictionTabs({ location, onYieldPrediction, onDetailedAnalysis, onLoading, fieldData, weatherData, soilData }: PredictionTabsProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { language, translations: t } = useLanguage();

  const detailedForm = useForm<DetailedAnalysisValues>({
    resolver: zodResolver(detailedAnalysisSchema),
    defaultValues: detailedAnalysisSchema.parse({}),
  });

  const handleQuickSubmit = () => {
    // Build comprehensive description from all available data
    let description = '';
    
    // Field data
    if (fieldData) {
      description += `Field Information:\n`;
      description += `- Name: ${fieldData.name}\n`;
      description += `- Location: ${fieldData.location}\n`;
      description += `- Crop: ${fieldData.crop}\n`;
      description += `- Area: ${fieldData.size} hectares\n`;
      if (fieldData.coordinates && fieldData.coordinates.length > 0) {
        let sumLat = 0, sumLng = 0;
        fieldData.coordinates.forEach((coord: [number, number]) => {
          sumLat += coord[0];
          sumLng += coord[1];
        });
        const centerLat = (sumLat / fieldData.coordinates.length).toFixed(6);
        const centerLng = (sumLng / fieldData.coordinates.length).toFixed(6);
        description += `- Coordinates: ${centerLat}, ${centerLng}\n`;
      }
      description += `\n`;
    }
    
    // Weather data
    if (weatherData && weatherData.currentWeather) {
      description += `Weather Conditions:\n`;
      description += `- Temperature: ${weatherData.currentWeather.temperature}°C\n`;
      description += `- Humidity: ${weatherData.currentWeather.humidity}%\n`;
      description += `- Wind Speed: ${weatherData.currentWeather.windSpeed} km/h\n`;
      description += `- Condition: ${weatherData.currentWeather.condition}\n`;
      description += `- Pressure: ${weatherData.currentWeather.pressure} hPa\n`;
      if (weatherData.forecast && weatherData.forecast.length > 0) {
        description += `- 7-Day Forecast: Available (${weatherData.forecast.length} days)\n`;
      }
      description += `\n`;
    }
    
    // Soil data
    if (soilData && soilData.soilData) {
      description += `Soil Analysis:\n`;
      description += `- Nitrogen (N): ${soilData.soilData.N}\n`;
      description += `- Phosphorus (P): ${soilData.soilData.P}\n`;
      description += `- Potassium (K): ${soilData.soilData.K}\n`;
      description += `- pH Level: ${soilData.soilData.ph}\n`;
      description += `- Temperature: ${soilData.soilData.temperature}°C\n`;
      description += `- Humidity: ${soilData.soilData.humidity}%\n`;
      description += `- Rainfall: ${soilData.soilData.rainfall}mm\n`;
      if (soilData.analysis) {
        if (soilData.analysis.fertility_analysis) {
          description += `- Fertility: ${soilData.analysis.fertility_analysis.overall_fertility}\n`;
        }
        if (soilData.analysis.irrigation_analysis) {
          description += `- Irrigation Score: ${soilData.analysis.irrigation_analysis.score}/5\n`;
        }
      }
      description += `\n`;
    }
    
    if (!description) {
      toast({ 
        variant: 'destructive', 
        title: 'No Data Available', 
        description: 'Please send field, weather, or soil data to Analysis page first.' 
      });
      return;
    }
    
    description += `Please provide a comprehensive crop yield prediction and analysis based on the above data.`;
    
    startTransition(async () => {
      onLoading(true);
      const result = await predictYieldFromPrompt({ fieldDescription: description, language: language.name });
      if (result.success) {
        onYieldPrediction(result.data);
        toast({ title: t.predictionTabs.quickPredictionSuccessTitle, description: t.predictionTabs.quickPredictionSuccessDescription });
      } else {
        toast({ variant: 'destructive', title: t.predictionTabs.predictionFailedTitle, description: result.error });
      }
      onLoading(false);
    });
  };

  const handleDetailedSubmit = (values: DetailedAnalysisValues) => {
    if (!location) {
        toast({ variant: 'destructive', title: t.predictionTabs.locationNotSetTitle, description: t.predictionTabs.locationNotSetDescription });
        return;
    }
    startTransition(async () => {
      onLoading(true);
      const input = { ...values, latitude: location.lat, longitude: location.lng, language: language.name };
      
      const result = await predictYieldFromModel(input);

      if (result.success) {
        onDetailedAnalysis(result.data);
        toast({ title: t.predictionTabs.analysisCompleteTitle, description: t.predictionTabs.analysisCompleteDescription });
      } else {
        toast({ variant: 'destructive', title: t.predictionTabs.predictionFailedTitle, description: result.error });
      }

      onLoading(false);
    });
  };

  const formFields = [
    { name: "cropType", label: t.predictionTabs.form.cropType },
    { name: "sowingDate", label: t.predictionTabs.form.sowingDate, type: "date" },
    { name: "seasonalRainfall", label: t.predictionTabs.form.seasonalRainfall, type: "number" },
    { name: "consecutiveDryDays", label: t.predictionTabs.form.consecutiveDryDays, type: "number" },
    { name: "gdd", label: t.predictionTabs.form.gdd, type: "number" },
    { name: "soilPh", label: t.predictionTabs.form.soilPh, type: "number", step: "any" },
    { name: "soilSoc", label: t.predictionTabs.form.soilSoc, type: "number", step: "any" },
    { name: "soilClayPct", label: t.predictionTabs.form.soilClayPct, type: "number" },
    { name: "ndviMean", label: t.predictionTabs.form.ndviMean, type: "number", step: "any" },
    { name: "ndviMax", label: t.predictionTabs.form.ndviMax, type: "number", step: "any" },
    { name: "ndviAuc", label: t.predictionTabs.form.ndviAuc, type: "number" },
    { name: "ndviPeakDate", label: t.predictionTabs.form.ndviPeakDate, type: "date" },
    { name: "ndviDeclineRate", label: t.predictionTabs.form.ndviDeclineRate, type: "number", step: "any" },
    { name: "historicalYield", label: t.predictionTabs.form.historicalYield, type: "number", step: "any" },
  ];

  return (
    <Card>
        <CardHeader>
            <CardTitle>{t.predictionTabs.title}</CardTitle>
            <CardDescription>{t.predictionTabs.description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="quick">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="quick">{t.predictionTabs.quickPredictionTab}</TabsTrigger>
                    <TabsTrigger value="detailed">{t.predictionTabs.detailedAnalysisTab}</TabsTrigger>
                </TabsList>
                <TabsContent value="quick" className="mt-4">
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Data Sources for Analysis:</h4>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                {fieldData && <p>✓ Field data available</p>}
                                {weatherData && <p>✓ Weather data available</p>}
                                {soilData && <p>✓ Soil data available</p>}
                                {!fieldData && !weatherData && !soilData && (
                                    <p className="text-destructive">⚠ No data available. Please send field, weather, or soil data first.</p>
                                )}
                            </div>
                        </div>
                        <Button 
                            onClick={handleQuickSubmit} 
                            className="w-full" 
                            disabled={isPending || (!fieldData && !weatherData && !soilData)}
                        >
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isPending ? t.predictionTabs.analyzing : 'Get AI Prediction'}
                        </Button>
                        {(!fieldData && !weatherData && !soilData) && (
                            <p className="text-xs text-center text-destructive">
                                Please send field, weather, or soil data to Analysis page first
                            </p>
                        )}
                    </div>
                </TabsContent>
                <TabsContent value="detailed" className="mt-4">
                    <Form {...detailedForm}>
                        <form onSubmit={detailedForm.handleSubmit(handleDetailedSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formFields.slice(0, 4).map(({name, label, type, step}) => (
                                    <FormField key={name} control={detailedForm.control} name={name as any} render={({ field }) => (
                                        <FormItem><FormLabel>{label}</FormLabel><FormControl><Input type={type || "text"} step={step} {...field} /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                ))}
                            </div>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="more-options">
                                    <AccordionTrigger>{t.predictionTabs.showMoreParams}</AccordionTrigger>
                                    <AccordionContent className="pt-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {formFields.slice(4).map(({name, label, type, step}) => (
                                                 <FormField
                                                    key={name}
                                                    control={detailedForm.control}
                                                    name={name as any}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>{label}</FormLabel>
                                                            <FormControl>
                                                                <Input type={type || "text"} step={step} {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                            <Button type="submit" className="w-full" disabled={isPending || !location}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isPending ? t.predictionTabs.analyzing : t.predictionTabs.getDetailedAnalysisButton}
                            </Button>
                            {!location && <p className="text-xs text-center text-destructive">{t.predictionTabs.selectLocationWarning}</p>}
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </CardContent>
    </Card>
  );
}
