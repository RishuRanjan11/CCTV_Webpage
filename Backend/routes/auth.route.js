import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  getProfile,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
  validateResetToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/profile", protectRoute, getProfile);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.get("/validate-reset-token/:token", validateResetToken);
router.post("/reset-password/:token", resetPassword);

export default router;
