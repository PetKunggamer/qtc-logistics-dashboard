import { cn } from '../../utils/helpers';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div className={cn(
      'bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50',
      'shadow-sm',
      padding && 'p-5',
      className,
    )}>
      {children}
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: { value: number; label: string };
  color?: 'blue' | 'emerald' | 'amber' | 'red' | 'violet' | 'cyan' | 'orange';
}

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

export function KPICard({ title, value, subtitle, icon, trend, color = 'blue' }: KPICardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0', colorMap[color])}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</p>
        <p className="text-slate-900 dark:text-white text-2xl font-bold mt-0.5">{value}</p>
        {subtitle && <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{subtitle}</p>}
        {trend && (
          <div className={cn('flex items-center gap-1 text-xs mt-1.5 font-medium', trend.value >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400')}>
            <span>{trend.value >= 0 ? '↑' : '↓'}</span>
            <span>{Math.abs(trend.value)}% {trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
