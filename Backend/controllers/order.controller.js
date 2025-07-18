import Order from "../models/order.model.js";

// Place a new order
export const placeOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount, Address, phone } = req.body;
    if (
      !userId ||
      !products ||
      products.length === 0 ||
      !totalAmount ||
      !Address ||
      !phone
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newOrder = new Order({
      user: userId,
      products,
      totalAmount,
      Address,
      phone,
    });

    await newOrder.save();

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
