import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getCoupon,
  validateCoupon,
  createCoupon,
  deleteCoupon,
  updateCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getCoupon);
router.post("/", protectRoute, adminRoute, createCoupon);
router.post("/validate", protectRoute, validateCoupon);
router.put("/:id", protectRoute, adminRoute, updateCoupon);
router.delete("/:id", protectRoute, adminRoute, deleteCoupon);

export default router;