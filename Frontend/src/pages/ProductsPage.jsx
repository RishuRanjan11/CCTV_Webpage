import React, { useEffect, useState, useCallback } from "react";
import "./ProductsPage.css";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const ProductsPage = () => {
  const { cartItems, addToCart, updateQuantity } = useCartStore();
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  const { products, fetchAllProducts } = useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 25;

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleInitialAddToCart = (product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product)
      .then(() => {
        // This now only runs on success
        setShowPopup(true);
      })
      .catch(() => {
        // The error is already toasted in the store, so we can just console log here.
        console.error("Add to cart failed, not showing popup.");
      });
  };

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // Pagination Logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPagination = useCallback(() => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const pageNeighbours = 1;

    pageNumbers.push(1);

    if (currentPage > pageNeighbours + 2) {
      pageNumbers.push("...");
    }

    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - pageNeighbours - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return (
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>&laquo; Prev</button>
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          }
          return (
            <button key={page} onClick={() => handlePageChange(page)} className={currentPage === page ? "active" : ""}>
              {page}
            </button>
          );
        })}
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next &raquo;</button>
      </div>
    );
  }, [currentPage, totalPages]);

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

      </div>

      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => {
            const cartItem = cartItems.find(
              (item) => item.product && item.product._id === product._id
            );
            const quantity = user && cartItem ? cartItem.quantity : 0;

            return (
              <div className="product-card" key={product._id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <h4>₹{product.price}</h4>

                {quantity === 0 ? (
                  <button
                    onClick={() => handleInitialAddToCart(product)}
                    className="order-now-btn"
                  >
                    Order Now
                  </button>
                ) : (
                  <div className="quantity-controls">
                    <button
                      onClick={() => {
                        updateQuantity(product._id, quantity - 1);
                      }}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="no-products">No Products Found</div>
        )}
      </div>

      {renderPagination()}

      {user && cartItems.length > 0 && (
        <button
          className="floating-checkout-btn"
          onClick={() => navigate("/cart")}
        >
          🛒 Checkout ({cartItems.reduce((sum, item) => {
            return item.product ? sum + item.quantity : sum;
          }, 0)}
          )
        </button>
      )}

      {showPopup && (
        <div
          className="cart-popup-backdrop"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="cart-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p>✅ Item added to cart!</p>
            <button
              onClick={() => {
                setShowPopup(false);
                navigate("/cart");
              }}
            >
              Go to Cart
            </button>
            <button onClick={() => setShowPopup(false)}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
