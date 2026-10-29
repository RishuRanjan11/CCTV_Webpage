import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";
import { validateCouponForUser } from "../lib/coupons.js";

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { products, Address, couponCode } = req.body;
    if (
      !Array.isArray(products) ||
      products.length === 0 ||
      typeof Address !== "string" ||
      !Address.trim() ||
      (couponCode != null && typeof couponCode !== "string")
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const quantitiesByProduct = new Map();
    for (const item of products) {
      if (
        !item ||
        !mongoose.Types.ObjectId.isValid(item.product) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({ message: "Invalid order products." });
      }

      const productId = item.product.toString();
      quantitiesByProduct.set(
        productId,
        (quantitiesByProduct.get(productId) || 0) + item.quantity
      );
    }

    const productIds = [...quantitiesByProduct.keys()];
    const databaseProducts = await Product.find({ _id: { $in: productIds } });
    if (databaseProducts.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products in your cart are no longer available.",
      });
    }

    const orderProducts = databaseProducts.map((product) => ({
      product: product._id,
      quantity: quantitiesByProduct.get(product._id.toString()),
      price: product.price,
    }));
    const subtotal = orderProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    let appliedCoupon;
    let discountAmount = 0;
    if (couponCode?.trim()) {
      const result = await validateCouponForUser(couponCode, req.user);
      if (result.message) {
        return res.status(result.status).json({ message: result.message });
      }

      appliedCoupon = result.coupon;
      discountAmount =
        Math.round(
          ((subtotal * appliedCoupon.discountPercentage) / 100 +
            Number.EPSILON) *
            100
        ) / 100;
    }

    const totalAmount = Math.max(0, subtotal - discountAmount);
    const newOrder = new Order({
      user: req.user._id,
      products: orderProducts,
      subtotal,
      couponCode: appliedCoupon?.code,
      discountPercentage: appliedCoupon?.discountPercentage || 0,
      discountAmount,
      totalAmount,
      Address,
      phone: req.user.phone,
    });

    await newOrder.save();

    // After successful order placement, update the user's first-time buyer status
    await User.findByIdAndUpdate(req.user._id, {
      $set: { isFirstTimeBuyer: false },
    });

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @description Update the status of an order
// @route PATCH /api/orders/:orderId/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate the incoming status against the allowed values in the model
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value provided." });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    const updatedOrder = await order.save();

    // Populate user details to send the full object back, consistent with fetchAllOrders
    await updatedOrder.populate("user", "name email");

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Fetch all orders (admin or for testing)
export const fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// @description Fetch orders for the currently logged-in user
// @route GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name") // Populate only the product name for efficiency
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
