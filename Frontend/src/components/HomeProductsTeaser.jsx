import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./HomeProductTeaser.css";
import { useProductStore } from "../stores/useProductStore";

const HomeProductsTeaser = () => {
  const { fetchFeaturedProducts, products, loading } = useProductStore();

  // const [products, setProducts] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <section className="products-section">
      <h2>Featured Products</h2>

      {loading && <p>Loading...</p>}
      {/* {error && <p className="error">{error}</p>} */}

      <div className="product-grid">
        {products.map((p) => (
          <div key={p._id} className="product-card">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <h4>₹{p.price}</h4>
          </div>
        ))}
      </div>

      <Link to="/products" className="view-more-link">
        View All Products
      </Link>
    </section>
  );
};

export default HomeProductsTeaser;
