import React, { useEffect } from "react";
import "./Products.css";
import { useProductStore } from "../stores/useProductStore";
import { Link } from "react-router-dom";

const Products = () => {
  const { products, fetchAllProducts } = useProductStore();

  useEffect(() => {
    if (products.length === 0) {
      fetchAllProducts();
    }
  }, [fetchAllProducts, products.length]);

  // Display a subset of products, e.g., the first 4 featured products
  const featuredProducts = products.slice(0, 4);

  return (
    <section id="product" className="product">
      <h2>Our Products</h2>
      <div className="product-grid">
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <Link to="/products" className="btn-secondary">
                View Details
              </Link>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <Link to="/products" className="btn-secondary">
          View All Products
        </Link>
      </div>
    </section>
  );
};

export default Products;
