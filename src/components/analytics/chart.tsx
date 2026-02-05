'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { TimeSeriesDataPoint } from '@/types';

interface SimpleChartProps {
  title: string;
  description?: string;
  data: TimeSeriesDataPoint[];
  loading?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

/**
 * Simple chart component using CSS/SVG
 * TODO: Replace with recharts when more complex visualizations are needed
 * Note: This is a simplified chart for MVP - uses pure CSS for performance
 */
export function SimpleChart({
  title,
  description,
  data,
  loading,
  valuePrefix = '',
  valueSuffix = '',
  color = 'blue',
}: SimpleChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const average = Math.round(total / data.length);

  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {/* Summary stats */}
        <div className="flex items-baseline gap-4 mb-4">
          <div>
            <span className="text-2xl font-bold">
              {valuePrefix}{total.toLocaleString()}{valueSuffix}
            </span>
            <span className="text-sm text-muted-foreground ml-2">total</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {valuePrefix}{average.toLocaleString()}{valueSuffix} avg/day
          </div>
        </div>

        {/* Bar chart */}
        <div className="flex items-end gap-1 h-[160px]">
          {data.map((point) => {
            const height = (point.value / maxValue) * 100;
            return (
              <div
                key={point.date}
                className="flex-1 flex flex-col items-center group"
              >
                <div
                  className={`w-full ${colorClasses[color]} rounded-t opacity-70 group-hover:opacity-100 transition-opacity relative`}
                  style={{ height: `${height}%`, minHeight: point.value > 0 ? '2px' : '0' }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    <div className="font-medium">{valuePrefix}{point.value.toLocaleString()}{valueSuffix}</div>
                    <div className="text-muted-foreground">{formatDate(point.date)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* X-axis labels (show first, middle, last) */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{formatDateShort(data[0]?.date)}</span>
          <span>{formatDateShort(data[Math.floor(data.length / 2)]?.date)}</span>
          <span>{formatDateShort(data[data.length - 1]?.date)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateShort(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface BarChartHorizontalProps {
  title: string;
  description?: string;
  data: { label: string; value: number; sublabel?: string }[];
  loading?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

/**
 * Horizontal bar chart for ranking/comparison
 */
export function BarChartHorizontal({
  title,
  description,
  data,
  loading,
  valuePrefix = '',
  valueSuffix = '',
  color = 'blue',
}: BarChartHorizontalProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const colorClasses = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20',
  };

  const barColorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((item, index) => {
          const width = (item.value / maxValue) * 100;
          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium truncate flex-1 mr-2">{item.label}</span>
                <span className="text-muted-foreground whitespace-nowrap">
                  {valuePrefix}{item.value.toLocaleString()}{valueSuffix}
                </span>
              </div>
              <div className={`h-2 rounded-full ${colorClasses[color]}`}>
                <div
                  className={`h-full rounded-full ${barColorClasses[color]} transition-all duration-300`}
                  style={{ width: `${width}%` }}
                />
              </div>
              {item.sublabel && (
                <div className="text-xs text-muted-foreground">{item.sublabel}</div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
