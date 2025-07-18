import express from "express";

import { protectRoute } from "../middleware/auth.middleware.js";
import { fetchAllOrders, placeOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", placeOrder);
router.get("/allorders", fetchAllOrders);

export default router;
