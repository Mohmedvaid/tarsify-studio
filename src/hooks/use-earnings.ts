import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type { EarningsSummary, EarningsBreakdown, Payout } from '@/types/api';
import { toast } from 'sonner';

// Query keys
export const earningsKeys = {
  all: ['earnings'] as const,
  summary: () => [...earningsKeys.all, 'summary'] as const,
  breakdown: () => [...earningsKeys.all, 'breakdown'] as const,
  payouts: () => [...earningsKeys.all, 'payouts'] as const,
};

// Fetch earnings summary
export function useEarningsSummary() {
  return useQuery({
    queryKey: earningsKeys.summary(),
    queryFn: async () => {
      return api.get<EarningsSummary>(endpoints.earnings.summary);
    },
  });
}

// Fetch earnings breakdown by notebook
export function useEarningsBreakdown() {
  return useQuery({
    queryKey: earningsKeys.breakdown(),
    queryFn: async () => {
      return api.get<EarningsBreakdown[]>(`${endpoints.earnings.summary}/breakdown`);
    },
  });
}

// Fetch payout history
export function usePayouts() {
  return useQuery({
    queryKey: earningsKeys.payouts(),
    queryFn: async () => {
      return api.get<Payout[]>(endpoints.earnings.payouts.list);
    },
  });
}

// Request payout
export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.post<Payout>(endpoints.earnings.payouts.request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: earningsKeys.summary() });
      queryClient.invalidateQueries({ queryKey: earningsKeys.payouts() });
      toast.success('Payout requested successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to request payout';
      toast.error(message);
    },
  });
}
