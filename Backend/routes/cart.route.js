import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, clearCart); // For clearing the whole cart
router.put("/:productId", protectRoute, updateQuantity); // For updating a single item
router.delete("/:productId", protectRoute, removeFromCart); // For removing a single item

export default router;
