
// src/components/agrivision/AnalysisPage.tsx
'use client';
import { useState, Suspense, useMemo, useEffect } from 'react';
import { PredictionTabs } from './PredictionTabs';
import { ResultsDisplay } from './ResultsDisplay';

import type { YieldPredictionOutput } from '@/ai/flows/yield-prediction-from-prompt';
import type { YieldPredictionFromModelOutput } from '@/ai/flows/yield-prediction-from-model';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, BarChart, Cloud, Droplets, Wind, Thermometer, Beaker, X } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useActivityHistory } from '@/hooks/useActivityHistory';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { odishaLocations } from '@/lib/odisha-locations';
import { Skeleton } from '../ui/skeleton';


export type Location = { lat: number; lng: number; name?: string };


function LocationInput({ onLocationChange }: { onLocationChange: (location: Location | null) => void }) {
    const { translations: t } = useLanguage();
    const [locationName, setLocationName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const filteredLocations = useMemo(() => {
        if (!searchQuery) return odishaLocations;
        return odishaLocations.filter(loc =>
            loc.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);
    
    const handleSetLocation = (name: string) => {
        setLocationName(name);
        // In a real app with a geocoding API, this would convert name to lat/lng.
        // For this prototype, we'll pass the name and use dummy coordinates.
        if (name) {
            onLocationChange({ lat: 20.2961, lng: 85.8245, name: name });
        } else {
            onLocationChange(null);
        }
    };
    
    useEffect(() => {
        handleSetLocation(locationName);
    }, [locationName]);

    return (
        <Card>
            <CardHeader>
                {isClient ? (
                    <CardTitle className="flex items-center gap-2"><MapPin/> {t.settings.myFields.fieldLocation}</CardTitle>
                ) : (
                    <Skeleton className="h-7 w-48" />
                )}
                <CardDescription>Select a location in Odisha for your analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="location-search">Location Name</Label>
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                             <Input 
                                id="location-search" 
                                placeholder="e.g., Bhubaneswar, Cuttack" 
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value)
                                    if (!isPopoverOpen) setIsPopoverOpen(true);
                                }}
                                onClick={() => setIsPopoverOpen(true)}
                                role="combobox"
                                aria-expanded={isPopoverOpen}
                            />
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Search locations..." />
                                <CommandList>
                                    <CommandEmpty>No location found.</CommandEmpty>
                                    <CommandGroup>
                                        {filteredLocations.slice(0, 100).map((location) => (
                                        <CommandItem
                                            key={location}
                                            value={location}
                                            onSelect={(currentValue) => {
                                                const selectedName = odishaLocations.find(l => l.toLowerCase() === currentValue.toLowerCase()) || currentValue;
                                                setLocationName(selectedName);
                                                setSearchQuery(selectedName);
                                                setIsPopoverOpen(false);
                                            }}
                                        >
                                            {location}
                                        </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {locationName && <p className="text-sm text-muted-foreground pt-2">Selected Location: <span className="font-semibold text-primary">{locationName}</span></p>}
                </div>
            </CardContent>
        </Card>
    );
}

function AnalysisPageComponent() {
    const { translations: t } = useLanguage();
    const [location, setLocation] = useState<Location | null>(null);
    const [yieldPrediction, setYieldPrediction] = useState<YieldPredictionOutput | null>(null);
    const [detailedPrediction, setDetailedPrediction] = useState<YieldPredictionFromModelOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addActivity } = useActivityHistory();
    const [selectedField, setSelectedField] = useState<any>(null);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [soilData, setSoilData] = useState<any>(null);

    // Load field, weather, and soil data from localStorage on mount
    useEffect(() => {
        // Load field data
        const fieldData = localStorage.getItem('selectedFieldForAnalysis');
        if (fieldData) {
            const field = JSON.parse(fieldData);
            setSelectedField(field);
            
            // Calculate center point from field coordinates for accurate location
            if (field.coordinates && field.coordinates.length > 0) {
                // Calculate centroid of the polygon
                let sumLat = 0;
                let sumLng = 0;
                field.coordinates.forEach((coord: [number, number]) => {
                    sumLat += coord[0];
                    sumLng += coord[1];
                });
                const centerLat = sumLat / field.coordinates.length;
                const centerLng = sumLng / field.coordinates.length;
                
                setLocation({ 
                    lat: centerLat, 
                    lng: centerLng, 
                    name: field.location || field.name 
                });
            } else if (field.location) {
                // Fallback to default Bhubaneswar coordinates if no field coordinates
                setLocation({ lat: 20.2961, lng: 85.8245, name: field.location });
            }
        }

        // Load weather data
        const weatherDataStr = localStorage.getItem('weatherDataForAnalysis');
        if (weatherDataStr) {
            setWeatherData(JSON.parse(weatherDataStr));
        }

        // Load soil data
        const soilDataStr = localStorage.getItem('soilDataForAnalysis');
        if (soilDataStr) {
            setSoilData(JSON.parse(soilDataStr));
        }
    }, []);

    const clearResults = () => {
        setYieldPrediction(null);
        setDetailedPrediction(null);
    };

    const handleYieldPrediction = (data: YieldPredictionOutput) => {
        clearResults();
        setYieldPrediction(data);
        addActivity({ type: 'Quick Analysis', description: 'Yield Prediction' });
    };

    const handleDetailedAnalysis = (data: YieldPredictionFromModelOutput) => {
        clearResults();
        setDetailedPrediction(data);
        addActivity({ type: 'Detailed Analysis', description: 'Yield Prediction' });
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <PageHeader
                icon={BarChart}
                title="Crop Analysis"
                description="Predict crop yields and get detailed analysis based on your field conditions"
                gradient="from-blue-400/20 via-cyan-500/10 to-transparent"
            />
            
            {/* Field Information Card */}
            {selectedField && (
                <Card className="glass-panel shadow-lg border-2 border-primary/20 animate-slide-up">
                    <CardHeader className="pb-3 bg-gradient-to-r from-primary/10 to-transparent">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Field: {selectedField.name}</CardTitle>
                                    <CardDescription className="text-xs">Analyzing this field</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setSelectedField(null);
                                    localStorage.removeItem('selectedFieldForAnalysis');
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Location</p>
                                <p className="text-sm font-semibold">📍 {selectedField.location}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Crop Type</p>
                                <p className="text-sm font-semibold">🌾 {selectedField.crop}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Area</p>
                                <p className="text-sm font-semibold">📏 {selectedField.size.toFixed(2)} ha</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Area (acres)</p>
                                <p className="text-sm font-semibold">📐 {(selectedField.size * 2.471).toFixed(2)} acres</p>
                            </div>
                        </div>
                        {selectedField.coordinates && selectedField.coordinates.length > 0 && (
                            <div className="pt-3 border-t">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-muted-foreground">Field Coordinates</p>
                                    <p className="text-xs text-primary font-medium">✓ Using for analysis</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium">Center Point</p>
                                        <p className="text-xs font-mono bg-muted px-2 py-1 rounded">
                                            {(() => {
                                                let sumLat = 0, sumLng = 0;
                                                selectedField.coordinates.forEach((coord: [number, number]) => {
                                                    sumLat += coord[0];
                                                    sumLng += coord[1];
                                                });
                                                const centerLat = (sumLat / selectedField.coordinates.length).toFixed(6);
                                                const centerLng = (sumLng / selectedField.coordinates.length).toFixed(6);
                                                return `${centerLat}, ${centerLng}`;
                                            })()}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium">Boundary Points</p>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedField.coordinates.length} vertices
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Weather Data Card */}
            {weatherData && (
                <Card className="glass-panel shadow-lg border-2 border-blue-500/20 animate-slide-up">
                    <CardHeader className="pb-3 bg-gradient-to-r from-blue-500/10 to-transparent">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-gradient-to-br from-blue-400/20 to-blue-600/20">
                                    <Cloud className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Weather Data</CardTitle>
                                    <CardDescription className="text-xs">
                                        {weatherData.field ? `For ${weatherData.field.name}` : 'Current location'}
                                    </CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setWeatherData(null);
                                    localStorage.removeItem('weatherDataForAnalysis');
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {weatherData.currentWeather && (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Thermometer className="w-3 h-3" /> Temperature
                                        </p>
                                        <p className="text-sm font-semibold">{weatherData.currentWeather.temperature}°C</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Droplets className="w-3 h-3" /> Humidity
                                        </p>
                                        <p className="text-sm font-semibold">{weatherData.currentWeather.humidity}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Wind className="w-3 h-3" /> Wind Speed
                                        </p>
                                        <p className="text-sm font-semibold">{weatherData.currentWeather.windSpeed} km/h</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Cloud className="w-3 h-3" /> Condition
                                        </p>
                                        <p className="text-sm font-semibold">{weatherData.currentWeather.condition}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {weatherData.forecast && weatherData.forecast.length > 0 && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-xs font-medium text-muted-foreground mb-2">7-Day Forecast Available</p>
                                <p className="text-xs text-muted-foreground">{weatherData.forecast.length} days of forecast data included</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Soil Data Card */}
            {soilData && (
                <Card className="glass-panel shadow-lg border-2 border-green-500/20 animate-slide-up">
                    <CardHeader className="pb-3 bg-gradient-to-r from-green-500/10 to-transparent">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-gradient-to-br from-green-400/20 to-green-600/20">
                                    <Beaker className="w-5 h-5 text-green-500" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Soil Analysis Data</CardTitle>
                                    <CardDescription className="text-xs">Soil parameters and analysis</CardDescription>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setSoilData(null);
                                    localStorage.removeItem('soilDataForAnalysis');
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {soilData.soilData && (
                                <>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Nitrogen (N)</p>
                                        <p className="text-sm font-semibold">{soilData.soilData.N}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Phosphorus (P)</p>
                                        <p className="text-sm font-semibold">{soilData.soilData.P}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">Potassium (K)</p>
                                        <p className="text-sm font-semibold">{soilData.soilData.K}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">pH Level</p>
                                        <p className="text-sm font-semibold">{soilData.soilData.ph}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        {soilData.analysis && (
                            <div className="mt-4 pt-4 border-t">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Analysis Results</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {soilData.analysis.fertility_analysis && (
                                        <p className="text-xs">
                                            <span className="text-muted-foreground">Fertility:</span>{' '}
                                            <span className="font-semibold">{soilData.analysis.fertility_analysis.overall_fertility}</span>
                                        </p>
                                    )}
                                    {soilData.analysis.irrigation_analysis && (
                                        <p className="text-xs">
                                            <span className="text-muted-foreground">Irrigation Score:</span>{' '}
                                            <span className="font-semibold">{soilData.analysis.irrigation_analysis.score}/5</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            <div className="grid grid-cols-1 gap-6">
                <PredictionTabs 
                    location={location} 
                    onYieldPrediction={handleYieldPrediction}
                    onDetailedAnalysis={handleDetailedAnalysis}
                    onLoading={setIsLoading}
                    fieldData={selectedField}
                    weatherData={weatherData}
                    soilData={soilData}
                />
            </div>
            
            <div className="grid grid-cols-1">
                <ResultsDisplay 
                    yieldPrediction={yieldPrediction}
                    detailedPrediction={detailedPrediction}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}

export function AnalysisPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AnalysisPageComponent />
        </Suspense>
    );
}
