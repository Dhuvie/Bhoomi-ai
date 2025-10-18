// src/components/agrivision/MarketPricesPage.tsx
'use client';
import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, TrendingUp, TrendingDown, Minus, Weight, Star, Trash2, PlusCircle, ShoppingCart } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { getMarketPrices } from '@/app/actions';
import type { MarketPricesOutput } from '@/ai/flows/get-market-prices-flow';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Label } from '../ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';


const formSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  crop: z.string().min(1, 'Crop is required'),
});

type Unit = 'quintal' | 'tonne' | 'kg';
type Favorite = z.infer<typeof formSchema>;

const unitConversions = {
  quintal: 1,
  tonne: 10,
  kg: 0.01,
};

function FavoriteCardSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function MarketPricesPage() {
  const { translations: t } = useLanguage();
  const [isPending, startTransition] = useTransition();
  const [prices, setPrices] = useState<MarketPricesOutput | null>(null);
  const [unit, setUnit] = useState<Unit>('quintal');
  const { toast } = useToast();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [favoritePrices, setFavoritePrices] = useState<Record<string, MarketPricesOutput | 'loading' | 'error'>>({});

  useEffect(() => {
    try {
        const savedFavorites = localStorage.getItem('market-favorites');
        if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
        }
    } catch (e) {
        console.error("Could not load favorites from localStorage", e);
    }
  }, []);
  
  useEffect(() => {
    const fetchFavoritePrices = () => {
      if(favorites.length === 0) return;

      const newFavoritePrices: Record<string, MarketPricesOutput | 'loading' | 'error'> = {};
      favorites.forEach(fav => {
        const key = `${fav.location}-${fav.crop}`;
        newFavoritePrices[key] = 'loading';
      });
      setFavoritePrices(newFavoritePrices);

      favorites.forEach(async (fav) => {
        const key = `${fav.location}-${fav.crop}`;
        const result = await getMarketPrices(fav);
        setFavoritePrices(prev => ({
          ...prev,
          [key]: result.success ? result.data : 'error',
        }));
      });
    };
    fetchFavoritePrices();
  }, [favorites]);

  const handleSetFavorites = (newFavorites: Favorite[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('market-favorites', JSON.stringify(newFavorites));
  }

  const isFavorited = (location: string, crop: string) => {
    return favorites.some(f => f.location.toLowerCase() === location.toLowerCase() && f.crop.toLowerCase() === crop.toLowerCase());
  }

  const handleFavoriteToggle = () => {
    if (!prices) return;
    const { location, crop } = prices;
    if (isFavorited(location, crop)) {
      handleSetFavorites(favorites.filter(f => f.location.toLowerCase() !== location.toLowerCase() || f.crop.toLowerCase() !== crop.toLowerCase()));
      toast({ title: "Removed from favorites." });
    } else {
      handleSetFavorites([...favorites, { location, crop }]);
      toast({ title: "Added to favorites." });
    }
  }

  const handleRemoveFavorite = (fav: Favorite) => {
    handleSetFavorites(favorites.filter(f => f.location.toLowerCase() !== fav.location.toLowerCase() || f.crop.toLowerCase() !== fav.crop.toLowerCase()));
    toast({ title: "Removed from favorites." });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { location: 'Bhubaneswar', crop: 'Rice' },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setPrices(null);
      const result = await getMarketPrices(values);
      if (result.success) {
        setPrices(result.data);
      } else {
        toast({ variant: 'destructive', title: t.market.fetching, description: result.error });
      }
    });
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  }
  
  const convertPrice = (price: number) => {
    return price * unitConversions[unit];
  }
  
  const PriceTable = ({ prices, unit }: { prices: MarketPricesOutput; unit: Unit }) => (
     <Table>
        <TableHeader>
            <TableRow>
                <TableHead>{t.market.grade}</TableHead>
                <TableHead>{t.market.pricePerUnit(unit)}</TableHead>
                <TableHead className="text-right">{t.market.trend}</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {prices.prices.map((priceInfo) => (
                <TableRow key={priceInfo.grade}>
                    <TableCell className="font-medium">{t.market.grades[priceInfo.grade] || priceInfo.grade}</TableCell>
                    <TableCell>₹{convertPrice(priceInfo.price).toLocaleString('en-IN', {maximumFractionDigits: 2})}</TableCell>
                    <TableCell className="text-right flex justify-end">{getTrendIcon(priceInfo.trend)}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        icon={ShoppingCart}
        title={t.market.title}
        description={t.market.description}
        gradient="from-amber-400/20 via-orange-500/10 to-transparent"
      />

      <Card>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 items-end">
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>{t.market.location}</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />
              <FormField control={form.control} name="crop" render={({ field }) => (
                <FormItem className="flex-1"><FormLabel>{t.market.crop}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select a crop" /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="Rice">Rice</SelectItem>
                            <SelectItem value="Wheat">Wheat</SelectItem>
                            <SelectItem value="Maize">Maize</SelectItem>
                            <SelectItem value="Potato">Potato</SelectItem>
                            <SelectItem value="Tomato">Tomato</SelectItem>
                            <SelectItem value="Sugarcane">Sugarcane</SelectItem>
                            <SelectItem value="Cotton">Cotton</SelectItem>
                            <SelectItem value="Soybean">Soybean</SelectItem>
                            <SelectItem value="Mustard">Mustard</SelectItem>
                            <SelectItem value="Onion">Onion</SelectItem>
                            <SelectItem value="Mango">Mango</SelectItem>
                            <SelectItem value="Banana">Banana</SelectItem>
                            <SelectItem value="Lentils">Lentils</SelectItem>
                            <SelectItem value="Chickpeas">Chickpeas</SelectItem>
                            <SelectItem value="Groundnut">Groundnut</SelectItem>
                            <SelectItem value="Millet">Millet</SelectItem>
                            <SelectItem value="Barley">Barley</SelectItem>
                        </SelectContent>
                    </Select>
                </FormItem>
              )} />
              <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                {isPending && <Loader2 className="mr-2 animate-spin" />}
                {isPending ? t.market.fetching : t.market.fetchPricesButton}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isPending && (
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
             <div className="space-y-2">
                <div className="flex justify-between p-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-16" /></div>
                <div className="flex justify-between p-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-4 w-16" /></div>
                <div className="flex justify-between p-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-16" /></div>
            </div>
          </CardContent>
        </Card>
      )}

      {prices && !isPending && (
        <Card>
            <CardHeader>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                        <CardTitle>{t.market.marketPrices}: {prices.crop} - {prices.location}</CardTitle>
                        <CardDescription>{t.market.lastUpdated} {new Date(prices.lastUpdated).toLocaleString()}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="unit-select" className="text-sm flex items-center gap-1 flex-shrink-0"><Weight className="w-4 h-4"/>{t.market.unit}</Label>
                        <Select value={unit} onValueChange={(value) => setUnit(value as Unit)}>
                            <SelectTrigger className="w-[120px]" id="unit-select">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="quintal">{t.market.quintal}</SelectItem>
                                <SelectItem value="tonne">{t.market.tonne}</SelectItem>
                                <SelectItem value="kg">{t.market.kg}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <PriceTable prices={prices} unit={unit} />
                    <Button variant="outline" onClick={handleFavoriteToggle}>
                       <Star className={`mr-2 h-4 w-4 ${isFavorited(prices.location, prices.crop) ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                       {isFavorited(prices.location, prices.crop) ? "Favorited" : "Add to Favorites"}
                   </Button>
                </div>
            </CardContent>
        </Card>
      )}

      {favorites.length > 0 && (
         <div className="space-y-4 pt-6">
            <h2 className="text-xl font-bold tracking-tight">Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favorites.map(fav => {
                    const key = `${fav.location}-${fav.crop}`;
                    const priceData = favoritePrices[key];
                    return (
                        <div key={key}>
                        {priceData === 'loading' ? (<FavoriteCardSkeleton/>) :
                        (<Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{fav.crop} - {fav.location}</CardTitle>
                                        {priceData && typeof priceData !== 'string' && (
                                             <CardDescription>{t.market.lastUpdated} {new Date(priceData.lastUpdated).toLocaleString()}</CardDescription>
                                        )}
                                    </div>
                                     <Button variant="ghost" size="icon" className="text-muted-foreground -mr-2 -mt-2" onClick={() => handleRemoveFavorite(fav)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {priceData === 'error' && <p className="text-destructive text-center p-8">Could not load prices.</p>}
                                {priceData && typeof priceData !== 'string' && (
                                    <PriceTable prices={priceData} unit={unit} />
                                )}
                            </CardContent>
                        </Card>)}
                        </div>
                    );
                })}
            </div>
        </div>
      )}
    </div>
  );
}
