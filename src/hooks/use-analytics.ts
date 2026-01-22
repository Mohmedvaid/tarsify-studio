import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type { AnalyticsOverview, NotebookAnalytics } from '@/types/api';
import {
  USE_MOCK_DATA,
  mockDelay,
  getMockAnalyticsOverview,
  getMockNotebookAnalytics,
  getMockAnalyticsTrends,
  getMockTopNotebooks,
  getMockRecentRuns,
  type AnalyticsTrends,
  type TopNotebook,
  type RecentRun,
} from '@/lib/mock';

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
      if (USE_MOCK_DATA) {
        await mockDelay();
        return getMockAnalyticsOverview();
      }
      // TODO: Replace with real API call when ready
      return api.get<AnalyticsOverview>(endpoints.analytics.overview);
    },
  });
}

// Fetch notebook-specific analytics
export function useNotebookAnalytics(id: string) {
  return useQuery({
    queryKey: analyticsKeys.notebook(id),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const data = getMockNotebookAnalytics(id);
        if (!data) throw new Error('Notebook not found');
        return data;
      }
      // TODO: Replace with real API call when ready
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
      if (USE_MOCK_DATA) {
        await mockDelay();
        return getMockAnalyticsTrends(days);
      }
      // TODO: Replace with real API call when ready
      return api.get<AnalyticsTrends>(`${endpoints.analytics.overview}/trends?days=${days}`);
    },
  });
}

// Fetch top notebooks by performance
export function useTopNotebooks(limit: number = 5) {
  return useQuery({
    queryKey: analyticsKeys.topNotebooks(limit),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        return getMockTopNotebooks(limit);
      }
      // TODO: Replace with real API call when ready
      return api.get<TopNotebook[]>(`${endpoints.analytics.overview}/top?limit=${limit}`);
    },
  });
}

// Fetch recent runs
export function useRecentRuns(limit: number = 10) {
  return useQuery({
    queryKey: analyticsKeys.recentRuns(limit),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        return getMockRecentRuns(limit);
      }
      // TODO: Replace with real API call when ready
      return api.get<RecentRun[]>(`${endpoints.analytics.overview}/runs?limit=${limit}`);
    },
  });
}

// Re-export types for convenience
export type { AnalyticsTrends, TopNotebook, RecentRun };
