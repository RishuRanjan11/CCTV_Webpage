import Coupon from "../models/coupon.model.js";
import { validateCouponForUser } from "../lib/coupons.js";

export const getCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find({}); // Fetch all coupons
        res.status(200).json({ coupons });
    } catch (error) {
        res.status(500).json({ message: "Error fetching coupons", error: error.message });
    }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate, isFirstTimeOnly } =
      req.body;
    const coupon = new Coupon({
      code,
      discountPercentage,
      expirationDate,
      isFirstTimeOnly,
    });
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error for the 'code' field
      return res.status(409).json({ message: "Coupon code already exists." });
    }
    res.status(500).json({ message: "Error creating coupon", error: error.message });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const result = await validateCouponForUser(req.body.code, req.user);
    if (result.message) {
      return res.status(result.status).json({ message: result.message });
    }

    res.json({
      message: "Coupon is valid",
      code: result.coupon.code,
      discountPercentage: result.coupon.discountPercentage,
      isFirstTimeOnly: result.coupon.isFirstTimeOnly,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    // Find and update the coupon, returning the new version
    const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: "Error updating coupon", error: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting coupon", error: error.message });
  }
};
