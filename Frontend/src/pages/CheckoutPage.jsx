import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";
import { useCartStore } from "../stores/useCartStore";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { placeOrder } = useOrderStore();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    // Pre-fill form with user data if available
    if (user) {
      setFormData({
        name: user.name || "",
        address: "", // Address is not in user model
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user, navigate]);

  // Filter out items where the product might have been deleted from the DB
  const validCartItems = cartItems.filter(item => item.product);

  const totalPrice = validCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    if (
      !formData.name ||
      !formData.address ||
      !formData.phone ||
      !formData.email
    ) {
      alert("Please fill in all fields!");
      setIsPlacingOrder(false);
      return;
    }

    const orderData = {
      userId: user._id,
      products: validCartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount: totalPrice,
      Address: formData.address,
      phone: formData.phone,
    };
    try {
      await placeOrder(orderData);
      alert("✅ Order placed successfully!");
      await clearCart();
      navigate("/");
    } catch (error) {
      alert("There was an error placing your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (validCartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate("/")}>Go to Products</button>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-page">
        <h2>Checkout</h2>

        <div className="checkout-content">
          <div className="checkout-cart">
            <h3>Your Items</h3>
            <ul>
              {validCartItems.map(({ product, quantity }) => (
                <li key={product._id} className="checkout-item">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <p>{product.name}</p>
                    <p>Quantity: {quantity}</p>
                    <p>Subtotal: ₹{product.price * quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="checkout-total">Total: ₹{totalPrice}</h3>
          </div>

          <div className="checkout-form">
            <h3>Delivery Details</h3>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
