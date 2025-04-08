
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: {
    value: number;
    label: string;
    isUpward: boolean;
  };
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  icon,
  description,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div className={cn(
      "rounded-xl border border-border/50 bg-card p-6 shadow-subtle hover:shadow-elevation transition-shadow",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-primary">{icon}</div>}
      </div>
      
      <div className="flex flex-col space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">{value}</h3>
        
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        
        {trend && (
          <div className="flex items-center space-x-2 mt-1">
            <span className={cn(
              "text-xs font-medium",
              trend.isUpward ? "text-destructive" : "text-green-500"
            )}>
              {trend.isUpward ? '↑' : '↓'} {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
