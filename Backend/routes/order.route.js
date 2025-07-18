import express from "express";

import {
  protectRoute,
  adminRoute,
} from "../middleware/auth.middleware.js";
import {
  fetchAllOrders,
  placeOrder,
  updateOrderStatus,
  getMyOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protectRoute, placeOrder);
router.get("/allorders", protectRoute, adminRoute, fetchAllOrders);
router.get("/my-orders", protectRoute, getMyOrders);

// New route for updating order status
router.patch("/:orderId/status", protectRoute, adminRoute, updateOrderStatus);

export default router;
