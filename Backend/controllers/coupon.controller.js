import Coupon from "../models/coupon.model.js";
import User from "../models/user.model.js";

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
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ message: "Coupon code is required." });
    }

    // Find the coupon by its code, case-insensitive for better UX
    const coupon = await Coupon.findOne({ code: { $regex: new RegExp(`^${code}$`, 'i') } });

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or invalid" });
    }

    if (coupon.expirationDate < new Date()) {
      // 410 Gone is more specific for expired resources
      return res.status(410).json({ message: "Coupon has expired" });
    }

    // If the coupon is for first-time buyers, check the user's status
    if (coupon.isFirstTimeOnly) {
      // req.user is available from the protectRoute middleware
      const user = await User.findById(req.user._id);
      if (!user || !user.isFirstTimeBuyer) {
        return res.status(403).json({ message: "This coupon is for first-time buyers only." });
      }
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      isFirstTimeOnly: coupon.isFirstTimeOnly,
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
