import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@shared/types';

// Note: In a real app, you'd need to install zustand persist middleware
// For now, using localStorage directly

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // Load from localStorage on init
  const stored = localStorage.getItem('auth-storage');
  const initialState = stored ? JSON.parse(stored) : { user: null, token: null, isAuthenticated: false };

  return {
    ...initialState,
    setAuth: (user, token) => {
      localStorage.setItem('token', token);
      const state = { user, token, isAuthenticated: true };
      localStorage.setItem('auth-storage', JSON.stringify(state));
      set(state);
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      set({ user: null, token: null, isAuthenticated: false });
    },
    hasRole: (role) => {
      const { user } = get();
      return user?.roles.includes(role) || false;
    },
  };
});

