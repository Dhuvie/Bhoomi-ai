'use client';

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  children?: ReactNode;
}

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  gradient = 'from-primary/20 via-primary/10 to-transparent',
  children 
}: PageHeaderProps) {
  return (
    <div className="relative mb-8">
      {/* Animated background blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -top-20 -right-24 w-80 h-80 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      
      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} backdrop-blur-sm border border-primary/20 shadow-lg`}>
                <Icon className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                {title}
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl">
              {description}
            </p>
          </div>
          {children && (
            <div className="flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
