'use client';

import { useEffect, ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, mapFirebaseUser } from '@/lib/firebase';
import { useAuthStore } from '@/stores/auth-store';
import { api, endpoints } from '@/lib/api';
import type { Developer } from '@/types/api';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setDeveloper, setLoading, setInitialized, reset } = useAuthStore();

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);

      if (firebaseUser) {
        // Map Firebase user to our AuthUser type
        const user = mapFirebaseUser(firebaseUser);
        setUser(user);

        // Fetch developer profile from API
        try {
          const developer = await api.get<Developer>(endpoints.auth.me);
          setDeveloper(developer);
        } catch {
          // Developer profile might not exist yet (new user)
          console.log('Developer profile not found, user may need to register');
          setDeveloper(null);
        }
      } else {
        // User is signed out
        reset();
      }

      setLoading(false);
      setInitialized(true);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [setUser, setDeveloper, setLoading, setInitialized, reset]);

  return <>{children}</>;
}
