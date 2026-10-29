import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./HomeProductTeaser.css";
import { useProductStore } from "../stores/useProductStore";

const HomeProductsTeaser = () => {
  const { fetchLatestProducts, products, loading } = useProductStore();

  useEffect(() => {
    fetchLatestProducts();
  }, [fetchLatestProducts]);

  return (
    <section className="products-section">
      <h2>Latest Products</h2>

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
