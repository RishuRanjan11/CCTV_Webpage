import express from "express";
import {
  getCustomersWithFirstTimeBuyerStatus,
} from "../controllers/admin.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/customers", protectRoute, adminRoute, getCustomersWithFirstTimeBuyerStatus); // Ensure this line exists




export default router;
