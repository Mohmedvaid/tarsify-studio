import { create } from 'zustand';
import type { Developer } from '@/types/api';
import type { AuthUser } from '@/lib/firebase/auth';

interface AuthState {
  // Firebase user state
  user: AuthUser | null;
  // Developer profile from API
  developer: Developer | null;
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  // Actions
  setUser: (user: AuthUser | null) => void;
  setDeveloper: (developer: Developer | null) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  reset: () => void;
}

const initialState = {
  user: null,
  developer: null,
  isLoading: true,
  isInitialized: false,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setUser: (user) => set({ user }),
  
  setDeveloper: (developer) => set({ developer }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setInitialized: (isInitialized) => set({ isInitialized }),
  
  reset: () => set(initialState),
}));
