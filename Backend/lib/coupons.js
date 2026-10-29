import Coupon from "../models/coupon.model.js";

export const validateCouponForUser = async (code, user) => {
  if (typeof code !== "string" || !code.trim()) {
    return { status: 400, message: "Coupon code is required." };
  }

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
  if (!coupon) {
    return { status: 404, message: "Coupon not found or invalid." };
  }

  if (coupon.expirationDate <= new Date()) {
    return { status: 410, message: "Coupon has expired." };
  }

  if (coupon.isFirstTimeOnly && !user?.isFirstTimeBuyer) {
    return {
      status: 403,
      message: "This coupon is for first-time buyers only.",
    };
  }

  return { coupon };
};
