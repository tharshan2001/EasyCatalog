// src/store/authStore.js
import { create } from "zustand";
import api from "./api.js"; // use the centralized axios instance

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // login action
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/auth/login", { username, password });
      // fetch logged-in user info after login
      await useAuthStore.getState().fetchMe();
      set({ loading: false });
      return res.data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      throw err;
    }
  },

  // logout action
  logout: async () => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/logout");
      set({ user: null, loading: false });
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "Logout failed",
      });
    }
  },

  // fetch authenticated user
  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data, loading: false });
    } catch (err) {
      set({ user: null, loading: false });
    }
  },
}));

export default useAuthStore;