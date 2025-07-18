import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,
  error: null,

  // Action to fetch the entire cart from the backend
  getCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get("/cart");
      set({ cartItems: res.data, loading: false });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      set({
        error: "Failed to fetch cart.",
        loading: false,
      });
      toast.error("Could not load your cart.");
    }
  },

  // Action to add an item to the cart
  addToCart: async (product) => {
    set({ loading: true });
    try {
      // The backend will handle checking if the item exists and update quantity
      const res = await axios.post("/cart", {
        productId: product._id,
        quantity: 1,
      });
      set({ cartItems: res.data, loading: false });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      set({ loading: false });
      const message =
        error.response?.data?.message || "Failed to add item to cart.";
      toast.error(message);
      throw error; // Re-throw the error so the caller knows it failed
    }
  },

  // Action to remove an item from the cart
  removeFromCart: async (productId) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/cart/${productId}`);
      set({ cartItems: res.data, loading: false });
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      set({ loading: false });
      toast.error("Failed to remove item.");
    }
  },

  // Action to update the quantity of an item
  updateQuantity: async (productId, quantity) => {
    if (quantity < 1) {
      // If quantity is less than 1, remove the item instead
      get().removeFromCart(productId);
      return;
    }

    // Optimistic update: update UI immediately
    const originalCart = get().cartItems;
    const updatedCart = originalCart.map((item) =>
      item.product._id === productId ? { ...item, quantity } : item
    );
    set({ cartItems: updatedCart });

    try {
      const res = await axios.put(`/cart/${productId}`, { quantity });
      // Sync with server response
      set({ cartItems: res.data });
    } catch (error) {
      console.error("Failed to update quantity:", error);
      // Revert on error
      set({ cartItems: originalCart });
      toast.error("Failed to update quantity.");
    }
  },

  // Action to clear the entire cart
  clearCart: async () => {
    set({ loading: true });
    try {
      const res = await axios.delete("/cart");
      set({ cartItems: res.data, loading: false });
      toast.success("Cart cleared.");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      set({ loading: false });
      toast.error("Failed to clear cart.");
    }
  },

  // Local-only action to clear cart state (e.g., on logout)
  clearLocalCart: () => {
    set({ cartItems: [], loading: false, error: null });
  },
}));
