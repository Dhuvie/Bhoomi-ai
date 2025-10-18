import { Leaf } from 'lucide-react';
import type { FC } from 'react';
import { SidebarTrigger } from '../ui/sidebar';

export const Header: FC = () => {
  return (
    <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden"/>
        <div className="p-2 rounded-full bg-primary/10 hidden md:block">
            <Leaf className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-xl font-bold tracking-tight font-headline text-foreground">AgriVision AI</h1>
      </div>
    </header>
  );
};
