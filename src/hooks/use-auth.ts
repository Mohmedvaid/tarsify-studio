import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  signOut,
  resetPassword,
} from '@/lib/firebase';
import { api, endpoints } from '@/lib/api';
import type { Developer, RegisterDeveloperInput } from '@/types/api';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const { user, developer, isLoading, isInitialized, setDeveloper } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password);
      router.push('/dashboard');
      toast.success('Welcome back!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      toast.error(message);
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const credential = await signInWithGoogle();
      const user = credential.user;

      // Check if developer profile exists, if not register
      try {
        const existingDeveloper = await api.get<Developer>(endpoints.auth.me);
        setDeveloper(existingDeveloper);
      } catch {
        // Register new developer
        const input: RegisterDeveloperInput = {
          email: user.email || '',
          displayName: user.displayName || undefined,
        };
        const newDeveloper = await api.post<Developer>(endpoints.auth.register, input);
        setDeveloper(newDeveloper);
      }

      router.push('/dashboard');
      toast.success('Welcome!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign in with Google';
      toast.error(message);
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      // Create Firebase account
      await signUpWithEmail(email, password, displayName);

      // Register developer in API
      const input: RegisterDeveloperInput = {
        email,
        displayName,
      };
      const developer = await api.post<Developer>(endpoints.auth.register, input);
      setDeveloper(developer);

      router.push('/dashboard');
      toast.success('Account created successfully!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      router.push('/login');
      toast.success('Signed out successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(message);
      throw error;
    }
  };

  const sendPasswordReset = async (email: string) => {
    try {
      await resetPassword(email);
      toast.success('Password reset email sent!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      toast.error(message);
      throw error;
    }
  };

  return {
    user,
    developer,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    hasDeveloperProfile: !!developer,
    login,
    loginWithGoogle,
    register,
    logout,
    sendPasswordReset,
  };
}
