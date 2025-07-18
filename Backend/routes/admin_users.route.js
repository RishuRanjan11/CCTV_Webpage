import express from "express";
import {
  getCustomersWithFirstTimeBuyerStatus,
  deleteUser,
} from "../controllers/admin_users.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/customers", protectRoute, adminRoute, getCustomersWithFirstTimeBuyerStatus); // Ensure this line exists
router.delete("/users/:id", protectRoute, adminRoute, deleteUser);



export default router;
