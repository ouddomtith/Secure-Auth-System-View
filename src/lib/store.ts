import { create } from "zustand";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  pendingEmail: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setPendingEmail: (email: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: Cookies.get("token") || null,
  isLoading: false,
  pendingEmail: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      Cookies.set("token", token, { expires: 7, secure: true, sameSite: "strict" });
    } else {
      Cookies.remove("token");
    }
    set({ token });
  },
  setPendingEmail: (email) => set({ pendingEmail: email }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => {
    Cookies.remove("token");
    set({ user: null, token: null });
    if (typeof window !== "undefined") window.location.href = "/login";
  },
}));
