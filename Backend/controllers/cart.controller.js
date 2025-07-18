import User from "../models/user.model.js";
import Product from "../models/product.model.js";

// @description Get user's cart with populated product details
// @route GET /api/cart
export const getCart = async (req, res) => {
  try {
    // Find the user and use .populate() to automatically fetch the full
    // product details for each item in the cart. This is the key fix.
    const user = await User.findById(req.user._id).populate({
      path: "cartItems.product",
      model: "Product",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // The user's cartItems array now contains the full product objects.
    // This is the exact format the frontend needs.
    res.status(200).json(user.cartItems);
  } catch (error) {
    console.error("Error in getCart:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @description Add a product to the cart or update its quantity
// @route POST /api/cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const user = await User.findById(userId);
    // This now correctly checks for the product's ID inside the nested object.
    const cartItemIndex = user.cartItems.findIndex(
      (item) => item && item.product && item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Product already in cart, update quantity
      user.cartItems[cartItemIndex].quantity += quantity;
    } else {
      // Product not in cart, add it as a new item.
      // This now pushes the correct object structure, matching your schema.
      user.cartItems.push({ product: productId, quantity });
    }

    await user.save();
    // Repopulate to send the full, updated cart back to the client
    const updatedUser = await User.findById(userId).populate(
      "cartItems.product"
    );
    res.status(200).json(updatedUser.cartItems);
  } catch (error) {
    console.error("Error in addToCart:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @description Update product quantity in cart
// @route PUT /api/cart/:productId
export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity < 1) {
      // The frontend store already handles this, but it's good practice
      // to have backend validation as well.
      return res
        .status(400)
        .json({ message: "Quantity must be at least 1" });
    }

    const user = await User.findById(userId);
    const cartItemIndex = user.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      user.cartItems[cartItemIndex].quantity = quantity;
      await user.save();
      const updatedUser = await User.findById(userId).populate(
        "cartItems.product"
      );
      return res.status(200).json(updatedUser.cartItems);
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }
  } catch (error) {
    console.error("Error in updateQuantity:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @description Remove a single product from the cart
// @route DELETE /api/cart/:productId
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
      $pull: { cartItems: { product: productId } },
    });

    const updatedUser = await User.findById(userId).populate(
      "cartItems.product"
    );
    res.status(200).json(updatedUser.cartItems);
  } catch (error) {
    console.error("Error in removeFromCart:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @description Clear all items from the cart
// @route DELETE /api/cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cartItems = [];
    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error)
  {
    console.error("Error in clearCart:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
