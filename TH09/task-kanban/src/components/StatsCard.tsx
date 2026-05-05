import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  color: 'blue' | 'emerald' | 'amber' | 'red' | 'indigo';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorVariants = {
  blue: {
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  emerald: {
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800',
  },
  amber: {
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  red: {
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  indigo: {
    iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800',
  },
};

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'indigo',
  trend,
}: StatsCardProps) {
  const colors = colorVariants[color];

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-3xl p-6 border ${colors.border} hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {title}
          </p>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mt-3">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-4 rounded-2xl ${colors.iconBg}`}>
          <Icon className={`w-8 h-8 ${colors.iconColor}`} />
        </div>
      </div>

      {trend && (
        <div className="mt-6 flex items-center gap-1 text-sm">
          <span
            className={trend.isPositive ? 'text-emerald-500' : 'text-red-500'}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-gray-500 dark:text-gray-400">
            so với tuần trước
          </span>
        </div>
      )}
    </div>
  );
}
