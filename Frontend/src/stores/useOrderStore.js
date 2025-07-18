import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
  orders: [],
  myOrders: [],
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
      const errorMessage = error.response?.data?.message || "Error placing order";
      set({ error: errorMessage });
      throw error; // Re-throw so component can handle it
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
      const errorMessage =
        error.response?.data?.message || "Error fetching orders";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },

  // New action to update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(`/orders/${orderId}/status`, { status });
      // Update the specific order in the local state array for an instant UI update
      set((state) => ({
        orders: state.orders.map((order) =>
          order._id === orderId ? response.data : order
        ),
      }));
      toast.success("Order status updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update status.");
    }
  },

  // New action to fetch orders for the logged-in user
  fetchMyOrders: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get("/orders/my-orders");
      set({ myOrders: response.data, loading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error fetching your orders";
      set({ error: errorMessage, loading: false });
      toast.error(errorMessage);
    }
  },
}));
