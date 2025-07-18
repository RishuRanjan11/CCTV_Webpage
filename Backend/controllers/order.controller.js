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
