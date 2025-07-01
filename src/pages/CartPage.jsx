import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import './CartPage.css'

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(id, newQuantity);
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>

            <div className="cart-page">
                <h2>Your Cart</h2>

                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <>
                        <table className="cart-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Subtotal</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>₹{item.price}</td>
                                        <td>
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                                        </td>
                                        <td>₹{item.price * item.quantity}</td>
                                        <td>
                                            <button onClick={() => removeFromCart(item._id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="cart-summary">
                            <h3>Total: ₹{totalPrice}</h3>
                            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                                Proceed to Checkout
                            </button>

                            <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
                        </div>
                    </>
                )}
            </div>

        </>
    );
}

export default CartPage;
