import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    error: null,
    loading: false,

    login: async (credentials) => {
        set({ loading: true, error: null });

        try {
            const response = await fetch("http://127.0.0.1:8000/student/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                set({ error: data.message || "Login failed", loading: false });
                return false;
            }

            const { user, token } = data;

            localStorage.setItem("token", token);
            set({
                user: { id: user },
                token,
                isAuthenticated: true,
                loading: false,
                error: null,
            });

            return data;
        } catch (error) {
            set({
                error: error.message || "Login request failed",
                loading: false,
                isAuthenticated: false,
            });
            return false;
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            set({ isAuthenticated: false, user: null });
            return false;
        }

        set({ loading: true });

        try {
            const response = await fetch(`http://127.0.0.1:8000/student/check/${token}`, {
                method: "GET",
            });

            const data = await response.json();

            console.log(data);
            if (!response.ok) {
                throw new Error(data.message || "Authentication failed");
            }

            set({
                isAuthenticated: true,
                user: { id: data.user },
                token,
                loading: false,
                error: null,
            });

            return true;
        } catch (error) {
            localStorage.removeItem("token");

            set({
                isAuthenticated: false,
                user: null,
                token: null,
                loading: false,
                error: error.message || "Auth check failed",
            });

            return false;
        }
    },

    logout: async () => {
        try {
            await fetch("http://127.0.0.1:8000/student/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                },
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            });
        }
    },
}));

export default useAuthStore;
