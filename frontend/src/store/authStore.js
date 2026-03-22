import { create } from "zustand";
import api from "./api.js"; // your centralized axios instance

const useAuthStore = create((set) => ({
  user: null,
  loading: false, // start false
  error: null,

  // login action
  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      await api.post("/auth/login", { username, password });
      const res = await api.get("/auth/me");
      set({ user: res.data, loading: false });
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

  // fetch authenticated user (used on page load / refresh)
  fetchMe: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/auth/me"); // sends cookies automatically
      set({ user: res.data, loading: false });
    } catch (err) {
      // even if API fails, loading must become false
      set({ user: null, loading: false });
    }
  },
}));

export default useAuthStore;