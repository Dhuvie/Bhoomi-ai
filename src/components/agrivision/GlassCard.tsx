'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  gradient?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient = 'from-primary/10 to-transparent',
  children, 
  footer,
  className = '',
  hover = false
}: GlassCardProps) {
  return (
    <Card className={`relative overflow-hidden backdrop-blur-sm bg-card/50 border-border/50 shadow-lg transition-all duration-300 ${hover ? 'hover:shadow-xl hover:scale-[1.02]' : ''} ${className}`}>
      {/* Gradient blob */}
      <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${gradient} rounded-full blur-3xl opacity-50 pointer-events-none`} />
      
      {title && (
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            {Icon && (
              <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} backdrop-blur-sm`}>
                <Icon className="w-5 h-5 text-primary" />
              </div>
            )}
            <span>{title}</span>
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      
      <CardContent className="relative">
        {children}
      </CardContent>
      
      {footer && (
        <CardFooter className="relative">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
