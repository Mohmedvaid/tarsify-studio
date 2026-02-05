import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type {
  AnalyticsOverview,
  NotebookAnalytics,
  AnalyticsTrends,
  TopNotebook,
  RecentRun,
} from '@/types/api';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
  notebook: (id: string) => [...analyticsKeys.all, 'notebook', id] as const,
  trends: (days: number) => [...analyticsKeys.all, 'trends', days] as const,
  topNotebooks: (limit: number) => [...analyticsKeys.all, 'top', limit] as const,
  recentRuns: (limit: number) => [...analyticsKeys.all, 'runs', limit] as const,
};

// Fetch analytics overview
export function useAnalyticsOverview() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: async () => {
      return api.get<AnalyticsOverview>(endpoints.analytics.overview);
    },
  });
}

// Fetch notebook-specific analytics
export function useNotebookAnalytics(id: string) {
  return useQuery({
    queryKey: analyticsKeys.notebook(id),
    queryFn: async () => {
      return api.get<NotebookAnalytics>(endpoints.analytics.notebook(id));
    },
    enabled: !!id,
  });
}

// Fetch analytics trends (time series data)
export function useAnalyticsTrends(days: number = 30) {
  return useQuery({
    queryKey: analyticsKeys.trends(days),
    queryFn: async () => {
      return api.get<AnalyticsTrends>(`${endpoints.analytics.overview}/trends`, {
        params: { days },
      });
    },
  });
}

// Fetch top notebooks by performance
export function useTopNotebooks(limit: number = 5) {
  return useQuery({
    queryKey: analyticsKeys.topNotebooks(limit),
    queryFn: async () => {
      return api.get<TopNotebook[]>(`${endpoints.analytics.overview}/top`, {
        params: { limit },
      });
    },
  });
}

// Fetch recent runs
export function useRecentRuns(limit: number = 10) {
  return useQuery({
    queryKey: analyticsKeys.recentRuns(limit),
    queryFn: async () => {
      return api.get<RecentRun[]>(`${endpoints.analytics.overview}/runs`, {
        params: { limit },
      });
    },
  });
}
