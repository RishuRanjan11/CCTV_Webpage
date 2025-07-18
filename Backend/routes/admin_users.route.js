import express from "express";
import {
  getCustomersWithFirstTimeBuyerStatus,
  deleteUser,
  getDashboardStats,
} from "../controllers/admin_users.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/customers", protectRoute, adminRoute, getCustomersWithFirstTimeBuyerStatus); // Ensure this line exists
router.delete("/users/:id", protectRoute, adminRoute, deleteUser);
router.get("/dashboard", protectRoute, adminRoute, getDashboardStats);



export default router;
