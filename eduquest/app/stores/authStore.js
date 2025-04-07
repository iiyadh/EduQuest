import { create } from "zustand"


const useAuthStore = create((set) => ({
    user: {},
    login: () => set((state) => ({ bears: state.bears + 1 })),
    logout: () => set((state) => ({ bears: state.bears - 1 })),
}));