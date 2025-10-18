

'use client';
import { useState, useEffect } from 'react';
import { StatCard } from './StatCard';
import { Droplets, Sun, Thermometer, Wind, Leaf, BarChart, MapPin, Coffee, Moon, Activity, PlusCircle, Settings, TrendingUp, RefreshCw, MapPinned, Gauge, Eye, Cloud, Sunrise, Sunset } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getWeatherData } from '@/app/actions';
import type { WeatherData } from '@/ai/flows/get-weather-data-flow';
import { Skeleton } from '../ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { useActivityHistory, Activity as ActivityType } from '@/hooks/useActivityHistory';
import { formatDistanceToNow } from 'date-fns';

type Field = {
    id: string;
    name: string;
    location: string;
    crop: string;
    size: number;
};

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--chart-1))",
  },
}

const sampleMarketData = [
    { date: 'Jan 23', price: 2100 }, { date: 'Feb 23', price: 2150 },
    { date: 'Mar 23', price: 2200 }, { date: 'Apr 23', price: 2250 },
    { date: 'May 23', price: 2300 }, { date: 'Jun 23', price: 2350 },
    { date: 'Jul 23', price: 2400 }, { date: 'Aug 23', price: 2350 },
    { date: 'Sep 23', price: 2250 }, { date: 'Oct 23', price: 2300 },
    { date: 'Nov 23', price: 2450 }, { date: 'Dec 23', price: 2500 }
];


function StatCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-7 w-1/3 mb-1" />
                <Skeleton className="h-3 w-1/2" />
            </CardContent>
        </Card>
    )
}

function WelcomeHeader() {
    const { translations: t } = useLanguage();
    const [greeting, setGreeting] = useState('');
    const [Icon, setIcon] = useState<React.ElementType>(Coffee);
  
    useEffect(() => {
      const updateGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
          setGreeting(t.dashboard.goodMorning);
          setIcon(() => Coffee);
        } else if (hour < 18) {
          setGreeting(t.dashboard.goodAfternoon);
          setIcon(() => Sun);
        } else {
          setGreeting(t.dashboard.goodEvening);
          setIcon(() => Moon);
        }
      };
      
      // Update greeting immediately
      updateGreeting();
      
      // Update greeting every minute to catch time changes
      const greetingInterval = setInterval(updateGreeting, 60000);
      
      return () => clearInterval(greetingInterval);
    }, [t]);
  
    if (!greeting) return <Skeleton className="h-8 w-48"/>;

    return (
      <div className="flex items-center gap-3">
        <Icon className="w-7 h-7 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">{greeting}</h1>
      </div>
    );
}

function MyFieldsCard() {
    const { translations: t } = useLanguage();
    const [fields, setFields] = useState<Field[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedFields = localStorage.getItem('my-fields');
            if (savedFields) {
                setFields(JSON.parse(savedFields));
            }
        } catch (e) {
            console.error("Could not load fields from localStorage", e);
        }
    }, []);

    if (!isClient) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                         <Skeleton className="h-6 w-1/2" />
                         <Skeleton className="h-8 w-8" />
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center"><Skeleton className="h-5 w-full" /></div>
                        <div className="flex items-center"><Skeleton className="h-5 w-full" /></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-2xl" />
            <CardHeader className="relative">
                <CardTitle className="flex items-center justify-between">
                    <span>{t.settings.myFields.title}</span>
                    <Button variant="ghost" size="icon" asChild className="hover:bg-primary/10">
                        <Link href="/settings"><Settings className="w-5 h-5"/></Link>
                    </Button>
                </CardTitle>
                <CardDescription>{t.settings.myFields.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {fields.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t.settings.myFields.fieldName}</TableHead>
                                <TableHead>{t.settings.myFields.fieldCrop}</TableHead>
                                <TableHead className="text-right">{t.settings.myFields.fieldSize}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fields.slice(0, 4).map(field => (
                                <TableRow key={field.id}>
                                    <TableCell className="font-medium">{field.name}</TableCell>
                                    <TableCell>{field.crop}</TableCell>
                                    <TableCell className="text-right">{field.size} {t.settings.myFields.fieldSizeUnit.charAt(0)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center text-muted-foreground py-4">
                        <p>{t.settings.myFields.noFields}</p>
                        <Button variant="link" asChild><Link href="/settings">Add a field</Link></Button>
                    </div>
                )}
            </CardContent>
             {fields.length > 4 && (
                <CardFooter>
                    <p className="text-sm text-muted-foreground">And {fields.length - 4} more...</p>
                </CardFooter>
            )}
        </Card>
    );
}

