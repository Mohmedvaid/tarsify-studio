import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type { Developer, UpdateProfileInput, CompleteProfileInput } from '@/types/api';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';

// Query keys
export const developerKeys = {
  all: ['developer'] as const,
  profile: () => [...developerKeys.all, 'profile'] as const,
};

// Fetch developer profile
export function useDeveloperProfile() {
  const { developer } = useAuthStore();
  
  return useQuery({
    queryKey: developerKeys.profile(),
    queryFn: () => api.get<Developer>(endpoints.developers.me),
    // Use developer from auth store as initial data if available
    initialData: developer || undefined,
    // Only fetch if we have a user logged in
    enabled: !!developer,
  });
}

// Update developer profile (partial update)
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setDeveloper } = useAuthStore();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => 
      api.put<Developer>(endpoints.developers.update, data),
    onSuccess: (data) => {
      queryClient.setQueryData(developerKeys.profile(), data);
      setDeveloper(data); // Also update auth store
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(message);
    },
  });
}

// Complete profile (for new users)
export function useCompleteProfile() {
  const queryClient = useQueryClient();
  const { setDeveloper } = useAuthStore();

  return useMutation({
    mutationFn: (data: CompleteProfileInput) => 
      api.post<Developer>(endpoints.developers.completeProfile, data),
    onSuccess: (data) => {
      queryClient.setQueryData(developerKeys.profile(), data);
      setDeveloper(data);
      toast.success('Profile completed!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to complete profile';
      toast.error(message);
    },
  });
}
