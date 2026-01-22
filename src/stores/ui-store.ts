import { create } from 'zustand';

interface UIState {
  // Sidebar state
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  // Modal states
  isCreateNotebookModalOpen: boolean;
  isDeleteConfirmModalOpen: boolean;
  deleteConfirmNotebookId: string | null;
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  openCreateNotebookModal: () => void;
  closeCreateNotebookModal: () => void;
  openDeleteConfirmModal: (notebookId: string) => void;
  closeDeleteConfirmModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  sidebarOpen: true,
  sidebarCollapsed: false,
  isCreateNotebookModalOpen: false,
  isDeleteConfirmModalOpen: false,
  deleteConfirmNotebookId: null,

  // Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  openCreateNotebookModal: () => set({ isCreateNotebookModalOpen: true }),
  
  closeCreateNotebookModal: () => set({ isCreateNotebookModalOpen: false }),
  
  openDeleteConfirmModal: (notebookId) =>
    set({ isDeleteConfirmModalOpen: true, deleteConfirmNotebookId: notebookId }),
  
  closeDeleteConfirmModal: () =>
    set({ isDeleteConfirmModalOpen: false, deleteConfirmNotebookId: null }),
}));
