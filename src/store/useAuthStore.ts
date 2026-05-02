import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserTier = 'Free' | 'Premium';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: UserTier;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  upgradeToPremium: () => void;
}

/**
 * useAuthStore
 * Manages user identity, authentication status, and monetization tier.
 * Persisted in localStorage for cross-session state retention.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: 'user_01',
        name: 'Sarvadnya',
        email: 'sarvadnya@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarvadnya',
        tier: 'Free'
      },
      isAuthenticated: true,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      upgradeToPremium: () => set((state) => ({
        user: state.user ? { ...state.user, tier: 'Premium' } : null
      }))
    }),
    {
      name: 'auth-storage'
    }
  )
);
