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

  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Filter out items where the product might have been deleted from the DB
  const validCartItems = cartItems.filter(item => item.product);

  const totalPrice = validCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    if (!address.trim()) {
      alert("Please fill in your shipping address!");
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
      Address: address,
      phone: user.phone,
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
            <div className="user-info-display">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone}</p>
            </div>
            <textarea
              name="address"
              placeholder="Full Shipping Address"
              value={address}
              onChange={handleAddressChange}
              required
              rows="4"
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
