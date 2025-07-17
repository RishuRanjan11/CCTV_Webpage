import React, { useEffect, useState } from 'react';
import "./Products.css";
import { useProductStore } from "../stores/useProductStore";
import { Link } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
const Products = () => {
  // ✅ Initialize your products array
  // const [searchQuery, setSearchQuery] = useState("");
  const { products, fetchAllProducts } = useProductStore();
  const { filteredProducts, setFilteredProducts } = useState(null);
  useEffect(() => {
    fetchAllProducts();
    // setFilteredProducts(products);
  }, [fetchAllProducts, products]);
  const user = useUserStore((state) => state.user);
  // ✅ Filter based on search
  // const filteredProducts = products.filter((product) =>
  //   product.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  return (
    <section id="product" className="product">
        <h2>Our Products</h2>
        <div className="product-grid">
            {filteredProducts && filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <div className="product-card" key={product._id}>
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        {user ? (
                            <Link to="/checkout" className="btn-secondary">
                                Order Now
                            </Link>
                        ) : (
                            <Link to="/login" className="btn-secondary">
                                Login to Order
                            </Link>
                        )}
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
