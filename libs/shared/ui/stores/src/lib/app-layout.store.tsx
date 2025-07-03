import { create } from 'zustand';

type AppLayoutStore = {
  isOpenMobileMenu: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
};

export const useAppLayoutStore = create<AppLayoutStore>((set) => ({
  isOpenMobileMenu: false,
  toggleMobileMenu: () =>
    set((state) => ({ isOpenMobileMenu: !state.isOpenMobileMenu })),
  setMobileMenuOpen: (open) => set({ isOpenMobileMenu: open }),
}));
