import { create } from "zustand";

const useAuthStore = create((set,get) => ({
    user: null,
    loading : false,

    login: (userData) =>{ 
        set({ user: userData})
        localStorage.setItem("user", JSON.stringify(userData));
    },

    logout: () => {
        set({ user: null })
        localStorage.removeItem("user");
    },

    register: (userData) => { 
        set({ user: userData })
        localStorage.setItem("user", JSON.stringify(userData));
    },


    checkAuth: () => {
        const user = get().user;
        if (!user) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                set({ user: JSON.parse(storedUser) });
            } else {
                return false;
            }
        }
        return true;
    }
}));

export default useAuthStore;

