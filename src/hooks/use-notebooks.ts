import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type {
  Notebook,
  CreateNotebookInput,
  UpdateNotebookInput,
  PaginatedResponse,
} from '@/types/api';
import { toast } from 'sonner';

// Query keys
export const notebookKeys = {
  all: ['notebooks'] as const,
  lists: () => [...notebookKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...notebookKeys.lists(), filters] as const,
  details: () => [...notebookKeys.all, 'detail'] as const,
  detail: (id: string) => [...notebookKeys.details(), id] as const,
};

// Fetch notebooks list
export function useNotebooks(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: notebookKeys.list(params || {}),
    queryFn: () =>
      api.get<PaginatedResponse<Notebook>>(endpoints.notebooks.list, {
        params: {
          page: params?.page,
          limit: params?.limit,
          status: params?.status,
        },
      }),
  });
}

// Fetch single notebook
export function useNotebook(id: string) {
  return useQuery({
    queryKey: notebookKeys.detail(id),
    queryFn: () => api.get<Notebook>(endpoints.notebooks.get(id)),
    enabled: !!id,
  });
}

// Create notebook
export function useCreateNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNotebookInput) =>
      api.post<Notebook>(endpoints.notebooks.create, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      toast.success('Notebook created successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to create notebook';
      toast.error(message);
    },
  });
}

// Update notebook
export function useUpdateNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotebookInput }) =>
      api.put<Notebook>(endpoints.notebooks.update(id), data),
    onSuccess: (updatedNotebook) => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.setQueryData(notebookKeys.detail(updatedNotebook.id), updatedNotebook);
      toast.success('Notebook updated successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update notebook';
      toast.error(message);
    },
  });
}

// Delete notebook
export function useDeleteNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(endpoints.notebooks.delete(id)),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.removeQueries({ queryKey: notebookKeys.detail(deletedId) });
      toast.success('Notebook deleted successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete notebook';
      toast.error(message);
    },
  });
}

// Upload notebook file
export function useUploadNotebookFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      api.upload<Notebook>(endpoints.notebooks.file(id), file),
    onSuccess: (updatedNotebook) => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.setQueryData(notebookKeys.detail(updatedNotebook.id), updatedNotebook);
      toast.success('File uploaded successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to upload file';
      toast.error(message);
    },
  });
}

// Delete notebook file
export function useDeleteNotebookFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete<Notebook>(endpoints.notebooks.file(id)),
    onSuccess: (updatedNotebook) => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.setQueryData(notebookKeys.detail(updatedNotebook.id), updatedNotebook);
      toast.success('File deleted successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete file';
      toast.error(message);
    },
  });
}

// Publish notebook
export function usePublishNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post<Notebook>(endpoints.notebooks.publish(id)),
    onSuccess: (updatedNotebook) => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.setQueryData(notebookKeys.detail(updatedNotebook.id), updatedNotebook);
      toast.success('Notebook published successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to publish notebook';
      toast.error(message);
    },
  });
}

// Unpublish notebook
export function useUnpublishNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post<Notebook>(endpoints.notebooks.unpublish(id)),
    onSuccess: (updatedNotebook) => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      queryClient.setQueryData(notebookKeys.detail(updatedNotebook.id), updatedNotebook);
      toast.success('Notebook unpublished');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to unpublish notebook';
      toast.error(message);
    },
  });
}