function MarketTrendChart() {
  const data = sampleMarketData;

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-3xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-600/20">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <span>Rice Market Trend</span>
        </CardTitle>
        <CardDescription>Simulated price trend for Rice in India (last 12 months).</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 0,
                  right: 30,
                  top: 5,
                  bottom: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <defs>
                  <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="price"
                  type="natural"
                  fill="url(#fillPrice)"
                  stroke="var(--color-price)"
                  stackId="a"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentActivity() {
  const { activities } = useActivityHistory();

  const getIconForActivity = (type: ActivityType['type']) => {
    switch (type) {
      case 'Detailed Analysis':
      case 'Quick Analysis':
        return BarChart;
      case 'Pest/Disease Diagnosis':
        return Leaf;
      default:
        return Activity;
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-600/20">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span>Recent Analyses</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.slice(0, 3).map((activity) => {
              const Icon = getIconForActivity(activity.type);
              return (
                <div key={activity.id} className="flex items-center">
                  <Icon className="text-muted-foreground mr-3" />
                  <div>
                    <p className="font-medium">{activity.type} - {activity.description}</p>
                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <p>No recent activity.</p>
            <Button variant="link" asChild><Link href="/analysis">Run an analysis</Link></Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { translations: t } = useLanguage();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const fetchWeather = async (lat?: number, lon?: number) => {
    setIsLoadingWeather(true);
    const result = await getWeatherData(lat, lon);
    if (result.success && result.data) {
      setWeatherData(result.data);
      setLastUpdated(new Date());
    }
    setIsLoadingWeather(false);
  };

  const requestLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          setLocationPermission('granted');
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationPermission('denied');
          // Fallback to default location
          fetchWeather();
        }
      );
    } else {
      console.warn('Geolocation not supported');
      setLocationPermission('denied');
      fetchWeather();
    }
  };

  useEffect(() => {
    // Request location and fetch weather immediately
    requestLocation();
    
    // Refresh weather data every 10 minutes (600000 ms)
    const weatherInterval = setInterval(() => {
      if (userLocation) {
        fetchWeather(userLocation.lat, userLocation.lon);
      } else {
        fetchWeather();
      }
    }, 600000);
    
    return () => clearInterval(weatherInterval);
  }, [userLocation]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="relative mb-2">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -top-20 -right-24 w-80 h-80 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="relative space-y-3">
          <WelcomeHeader />
          <p className="text-muted-foreground text-lg">{t.dashboard.welcomeDesc}</p>
          {weatherData?.location && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span title={locationPermission === 'granted' ? 'Using your current location' : 'Using default location (Bhubaneswar)'}>
                  {locationPermission === 'granted' ? (
                    <MapPinned className="w-4 h-4 text-green-500" />
                  ) : (
                    <MapPin className="w-4 h-4 text-amber-500" />
                  )}
                </span>
                <span>{weatherData.location}</span>
                {weatherData.description && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize">
                    {weatherData.description}
                  </span>
                )}
                {lastUpdated && (
                  <span className="ml-2 text-xs">
                    • Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => userLocation ? fetchWeather(userLocation.lat, userLocation.lon) : requestLocation()}
                disabled={isLoadingWeather}
                className="h-8 px-2"
                title={locationPermission === 'denied' ? 'Location access denied. Click to retry.' : 'Refresh weather data'}
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingWeather ? 'animate-spin' : ''}`} />
                <span className="ml-1 text-xs">Refresh</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Weather Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {weatherData ? (
          <>
            <StatCard 
              title="Temperature" 
              value={weatherData.temperature.toFixed(1)} 
              unit="°C" 
              Icon={Thermometer}
              gradient="bg-gradient-to-br from-orange-400/20 to-red-500/20"
              description={`Feels like ${weatherData.feelsLike.toFixed(1)}°C`}
            />
            <StatCard 
              title="Humidity" 
              value={weatherData.humidity.toFixed(0)} 
              unit="%" 
              Icon={Droplets}
              gradient="bg-gradient-to-br from-blue-400/20 to-cyan-500/20"
              description={`Dew point: ${weatherData.dewPoint?.toFixed(1) || 'N/A'}°C`}
            />
            <StatCard 
              title="Wind Speed" 
              value={weatherData.windSpeed.toFixed(1)} 
              unit="km/h" 
              Icon={Wind}
              gradient="bg-gradient-to-br from-teal-400/20 to-emerald-500/20"
              description="Current wind speed"
            />
            <StatCard 
              title="Pressure" 
              value={weatherData.pressure.toFixed(0)} 
              unit="hPa" 
              Icon={Gauge}
              gradient="bg-gradient-to-br from-purple-400/20 to-indigo-500/20"
              description="Atmospheric pressure"
            />
          </>
        ) : (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        )}
      </div>

      {/* Secondary Weather Metrics */}
      {weatherData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Visibility" 
            value={weatherData.visibility.toFixed(1)} 
            unit="km" 
            Icon={Eye}
            gradient="bg-gradient-to-br from-cyan-400/20 to-blue-500/20"
            description="Current visibility"
          />
          <StatCard 
            title="Cloud Cover" 
            value={weatherData.cloudCoverage.toFixed(0)} 
            unit="%" 
            Icon={Cloud}
            gradient="bg-gradient-to-br from-gray-400/20 to-slate-500/20"
            description={`${weatherData.sunlightHours.toFixed(1)}h sunlight`}
          />
          <StatCard 
            title="Rainfall" 
            value={weatherData.rainfall.toFixed(1)} 
            unit="mm" 
            Icon={Droplets}
            gradient="bg-gradient-to-br from-blue-500/20 to-indigo-600/20"
            description="Current/Recent"
          />
          {weatherData.uvIndex !== undefined && (
            <StatCard 
              title="UV Index" 
              value={weatherData.uvIndex.toFixed(0)} 
              unit="" 
              Icon={Sun}
              gradient="bg-gradient-to-br from-yellow-400/20 to-orange-500/20"
              description={weatherData.uvIndex > 7 ? "High - Use protection" : weatherData.uvIndex > 5 ? "Moderate" : "Low"}
            />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <MarketTrendChart />
          <Card className="relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-emerald-600/20">
                  <BarChart className="w-5 h-5 text-primary"/>
                </div>
                {t.dashboard.quickActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 relative">
              <Button asChild className="w-full shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/analysis">
                  <PlusCircle className="mr-2"/>
                  {t.dashboard.newAnalysis}
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/settings">
                  <Settings className="mr-2"/>
                  {t.sidebar.settings}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <MyFieldsCard />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}