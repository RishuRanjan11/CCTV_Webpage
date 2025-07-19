import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/AdminLayout";
import ProductFormModal from "../../components/ProductFormModal";
import "./AdminStyles.css";
import { useProductStore } from "../../stores/useProductStore";

const AdminProducts = () => {

  const { products, deleteProduct, fetchAllProducts } = useProductStore();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleSaveProduct = (formData) => {
    setShowModal(false);
    setEditingProduct(null);
    // Re-fetch products after saving to see changes
    fetchAllProducts();
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
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

  return (
    <AdminLayout>
      <div className="admin-page">
        <h2>Manage Products</h2>
        <button
          className="admin-btn"
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
        >
          + Add Product
        </button>

        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6">No products match your filters.</td>
                    </tr>
                  ) : (
                    currentProducts.map((p, index) => (
                      <tr key={p._id}>
                        <td>{(currentPage - 1) * productsPerPage + index + 1}</td>
                        <td>
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span>No Image</span>
                          )}
                        </td>
                        <td>{p.name}</td>
                        <td>₹{p.price}</td>
                        <td>{p.category}</td>
                        <td>
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setShowModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProduct(p._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {renderPagination()}
          </>
        )}
      </div>

      <ProductFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </AdminLayout>
  );
};

export default AdminProducts;
