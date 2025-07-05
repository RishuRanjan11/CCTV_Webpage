import React, { useEffect, useState, useContext } from "react";
import './ProductsPage.css';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from "../stores/useUserStore";

const ProductsPage = () => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasSeenPopup, setHasSeenPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const fakeProducts = [
    {
      _id: "1",
      name: "4K Ultra HD CCTV",
      description: "Top-class camera for residential & office surveillance",
      price: 9999,
      category: "cctv",
      image: "https://picsum.photos/300/200?camera1",
    },
    {
      _id: "2",
      name: "Night Vision CCTV",
      description: "See clearly even in pitch darkness",
      price: 7999,
      category: "cctv",
      image: "https://picsum.photos/300/200?camera2",
    },
    {
      _id: "3",
      name: "Modern DVR",
      description: "High-capacity digital video recorder for CCTV",
      price: 12999,
      category: "dvr",
      image: "https://picsum.photos/300/200?camera3",
    },
  ];

  useEffect(() => {
    setProducts(fakeProducts);
    setLoading(false);
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    const wasCartEmpty = cartItems.length === 0;
    addToCart(product);
    if (wasCartEmpty) {
      setShowPopup(true);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory ? product.category === filterCategory : true;
    return matchSearch && matchCategory;
  });

  if (loading) return <div>Loading Products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="product-page">
      <h1>Our Products</h1>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="cctv">CCTV</option>
          <option value="dvr">DVR</option>
          <option value="accessory">Accessory</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const cartItem = cartItems.find(item => item._id === product._id);
            const quantity = cartItem ? cartItem.quantity : 0;

            return (
              <div className="product-card" key={product._id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <h4>₹{product.price}</h4>

                {quantity === 0 ? (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="order-now-btn"
                  >
                    Order Now
                  </button>
                ) : (
                  <div className="quantity-controls">
                    <button onClick={() => {
                      if (quantity === 1) removeFromCart(product._id);
                      else updateQuantity(product._id, quantity - 1);
                    }}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(product._id, quantity + 1)}>+</button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div>No Products Found</div>
        )}
      </div>

      {cartItems.length > 0 && (
        <button
          className="floating-checkout-btn"
          onClick={() => navigate('/cart')}
        >
          🛒 Checkout ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      )}

      {showPopup && (
  <div className="cart-popup-backdrop" onClick={() => setShowPopup(false)}>
    <div className="cart-popup-modal" onClick={(e) => e.stopPropagation()}>
      <p>✅ Item added to cart!</p>
      <button onClick={() => {
        setShowPopup(false);
        navigate('/cart');
      }}>Go to Cart</button>
      <button onClick={() => setShowPopup(false)}>Continue Shopping</button>
    </div>
  </div>
)}

    </div>
  );
};

export default ProductsPage;