'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { endpoints } from '@/lib/api/endpoints';
import type {
  BaseModel,
  TarsModel,
  TarsModelStatus,
  CreateTarsModelInput,
  UpdateTarsModelInput,
  PublishTarsModelInput,
  PaginatedResponse,
} from '@/types/api';

// Query keys
export const tarsModelKeys = {
  all: ['tarsModels'] as const,
  lists: () => [...tarsModelKeys.all, 'list'] as const,
  list: (filters: { page?: number; limit?: number; status?: TarsModelStatus }) =>
    [...tarsModelKeys.lists(), filters] as const,
  details: () => [...tarsModelKeys.all, 'detail'] as const,
  detail: (id: string) => [...tarsModelKeys.details(), id] as const,
  baseModels: ['baseModels'] as const,
};

// ============================================
// Base Models
// ============================================

export function useBaseModels() {
  return useQuery({
    queryKey: tarsModelKeys.baseModels,
    queryFn: async () => {
      const response = await api.get<{ baseModels: BaseModel[] }>(
        endpoints.tarsModels.baseModels
      );
      return response.baseModels;
    },
  });
}

// ============================================
// Tars Models List
// ============================================

interface UseTarsModelsOptions {
  page?: number;
  limit?: number;
  status?: TarsModelStatus;
}

export function useTarsModels(options: UseTarsModelsOptions = {}) {
  const { page = 1, limit = 20, status } = options;

  return useQuery({
    queryKey: tarsModelKeys.list({ page, limit, status }),
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (status) params.set('status', status);

      const response = await api.get<PaginatedResponse<TarsModel> | Record<string, never>>(
        `${endpoints.tarsModels.list}?${params.toString()}`
      );
      // Backend may return {} when no models exist, or { data: [...], pagination: {...} }
      if (!response || !('data' in response) || !Array.isArray(response.data)) {
        return [];
      }
      return response.data;
    },
  });
}

// ============================================
// Single Tars Model
// ============================================

export function useTarsModel(id: string) {
  return useQuery({
    queryKey: tarsModelKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TarsModel>(endpoints.tarsModels.get(id));
      return response;
    },
    enabled: !!id,
  });
}

// ============================================
// Create Tars Model
// ============================================

export function useCreateTarsModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateTarsModelInput) => {
      const response = await api.post<TarsModel>(endpoints.tarsModels.create, input);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tarsModelKeys.lists() });
    },
  });
}

// ============================================
// Update Tars Model
// ============================================

export function useUpdateTarsModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTarsModelInput }) => {
      const response = await api.put<TarsModel>(endpoints.tarsModels.update(id), data);
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tarsModelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tarsModelKeys.lists() });
    },
  });
}

// ============================================
// Delete Tars Model
// ============================================

export function useDeleteTarsModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(endpoints.tarsModels.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tarsModelKeys.lists() });
    },
  });
}

// ============================================
// Publish / Archive Tars Model
// ============================================

export function usePublishTarsModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, action }: { id: string; action: PublishTarsModelInput['action'] }) => {
      const response = await api.post<TarsModel>(endpoints.tarsModels.publish(id), {
        action,
      });
      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: tarsModelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: tarsModelKeys.lists() });
    },
  });
}
