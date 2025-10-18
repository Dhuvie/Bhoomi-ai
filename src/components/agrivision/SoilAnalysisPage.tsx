'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Beaker, Droplets, Leaf, Activity, Loader2, AlertCircle, TrendingUp, Sprout, CheckCircle, XCircle, Lightbulb, Download, BarChart3 } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';

type SoilData = {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
};

type AnalysisResult = {
  irrigation_analysis: {
    score: number;
    description: string;
  };
  fertility_analysis: {
    ph: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    overall_fertility: string;
  };
  recommended_crops?: string[];
  improvement_suggestions?: string[];
};

export function SoilAnalysisPage() {
  const { translations: t } = useLanguage();
  const [formData, setFormData] = useState<SoilData>({
    N: 50,
    P: 50,
    K: 50,
    temperature: 25,
    humidity: 70,
    ph: 6.5,
    rainfall: 100,
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof SoilData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const getCropRecommendations = (data: SoilData, fertilityAnalysis: any) => {
    const crops: string[] = [];
    const { N, P, K, ph, temperature, rainfall } = data;
    
    // Rice - high water requirement
    if (rainfall > 100 && ph >= 5.5 && ph <= 7.0 && temperature >= 20 && temperature <= 35) {
      crops.push('Rice');
    }
    
    // Wheat - moderate water, cooler climate
    if (rainfall >= 50 && rainfall <= 150 && ph >= 6.0 && ph <= 7.5 && temperature >= 15 && temperature <= 25 && N >= 60) {
      crops.push('Wheat');
    }
    
    // Maize/Corn - versatile
    if (ph >= 5.5 && ph <= 7.5 && temperature >= 20 && temperature <= 30 && N >= 50) {
      crops.push('Maize');
    }
    
    // Cotton - warm climate, moderate water
    if (temperature >= 25 && temperature <= 35 && rainfall >= 60 && rainfall <= 120 && ph >= 6.0 && ph <= 8.0) {
      crops.push('Cotton');
    }
    
    // Sugarcane - high water and nutrients
    if (rainfall > 120 && temperature >= 25 && N >= 80 && K >= 60) {
      crops.push('Sugarcane');
    }
    
    // Pulses (Lentils, Chickpeas) - low water
    if (rainfall >= 40 && rainfall <= 100 && ph >= 6.0 && ph <= 7.5 && temperature >= 20 && temperature <= 30) {
      crops.push('Pulses (Lentils/Chickpeas)');
    }
    
    // Vegetables - good soil fertility
    if (fertilityAnalysis.overall_fertility.includes('Good') || fertilityAnalysis.overall_fertility.includes('Moderate')) {
      crops.push('Vegetables (Tomato, Potato, Onion)');
    }
    
    // Millets - drought resistant
    if (rainfall >= 30 && rainfall <= 80 && temperature >= 25 && temperature <= 35) {
      crops.push('Millets (Pearl/Finger)');
    }
    
    return crops.length > 0 ? crops : ['Consult local agricultural expert for specific recommendations'];
  };

  const getImprovementSuggestions = (data: SoilData, fertilityAnalysis: any, irrigationScore: number) => {
    const suggestions: string[] = [];
    
    // pH improvements
    if (data.ph < 6.0) {
      suggestions.push('Add lime or wood ash to increase soil pH (reduce acidity)');
    } else if (data.ph > 7.5) {
      suggestions.push('Add sulfur or organic compost to decrease soil pH (reduce alkalinity)');
    }
    
    // Nitrogen improvements
    if (fertilityAnalysis.nitrogen === 'Low') {
      suggestions.push('Apply nitrogen-rich fertilizers (urea, ammonium sulfate) or use legume cover crops');
    } else if (fertilityAnalysis.nitrogen === 'High') {
      suggestions.push('Reduce nitrogen fertilizer application to prevent nutrient runoff');
    }
    
    // Phosphorus improvements
    if (fertilityAnalysis.phosphorus === 'Low') {
      suggestions.push('Add phosphate fertilizers (DAP, SSP) or bone meal');
    } else if (fertilityAnalysis.phosphorus === 'High') {
      suggestions.push('Avoid phosphorus fertilizers; excess can harm water bodies');
    }
    
    // Potassium improvements
    if (fertilityAnalysis.potassium === 'Low') {
      suggestions.push('Apply potassium-rich fertilizers (muriate of potash) or wood ash');
    }
    
    // Irrigation improvements
    if (irrigationScore === 0 || irrigationScore === 1) {
      suggestions.push('Install drip irrigation system for efficient water use');
      suggestions.push('Mulch around plants to retain soil moisture');
    } else if (irrigationScore === 5) {
      suggestions.push('Improve drainage with raised beds or drainage channels');
      suggestions.push('Reduce irrigation frequency to prevent waterlogging');
    }
    
    // General improvements
    if (!fertilityAnalysis.overall_fertility.includes('Good')) {
      suggestions.push('Add organic matter (compost, manure) to improve soil structure');
      suggestions.push('Practice crop rotation to maintain soil health');
    }
    
    // Temperature-based suggestions
    if (data.temperature > 35) {
      suggestions.push('Use shade nets or mulching to reduce soil temperature');
    }
    
    return suggestions.length > 0 ? suggestions : ['Your soil is in good condition! Maintain current practices.'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze soil data');
      }

      const data = await response.json();
      
      // Add crop recommendations and improvement suggestions
      const enrichedData = {
        ...data,
        recommended_crops: getCropRecommendations(formData, data.fertility_analysis),
        improvement_suggestions: getImprovementSuggestions(formData, data.fertility_analysis, data.irrigation_analysis.score)
      };
      
      setResult(enrichedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Make sure the API server is running on http://127.0.0.1:8000');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('Optimal') || status.includes('Good')) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (status.includes('Moderate')) {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getIrrigationColor = (score: number) => {
    if (score === 0 || score === 1) return 'text-red-500';
    if (score === 2 || score === 3) return 'text-green-500';
    if (score === 4) return 'text-blue-500';
    return 'text-orange-500';
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={Beaker}
        title={t.soilAnalysis.title}
        description={t.soilAnalysis.description}
        gradient="from-green-400/20 via-emerald-500/10 to-transparent"
      />

      {/* Input Form - Full Width */}
      <Card className="relative overflow-hidden glass-panel shadow-soft hover-lift">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-600/20">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            Soil Parameters
          </CardTitle>
          <CardDescription>
            Enter your soil test results and environmental conditions
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* All inputs in a responsive grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
              <div className="space-y-2">
                <Label htmlFor="N" className="text-xs">Nitrogen (N)</Label>
                <Input
                  id="N"
                  type="number"
                  value={formData.N}
                  onChange={(e) => handleInputChange('N', e.target.value)}
                  required
                  min="0"
                  max="200"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="P" className="text-xs">Phosphorus (P)</Label>
                <Input
                  id="P"
                  type="number"
                  value={formData.P}
                  onChange={(e) => handleInputChange('P', e.target.value)}
                  required
                  min="0"
                  max="200"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="K" className="text-xs">Potassium (K)</Label>
                <Input
                  id="K"
                  type="number"
                  value={formData.K}
                  onChange={(e) => handleInputChange('K', e.target.value)}
                  required
                  min="0"
                  max="200"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-xs">Temp (°C)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                  required
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humidity" className="text-xs">Humidity (%)</Label>
                <Input
                  id="humidity"
                  type="number"
                  step="0.1"
                  value={formData.humidity}
                  onChange={(e) => handleInputChange('humidity', e.target.value)}
                  required
                  min="0"
                  max="100"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ph" className="text-xs">pH Value</Label>
                <Input
                  id="ph"
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleInputChange('ph', e.target.value)}
                  required
                  min="0"
                  max="14"
                  className="h-9"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rainfall" className="text-xs">Rainfall (mm)</Label>
                <Input
                  id="rainfall"
                  type="number"
                  step="0.1"
                  value={formData.rainfall}
                  onChange={(e) => handleInputChange('rainfall', e.target.value)}
                  required
                  min="0"
                  className="h-9"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full shadow-lg hover:shadow-xl transition-shadow h-10"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Activity className="mr-2 h-4 w-4" />
                  Analyze Soil
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Results Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <>
          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => {
                const reportData = {
                  soilData: formData,
                  analysis: result,
                  generatedAt: new Date().toISOString()
                };
                const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `soil-analysis-report-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button
              onClick={() => {
                localStorage.setItem('soilDataForAnalysis', JSON.stringify({
                  soilData: formData,
                  analysis: result
                }));
                window.location.href = '/analysis';
              }}
              className="gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Send to Analysis
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Irrigation Analysis */}
              <Card className="relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-600/20">
                      <Droplets className="w-5 h-5 text-blue-500" />
                    </div>
                    Irrigation Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Irrigation Score</span>
                    <span className={`text-2xl font-bold ${getIrrigationColor(result.irrigation_analysis.score)}`}>
                      {result.irrigation_analysis.score}/5
                    </span>
                  </div>
                  <Progress value={result.irrigation_analysis.score * 20} className="h-2" />
                  <Alert>
                    <Droplets className="h-4 w-4" />
                    <AlertTitle>Recommendation</AlertTitle>
                    <AlertDescription className="font-medium">
                      {result.irrigation_analysis.description}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Fertility Analysis */}
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-600/20">
                      <Leaf className="w-5 h-5 text-green-500" />
                    </div>
                    Soil Fertility Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="font-medium">Overall Fertility</span>
                    <span className="font-bold text-primary">{result.fertility_analysis.overall_fertility}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.fertility_analysis.ph)}
                        <span className="text-sm">pH Level</span>
                      </div>
                      <span className="text-sm font-medium">{result.fertility_analysis.ph}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.fertility_analysis.nitrogen)}
                        <span className="text-sm">Nitrogen (N)</span>
                      </div>
                      <span className="text-sm font-medium">{result.fertility_analysis.nitrogen}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.fertility_analysis.phosphorus)}
                        <span className="text-sm">Phosphorus (P)</span>
                      </div>
                      <span className="text-sm font-medium">{result.fertility_analysis.phosphorus}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.fertility_analysis.potassium)}
                        <span className="text-sm">Potassium (K)</span>
                      </div>
                      <span className="text-sm font-medium">{result.fertility_analysis.potassium}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Crop Recommendations */}
              {result.recommended_crops && result.recommended_crops.length > 0 && (
                <Card className="relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-3xl" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-400/20 to-green-600/20">
                        <Sprout className="w-5 h-5 text-emerald-500" />
                      </div>
                      Recommended Crops
                    </CardTitle>
                    <CardDescription>
                      Suitable crops based on your soil conditions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {result.recommended_crops.map((crop, index) => (
                        <div 
                          key={index}
                          className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800"
                        >
                          <Sprout className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-sm font-medium text-emerald-900 dark:text-emerald-100">{crop}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Improvement Suggestions */}
              {result.improvement_suggestions && result.improvement_suggestions.length > 0 && (
                <Card className="relative overflow-hidden">
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl" />
                  <CardHeader className="relative">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-400/20 to-orange-600/20">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                      </div>
                      Improvement Suggestions
                    </CardTitle>
                    <CardDescription>
                      Actions to enhance your soil quality
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="space-y-3">
                      {result.improvement_suggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="mt-0.5">
                            <TrendingUp className="w-4 h-4 text-amber-600" />
                          </div>
                          <p className="text-sm text-foreground flex-1">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
        </div>
        </>
      )}

      {!result && !error && !loading && (
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <CardContent className="relative flex flex-col items-center justify-center py-12 text-center">
            <Beaker className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Enter your soil parameters and click "Analyze Soil" to get detailed insights about irrigation needs and soil fertility.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Important Information
          </CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <strong>API Server Required:</strong> Make sure your FastAPI server is running on <code className="px-1 py-0.5 bg-muted rounded">http://127.0.0.1:8000</code></p>
            <p>• <strong>Start Server:</strong> Run <code className="px-1 py-0.5 bg-muted rounded">uvicorn main_api:app --reload</code> in your API directory</p>
            <p>• <strong>Model File:</strong> Ensure <code className="px-1 py-0.5 bg-muted rounded">best_pipeline.pkl</code> is in the same directory as your API file</p>
            <p>• <strong>Optimal Ranges:</strong> N: 60-120, P: 40-80, K: 40-80, pH: 6.0-7.5</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
