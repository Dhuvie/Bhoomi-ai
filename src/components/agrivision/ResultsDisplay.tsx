
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { YieldPredictionOutput } from "@/ai/flows/yield-prediction-from-prompt";
import type { YieldPredictionFromModelOutput } from "@/ai/flows/yield-prediction-from-model";

import { BarChart, List, BotMessageSquare } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useLanguage } from "@/contexts/LanguageContext";

interface ResultsDisplayProps {
  yieldPrediction: YieldPredictionOutput | null;
  detailedPrediction: YieldPredictionFromModelOutput | null;
  isLoading: boolean;
}

const chartConfig = {
  ndvi: {
    label: "NDVI",
    color: "hsl(var(--chart-1))",
  },
};

export function ResultsDisplay({ yieldPrediction, detailedPrediction, isLoading }: ResultsDisplayProps) {
    const { translations: t, language } = useLanguage();

    if (isLoading) {
        return <ResultsSkeleton />;
    }
    
    const predictionData = yieldPrediction || detailedPrediction;
    const ndviData = detailedPrediction?.ndviData;

    if (!predictionData) {
        return (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
                <BotMessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">{t.results.awaitingAnalysis}</h3>
                <p className="text-muted-foreground">{t.results.resultsWillAppear}</p>
            </Card>
        );
    }
  
  return (
    <Card className="h-full overflow-hidden">
        <CardHeader>
            <CardTitle>{t.results.analysisResults}</CardTitle>
            <CardDescription>{t.results.resultsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="text-center p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm font-medium text-primary">{t.results.predictedYield}</p>
                    <p className="text-5xl font-bold text-primary">{predictionData.predictedYield.toFixed(2)}</p>
                    {'confidenceIntervalLower' in predictionData && predictionData.confidenceIntervalLower && predictionData.confidenceIntervalUpper && (
                        <p className="text-xs text-primary/80">
                            {t.results.confidence}: {predictionData.confidenceIntervalLower.toFixed(2)} - {predictionData.confidenceIntervalUpper.toFixed(2)}
                        </p>
                    )}
                </div>
                
                <Accordion type="single" collapsible className="w-full" defaultValue="recommendations">
                    <AccordionItem value="recommendations">
                        <AccordionTrigger><List className="w-4 h-4 mr-2"/>{t.results.recommendations}</AccordionTrigger>
                        <AccordionContent>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {predictionData.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="explanation">
                        <AccordionTrigger><BotMessageSquare className="w-4 h-4 mr-2"/>{t.results.aiExplanation}</AccordionTrigger>
                        <AccordionContent>
                            <p className="text-sm">{predictionData.explanation}</p>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {ndviData && ndviData.length > 0 && (
                <div className="space-y-2">
                    <h4 className="font-semibold flex items-center"><BarChart className="w-4 h-4 mr-2"/>{t.results.ndviTrend}</h4>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ChartContainer config={chartConfig} className="w-full h-full">
                                <AreaChart data={ndviData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => new Date(value).toLocaleDateString(language.code, { month: 'short', day: 'numeric' })}/>
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 1]}/>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area dataKey="ndvi" type="monotone" stroke="var(--color-ndvi)" fill="var(--color-ndvi)" fillOpacity={0.3} strokeWidth={2} dot={false} />
                                </AreaChart>
                            </ChartContainer>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </CardContent>
    </Card>
  );
}


function ResultsSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="text-center p-6 bg-muted rounded-lg">
                    <Skeleton className="h-4 w-1/3 mx-auto mb-2" />
                    <Skeleton className="h-12 w-1/2 mx-auto mb-2" />
                    <Skeleton className="h-3 w-1/4 mx-auto" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </CardContent>
        </Card>
    );
}
