import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, endpoints } from '@/lib/api';
import type {
  Notebook,
  CreateNotebookInput,
  PaginatedResponse,
} from '@/types/api';
import { toast } from 'sonner';
import {
  USE_MOCK_DATA,
  mockDelay,
  getMockNotebooks,
  getMockNotebook,
  mockNotebooks,
} from '@/lib/mock';

// In-memory mock notebooks for mutations
let mockNotebooksState: Notebook[] = [...mockNotebooks];

function generateId(): string {
  return `nb_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

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
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        return getMockNotebooks({
          page: params?.page,
          limit: params?.limit,
          status: params?.status as 'draft' | 'published' | 'archived' | undefined,
        });
      }
      return api.get<PaginatedResponse<Notebook>>(endpoints.notebooks.list, {
        params: {
          page: params?.page,
          limit: params?.limit,
          status: params?.status,
        },
      });
    },
  });
}

// Fetch single notebook
export function useNotebook(id: string) {
  return useQuery({
    queryKey: notebookKeys.detail(id),
    queryFn: async () => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const notebook = mockNotebooksState.find((n) => n.id === id) || getMockNotebook(id);
        if (!notebook) {
          throw new Error('Notebook not found');
        }
        return notebook;
      }
      return api.get<Notebook>(endpoints.notebooks.get(id));
    },
    enabled: !!id,
  });
}

// Create notebook
export function useCreateNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNotebookInput) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const newNotebook: Notebook = {
          id: generateId(),
          developerId: 'dev_001',
          title: data.title,
          description: data.description ?? null,
          shortDescription: data.shortDescription ?? null,
          thumbnailUrl: null,
          priceCredits: data.priceCredits,
          gpuType: data.gpuType,
          category: data.category ?? 'other',
          status: 'draft',
          totalRuns: 0,
          averageRating: null,
          notebookFileUrl: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockNotebooksState = [newNotebook, ...mockNotebooksState];
        return newNotebook;
      }
      return api.post<Notebook>(endpoints.notebooks.create, data);
    },
    onSuccess: (newNotebook) => {
      queryClient.invalidateQueries({ queryKey: notebookKeys.lists() });
      toast.success('Notebook created successfully!');
      return newNotebook;
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to create notebook';
      toast.error(message);
    },
  });
}

// NOTE: Backend does not have an update endpoint. To modify a notebook:
// 1. Delete the existing one
// 2. Create a new one with updated data
// Or wait for backend to implement PATCH /api/studio/notebooks/:id

// Delete notebook
export function useDeleteNotebook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        mockNotebooksState = mockNotebooksState.filter((n) => n.id !== id);
        return;
      }
      return api.delete(endpoints.notebooks.delete(id));
    },
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
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const index = mockNotebooksState.findIndex((n) => n.id === id);
        if (index === -1) {
          throw new Error('Notebook not found');
        }
        // Validate file is .ipynb
        if (!file.name.endsWith('.ipynb')) {
          throw new Error('Only .ipynb files are allowed');
        }
        const current = mockNotebooksState[index]!;
        const updated: Notebook = {
          ...current,
          notebookFileUrl: `uploads/notebooks/${id}.ipynb`,
          updatedAt: new Date().toISOString(),
        };
        mockNotebooksState[index] = updated;
        return updated;
      }
      return api.upload<Notebook>(endpoints.notebooks.file(id), file);
    },
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
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const index = mockNotebooksState.findIndex((n) => n.id === id);
        if (index === -1) {
          throw new Error('Notebook not found');
        }
        const current = mockNotebooksState[index]!;
        const updated: Notebook = {
          ...current,
          notebookFileUrl: null,
          updatedAt: new Date().toISOString(),
        };
        mockNotebooksState[index] = updated;
        return updated;
      }
      return api.delete<Notebook>(endpoints.notebooks.file(id));
    },
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
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const index = mockNotebooksState.findIndex((n) => n.id === id);
        if (index === -1) {
          throw new Error('Notebook not found');
        }
        const notebook = mockNotebooksState[index]!;
        if (!notebook.notebookFileUrl) {
          throw new Error('Cannot publish notebook without a file');
        }
        const updated: Notebook = {
          ...notebook,
          status: 'published',
          updatedAt: new Date().toISOString(),
        };
        mockNotebooksState[index] = updated;
        return updated;
      }
      return api.post<Notebook>(endpoints.notebooks.publish(id));
    },
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
    mutationFn: async (id: string) => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const index = mockNotebooksState.findIndex((n) => n.id === id);
        if (index === -1) {
          throw new Error('Notebook not found');
        }
        const current = mockNotebooksState[index]!;
        const updated: Notebook = {
          ...current,
          status: 'draft',
          updatedAt: new Date().toISOString(),
        };
        mockNotebooksState[index] = updated;
        return updated;
      }
      return api.post<Notebook>(endpoints.notebooks.unpublish(id));
    },
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
