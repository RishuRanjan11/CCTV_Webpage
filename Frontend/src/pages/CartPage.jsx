import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from '../stores/useCartStore';
import '../App.css';
import './CartPage.css'

function CartPage() {
    const { cartItems, removeFromCart, updateQuantity, clearCart, getCart, loading } = useCartStore();
    const navigate = useNavigate();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            // Fetch cart if it's not loaded (e.g., user navigated directly to this page)
            if (cartItems.length === 0) {
                getCart();
            }
        }
    }, [user, navigate, getCart, cartItems.length]);

    // Filter out items where the product might have been deleted from the DB
    const validCartItems = cartItems.filter(item => item.product);

    const handleQuantityChange = (productId, newQuantity) => {
        updateQuantity(productId, newQuantity);
    };

    const totalPrice = validCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return (
        <>

            <div className="cart-page">
                <h2>Your Cart</h2>

                {loading && cartItems.length === 0 ? (
                    <p>Loading your cart...</p>
                ) : validCartItems.length === 0 ? (
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
                                {validCartItems.map(({ product, quantity }) => (
                                    <tr key={product._id}>
                                        <td>
                                            <img src={product.image} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>₹{product.price}</td>
                                        <td>
                                            <button onClick={() => handleQuantityChange(product._id, quantity - 1)}>-</button>
                                            <span className="quantity-value">{quantity}</span>
                                            <button onClick={() => handleQuantityChange(product._id, quantity + 1)}>+</button>
                                        </td>
                                        <td>₹{product.price * quantity}</td>
                                        <td>
                                            <button onClick={() => removeFromCart(product._id)}>Remove</button>
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
