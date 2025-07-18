import { create } from "zustand";
import axios from "../lib/axios";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,

  placeOrder: async (orderData) => {
    try {
      set({ loading: true, error: null });

      const response = await axios.post("/orders", orderData);
      console.log(response.data);
      return response.data; // optionally return to show success in component
    } catch (error) {
      console.error("Failed to place order:", error);
      set({ error: error.response?.data?.message || "Error placing order" });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Fetch all orders
  fetchAllOrders: async () => {
    try {
      set({ loading: true, error: null });

      const response = await axios.get("/orders/allorders");
      console.log(response.data);
      set({ orders: response.data });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      set({ error: error.response?.data?.message || "Error fetching orders" });
    } finally {
      set({ loading: false });
    }
  },
}));
