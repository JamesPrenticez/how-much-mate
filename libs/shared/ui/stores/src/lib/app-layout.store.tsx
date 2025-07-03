import { create } from 'zustand';

type AppLayoutStore = {
  isOpenMobileMenu: boolean;
  toggleMobileMenu: () => void;
  setIsOpenMobileMenu: (open: boolean) => void;
};

export const useAppLayoutStore = create<AppLayoutStore>((set) => ({
  isOpenMobileMenu: false,
  toggleMobileMenu: () =>
    set((state) => ({ isOpenMobileMenu: !state.isOpenMobileMenu })),
  setIsOpenMobileMenu: (open) => set({ isOpenMobileMenu: open }),
}));
