import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CheckoutPage.css';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.address || !formData.phone || !formData.email) {
      alert('Please fill in all fields!');
      return;
    }

    // Simulate order placement
    alert('✅ Order placed successfully!');
    clearCart();
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <h2>Your cart is empty.</h2>
        <button onClick={() => navigate('/')}>Go to Products</button>
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
              {cartItems.map((item) => (
                <li key={item._id} className="checkout-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p>{item.name}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Subtotal: ₹{item.price * item.quantity}</p>
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
            <button className="place-order-btn" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default CheckoutPage;
