import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarOpen: boolean;
  modalOpen: boolean;
  modalType: string | null;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  openModal: (type: string) => void;
  closeModal: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      modalOpen: false,
      modalType: null,
      theme: 'system',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openModal: (type) => set({ modalOpen: true, modalType: type }),
      closeModal: () => set({ modalOpen: false, modalType: null }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
