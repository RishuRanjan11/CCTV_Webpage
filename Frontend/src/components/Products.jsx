import React, { useEffect, useState } from "react";
import "./Products.css";
import { useProductStore } from "../stores/useProductStore";

const Products = () => {
  // ✅ Initialize your products array
  // const [searchQuery, setSearchQuery] = useState("");
  const { products, fetchAllProducts } = useProductStore();
  const { filteredProducts, setFilteredProducts } = useState(null);
  useEffect(() => {
    fetchAllProducts();
    setFilteredProducts(products);
  }, [fetchAllProducts]);
  // ✅ Filter based on search
  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <section id="product" className="product">
      <h2>Our Products</h2>
      <div className="product-grid">
        {filteredProducts.length < 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <a href="/order" className="btn-secondary">
                Order Now
              </a>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </section>
  );
};

export default Products;
