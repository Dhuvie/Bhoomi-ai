import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  unit: string;
  Icon: LucideIcon;
  gradient?: string;
  description?: string;
}

export function StatCard({ title, value, unit, Icon, gradient = "gradient-primary", description }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${gradient} bg-opacity-10`}>
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          {value}
          <span className="text-lg ml-1 text-muted-foreground font-normal">{unit}</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
