import { useQuery } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type { AnalyticsOverview, NotebookAnalytics } from '@/types/api';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: () => [...analyticsKeys.all, 'overview'] as const,
  notebook: (id: string) => [...analyticsKeys.all, 'notebook', id] as const,
};

// Fetch analytics overview
export function useAnalyticsOverview() {
  return useQuery({
    queryKey: analyticsKeys.overview(),
    queryFn: () => api.get<AnalyticsOverview>(endpoints.analytics.overview),
  });
}

// Fetch notebook-specific analytics
export function useNotebookAnalytics(id: string) {
  return useQuery({
    queryKey: analyticsKeys.notebook(id),
    queryFn: () => api.get<NotebookAnalytics>(endpoints.analytics.notebook(id)),
    enabled: !!id,
  });
}
