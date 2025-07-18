import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useCartStore } from "./useCartStore";

export const useUserStore = create((set, get) => ({
  user: null,
  loading: false,
  checkingAuth: true,

  signup: async ({ name, email, phone, password }) => {
    set({ loading: true });

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
        phone,
      });
      set({ user: res.data.user, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  login: async ({ email, password }, navigate) => {
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("auth-sync", Date.now());
      const user = res.data.user;
      set({ user: user });
      // Fetch the user's cart from the database upon successful login
      useCartStore.getState().getCart();

      toast.success("Login successful!");

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      set({ loading: false });
      // More robust error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx (e.g., 400, 401, 404)
        toast.error(error.response.data.message || "Invalid credentials.");
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        toast.error("Network error. Please check your connection or if the server is running.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error(error.message || "An unexpected error occurred.");
      }
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.setItem("auth-sync", Date.now());
      set({ user: null });
      // Clear the cart from the state upon logout
      useCartStore.getState().clearLocalCart();
    } catch (error) {
      toast.error(
        error.response.data.message || "An error occurred during logout"
      );
    }
  },

  checkAuth: async () => {
    try {
      const response = await axios.get("/auth/profile");
      if (response.data) {
        // If user is authenticated, fetch their cart
        useCartStore.getState().getCart();
      }
      set({ user: response.data, checkingAuth: false });
    } catch {
      set({ checkingAuth: false, user: null });
      // toast.error(error.response.data.message || "An error occurred");
    }
  },
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (get().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
      return response.data;
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true });
    try {
      const response = await axios.put("/auth/profile", profileData);
      set({ user: response.data, loading: false });
      toast.success("Profile updated successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Failed to update profile."
      );
      throw error; // Re-throw so component can handle it
    }
  },

  changePassword: async (passwordData) => {
    set({ loading: true });
    try {
      const response = await axios.put("/auth/change-password", passwordData);
      toast.success(response.data.message);
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(
        error.response?.data?.message || "Failed to change password."
      );
      throw error; // Re-throw so component can handle it
    }
  },
}));
//TODO: Implement the axios interceptors for refreshing access token every 15mins

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If a refresh is already in progress, wait for it to complete
        if (refreshPromise) {
          await refreshPromise;
          return axios(originalRequest);
        }

        // Start a new refresh process
        refreshPromise = useUserStore.getState().refreshToken();
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle as needed
        useUserStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
