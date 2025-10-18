// src/components/agrivision/AppShell.tsx
'use client';
import { LayoutDashboard, BarChart, Settings, Leaf, Bug, ShoppingCart, PanelLeft, Beaker, Map, Cloud } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

const NavLink = ({ item, pathname, isMobile = false }: { item: { href: string, label: string, icon: React.ElementType }, pathname: string, isMobile?: boolean }) => {
  const isActive = pathname === item.href;
  
  if (isMobile) {
      return (
        <Link href={item.href} className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            isActive && "bg-muted text-primary"
        )}>
            <item.icon className="h-4 w-4" />
            {item.label}
        </Link>
      )
  }

  return (
    <Link href={item.href} className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-muted active:scale-95",
        "transform hover:scale-105",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
    )}>
        <item.icon className="h-4 w-4" />
        {item.label}
    </Link>
  )
}

function MainNav({ pathname, isMobile = false }: { pathname: string, isMobile?: boolean }) {
    const { translations: t } = useLanguage();
    const menuItems = [
        { href: '/', label: t.sidebar.dashboard, icon: LayoutDashboard },
        { href: '/fields', label: t.sidebar.fieldManagement, icon: Map },
        { href: '/weather', label: t.sidebar.weather, icon: Cloud },
        { href: '/analysis', label: t.sidebar.analysis, icon: BarChart },
        { href: '/soil-analysis', label: t.sidebar.soilAnalysis, icon: Beaker },
        { href: '/pest-disease', label: t.sidebar.pestDisease, icon: Bug },
        { href: '/market', label: t.sidebar.marketPrices, icon: ShoppingCart },
    ];

    const settingsItem = { href: '/settings', label: t.sidebar.settings, icon: Settings };
    
    if (isMobile) {
        return (
             <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {[...menuItems, settingsItem].map(item => <NavLink key={item.href} item={item} pathname={pathname} isMobile />)}
            </nav>
        )
    }

    const isActive = pathname === settingsItem.href;

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex-1 flex justify-start">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Leaf className="h-6 w-6 text-primary" />
                    <span className="hidden sm:inline-block">AgriVision AI</span>
                </Link>
            </div>

            <nav className="hidden md:flex items-center gap-2 lg:gap-4">
                {menuItems.map(item => <NavLink key={item.href} item={item} pathname={pathname} />)}
            </nav>

            <div className="flex-1 flex justify-end">
                 <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href={settingsItem.href}
                                className={cn(
                                    "flex items-center justify-center h-10 w-10 rounded-md text-sm font-medium transition-all duration-200 ease-in-out hover:bg-muted active:scale-95",
                                    "transform hover:scale-105",
                                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">{settingsItem.label}</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{settingsItem.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
          <div className="hidden md:flex w-full">
            <MainNav pathname={pathname} />
          </div>

          {/* Mobile Header */}
          <Link href="/" className="flex items-center gap-2 font-semibold md:hidden">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="">AgriVision AI</span>
          </Link>
          <div className="flex-1 md:hidden"></div>
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader className="h-16 flex-row items-center border-b px-6">
                    <SheetTitle>
                        <Link href="/" className="flex items-center gap-2 font-semibold">
                        <Leaf className="h-6 w-6 text-primary" />
                        <span className="">AgriVision AI</span>
                        </Link>
                    </SheetTitle>
                    <SheetDescription className="sr-only">Main navigation menu</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto py-2" onClick={() => setMobileNavOpen(false)}>
                    <MainNav pathname={pathname} isMobile />
                </div>
            </SheetContent>
          </Sheet>
          
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/40">
          {children}
      </main>
    </div>
  );
}
