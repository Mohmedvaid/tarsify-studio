import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type { Developer, UpdateProfileInput } from '@/types/api';
import { toast } from 'sonner';
import { USE_MOCK_DATA, mockDelay, getMockDeveloper } from '@/lib/mock';

// In-memory mock developer for mutations
let mockDeveloperState: Developer | null = null;

function getMockDeveloperWithState(): Developer {
  if (!mockDeveloperState) {
    mockDeveloperState = getMockDeveloper();
  }
  return mockDeveloperState;
}

// Query keys
export const developerKeys = {
  all: ['developer'] as const,
  profile: () => [...developerKeys.all, 'profile'] as const,
};

// Fetch developer profile
export function useDeveloperProfile() {
  return useQuery({
    queryKey: developerKeys.profile(),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        return getMockDeveloperWithState();
      }
      // TODO: Replace with real API call when ready
      return api.get<Developer>(endpoints.developers.me);
    },
  });
}

// Update developer profile
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileInput) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        // Update mock state
        const current = getMockDeveloperWithState();
        mockDeveloperState = {
          ...current,
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return mockDeveloperState;
      }
      // TODO: Replace with real API call when ready
      return api.put<Developer>(endpoints.developers.me, data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(developerKeys.profile(), data);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
    },
  });
}

// Update payout settings
export function useUpdatePayoutSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { payoutEmail: string }) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const current = getMockDeveloperWithState();
        mockDeveloperState = {
          ...current,
          payoutEmail: data.payoutEmail,
          updatedAt: new Date().toISOString(),
        };
        return mockDeveloperState;
      }
      // TODO: Replace with real API call when ready
      return api.put<Developer>(`${endpoints.developers.me}/payout`, data);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(developerKeys.profile(), data);
      toast.success('Payout settings updated!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update payout settings';
      toast.error(message);
    },
  });
}

// Delete account
export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        // Simulate account deletion
        return { success: true };
      }
      // TODO: Replace with real API call when ready
      return api.delete<{ success: boolean }>(endpoints.developers.me);
    },
    onSuccess: () => {
      toast.success('Account deleted. Redirecting...');
      // In real app, would sign out and redirect
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete account';
      toast.error(message);
    },
  });
}
