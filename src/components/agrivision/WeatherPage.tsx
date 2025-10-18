'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useFields } from '@/contexts/FieldsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Cloud, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge,
  MapPin,
  Calendar,
  TrendingUp,
  BarChart3,
  Download
} from 'lucide-react';
import { PageHeader } from './PageHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  condition: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  humidity: number;
  rainfall: number;
}

interface HistoricalData {
  month: string;
  avgTemp: number;
  rainfall: number;
  humidity: number;
}

export function WeatherPage() {
  const { fields } = useFields();
  const { translations: t } = useLanguage();
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [selectedField, setSelectedField] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(false);

  // Get current location weather
  useEffect(() => {
    getCurrentLocationWeather();
  }, []);

  const getCurrentLocationWeather = async () => {
    setLoading(true);
    try {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            // Mock weather data - replace with actual API call
            const mockWeather: WeatherData = {
              location: 'Current Location',
              temperature: 28,
              feelsLike: 30,
              humidity: 65,
              windSpeed: 12,
              pressure: 1013,
              visibility: 10,
              condition: 'Partly Cloudy',
              icon: 'partly-cloudy'
            };
            setCurrentWeather(mockWeather);
            generateForecast();
            setLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setLoading(false);
          }
        );
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setLoading(false);
    }
  };

  const getFieldWeather = async (field: any) => {
    setLoading(true);
    setSelectedField(field);
    
    // Calculate field center
    let centerLat = 20.2961, centerLng = 85.8245;
    if (field.coordinates && field.coordinates.length > 0) {
      let sumLat = 0, sumLng = 0;
      field.coordinates.forEach((coord: [number, number]) => {
        sumLat += coord[0];
        sumLng += coord[1];
      });
      centerLat = sumLat / field.coordinates.length;
      centerLng = sumLng / field.coordinates.length;
    }

    // Mock weather data - replace with actual API call
    const mockWeather: WeatherData = {
      location: field.name,
      temperature: 27,
      feelsLike: 29,
      humidity: 70,
      windSpeed: 10,
      pressure: 1012,
      visibility: 9,
      condition: 'Clear Sky',
      icon: 'clear'
    };
    setCurrentWeather(mockWeather);
    generateForecast();
    generateHistoricalData();
    setLoading(false);
  };

  const generateForecast = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    
    const forecast: ForecastDay[] = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: i === 0 ? 'Today' : days[date.getDay()],
        maxTemp: Math.floor(Math.random() * 8) + 28,
        minTemp: Math.floor(Math.random() * 5) + 20,
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        humidity: Math.floor(Math.random() * 20) + 60,
        rainfall: Math.random() * 10
      };
    });
    setForecast(forecast);
  };

  const generateHistoricalData = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const historical: HistoricalData[] = months.map(month => ({
      month,
      avgTemp: Math.floor(Math.random() * 8) + 24,
      rainfall: Math.floor(Math.random() * 150) + 50,
      humidity: Math.floor(Math.random() * 15) + 65
    }));
    setHistoricalData(historical);
  };

  const sendToAnalysis = () => {
    const weatherData = {
      currentWeather,
      forecast,
      historicalData,
      field: selectedField
    };
    localStorage.setItem('weatherDataForAnalysis', JSON.stringify(weatherData));
    window.location.href = '/analysis';
  };

  const exportWeatherReport = () => {
    // Mock export - in real app, generate PDF
    const data = {
      currentWeather,
      forecast,
      historicalData,
      field: selectedField,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weather-report-${selectedField?.name || 'current'}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('Rain')) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (condition.includes('Cloud')) return <Cloud className="w-8 h-8 text-gray-500" />;
    return <Sun className="w-8 h-8 text-yellow-500" />;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={Cloud}
        title={t.weather.title}
        description={t.weather.description}
        gradient="from-blue-400/20 via-cyan-500/10 to-transparent"
      />

      <Tabs defaultValue="current" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">{t.weather.currentWeather}</TabsTrigger>
          <TabsTrigger value="forecast">{t.weather.forecast}</TabsTrigger>
          <TabsTrigger value="historical">{t.weather.historical}</TabsTrigger>
        </TabsList>

        {/* Current Weather Tab */}
        <TabsContent value="current" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
            {/* Field Selector */}
            <Card className="glass-panel shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{t.weather.selectLocation}</CardTitle>
                <CardDescription className="text-xs">{t.weather.selectLocation}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={getCurrentLocationWeather}
                  className="w-full gap-2"
                  variant={!selectedField ? "default" : "outline"}
                >
                  <MapPin className="w-4 h-4" />
                  {t.weather.currentLocation}
                </Button>
                
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{t.weather.yourFields}:</p>
                  {fields.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">{t.fieldManagement.noFields}</p>
                  ) : (
                    fields.map((field) => (
                      <Button
                        key={field.id}
                        onClick={() => getFieldWeather(field)}
                        variant={selectedField?.id === field.id ? "default" : "outline"}
                        className="w-full justify-start gap-2"
                        size="sm"
                      >
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: field.color }}
                        />
                        {field.name}
                      </Button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weather Display */}
            {currentWeather && (
              <Card className="glass-panel shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl">{currentWeather.location}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {selectedField ? `${selectedField.location} - ${selectedField.size.toFixed(2)} ha` : 'Your current location'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={exportWeatherReport}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      {selectedField && (
                        <Button size="sm" onClick={sendToAnalysis}>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Send to Analysis
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Main Weather */}
                    <div className="flex items-center gap-6">
                      {getWeatherIcon(currentWeather.condition)}
                      <div>
                        <div className="text-5xl font-bold">{currentWeather.temperature}°C</div>
                        <p className="text-muted-foreground">Feels like {currentWeather.feelsLike}°C</p>
                        <p className="text-sm font-medium mt-1">{currentWeather.condition}</p>
                      </div>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Humidity</p>
                            <p className="text-sm font-semibold">{currentWeather.humidity}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wind className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Wind Speed</p>
                            <p className="text-sm font-semibold">{currentWeather.windSpeed} km/h</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-purple-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Pressure</p>
                            <p className="text-sm font-semibold">{currentWeather.pressure} hPa</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-cyan-500" />
                          <div>
                            <p className="text-xs text-muted-foreground">Visibility</p>
                            <p className="text-sm font-semibold">{currentWeather.visibility} km</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* 7-Day Forecast Tab */}
        <TabsContent value="forecast" className="space-y-4">
          <Card className="glass-panel shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                7-Day Weather Forecast
              </CardTitle>
              <CardDescription>
                {selectedField ? `Forecast for ${selectedField.name}` : 'Select a field to see forecast'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                {forecast.map((day, index) => (
                  <Card key={index} className="text-center hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <p className="font-semibold text-sm mb-2">{day.date}</p>
                      {getWeatherIcon(day.condition)}
                      <p className="text-xs text-muted-foreground mt-2">{day.condition}</p>
                      <div className="mt-3 space-y-1">
                        <p className="text-lg font-bold">{day.maxTemp}°</p>
                        <p className="text-sm text-muted-foreground">{day.minTemp}°</p>
                      </div>
                      <div className="mt-2 pt-2 border-t space-y-1">
                        <p className="text-xs">💧 {day.humidity}%</p>
                        <p className="text-xs">🌧️ {day.rainfall.toFixed(1)}mm</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historical Data Tab */}
        <TabsContent value="historical" className="space-y-4">
          <Card className="glass-panel shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Past 6 Months Weather Data
              </CardTitle>
              <CardDescription>
                {selectedField ? `Historical data for ${selectedField.name}` : 'Select a field to see historical data'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historicalData.length > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {historicalData.map((data, index) => (
                      <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <p className="font-semibold text-lg mb-3">{data.month} 2024</p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Avg Temp</span>
                              <span className="font-semibold">{data.avgTemp}°C</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Rainfall</span>
                              <span className="font-semibold">{data.rainfall}mm</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Humidity</span>
                              <span className="font-semibold">{data.humidity}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Select a field to view historical weather data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
