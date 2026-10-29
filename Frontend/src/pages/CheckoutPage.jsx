import React, { useState, useEffect } from "react";
import "./CheckoutPage.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useOrderStore } from "../stores/useOrderStore";
import { useCartStore } from "../stores/useCartStore";
import axios from "../lib/axios";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { placeOrder } = useOrderStore();

  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Filter out items where the product might have been deleted from the DB
  const validCartItems = cartItems.filter(item => item.product);

  const subtotal = validCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = coupon
    ? Math.round(((subtotal * coupon.discountPercentage) / 100 + Number.EPSILON) * 100) / 100
    : 0;
  const totalPrice = Math.max(0, subtotal - discountAmount);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) {
      setCouponError("Enter a coupon code.");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const response = await axios.post("/coupons/validate", {
        code: couponInput.trim(),
      });
      setCoupon(response.data);
    } catch (error) {
      setCoupon(null);
      setCouponError(
        error.response?.data?.message || "Could not validate this coupon."
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponInput("");
    setCouponError("");
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    if (!address.trim()) {
      alert("Please fill in your shipping address!");
      setIsPlacingOrder(false);
      return;
    }

    const orderData = {
      products: validCartItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      Address: address,
      couponCode: coupon?.code,
    };
    try {
      await placeOrder(orderData);
      alert("✅ Order placed successfully!");
      await clearCart();
      navigate("/");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "There was an error placing your order. Please try again."
      );
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
            <form className="checkout-coupon" onSubmit={handleApplyCoupon}>
              <h3>Coupon Code</h3>
              <div className="checkout-coupon-controls">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value);
                    setCoupon(null);
                    setCouponError("");
                  }}
                  placeholder="Enter coupon code"
                  aria-label="Coupon code"
                  disabled={Boolean(coupon) || isApplyingCoupon}
                />
                {coupon ? (
                  <button type="button" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                ) : (
                  <button type="submit" disabled={isApplyingCoupon}>
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </button>
                )}
              </div>
              {couponError && (
                <p className="checkout-coupon-error" role="alert">
                  {couponError}
                </p>
              )}
              {coupon && (
                <p className="checkout-coupon-success" role="status">
                  {coupon.code} applied ({coupon.discountPercentage}% off).
                </p>
              )}
            </form>
            <div className="checkout-price-summary">
              <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
              {coupon && (
                <p>Coupon discount: -₹{discountAmount.toFixed(2)}</p>
              )}
              <h3 className="checkout-total">
                Total: ₹{totalPrice.toFixed(2)}
              </h3>
            </div>
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
