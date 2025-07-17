import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomeProductTeaser.css';

const HomeProductsTeaser = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products/featured');
        if (!res.ok) throw new Error('Failed to fetch featured products');
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        console.error(err);
        setError('Error loading featured products.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="products-section">
      <h2>Featured Products</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

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
