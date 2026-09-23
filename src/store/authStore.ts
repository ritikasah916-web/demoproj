import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const mockUsers: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'demo123',
    createdAt: new Date().toISOString(),
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (user) {
          const { password: _, ...userData } = user;
          set({ user: userData, isAuthenticated: true, isLoading: false });
          return true;
        }

        // Auto-create user for demo
        if (email && password.length >= 4) {
          const newUser: User = {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email,
            createdAt: new Date().toISOString(),
          };
          mockUsers.push({ ...newUser, password });
          set({ user: newUser, isAuthenticated: true, isLoading: false });
          return true;
        }

        set({ isLoading: false });
        return false;
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const exists = mockUsers.find((u) => u.email === email);
        if (exists) {
          set({ isLoading: false });
          return false;
        }

        const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          createdAt: new Date().toISOString(),
        };
        mockUsers.push({ ...newUser, password });
        set({ user: newUser, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
