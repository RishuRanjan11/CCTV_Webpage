// import React, { useEffect, useState } from 'react';
// import AdminNavbar from '../../components/AdminNavbar';
// import AdminFooter from '../../components/AdminFooter';
// import ProductFormModal from '../../components/ProductFormModal';
// import './AdminStyles.css';

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingProduct, setEditingProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch('/api/admin/products', { cache: 'no-store' });
//       if (!res.ok) throw new Error('Failed to fetch products');
//       const data = await res.json();
//       console.log('Fetched products:', data);
//       setProducts(data);
//     } catch (err) {
//       console.error('Error fetching products:', err);
//       setError('Failed to load products. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSaveProduct = async (formData) => {
//     try {
//       const data = new FormData();
//       data.append('title', formData.title);
//       data.append('description', formData.description);
//       data.append('price', formData.price);
//       data.append('category', formData.category);
//       if (formData.image) data.append('image', formData.image);

//       let url = '/api/admin/products';
//       let method = 'POST';

//       if (editingProduct) {
//         url = `/api/admin/products/${editingProduct._id}`;
//         method = 'PUT';
//       }

//       const res = await fetch(url, { method, body: data });
//       if (!res.ok) throw new Error('Failed to save product');

//       alert('Product saved successfully!');
//       setShowModal(false);
//       setEditingProduct(null);
//       fetchProducts();
//     } catch (err) {
//       console.error('Error saving product:', err);
//       alert('Error saving product. Please check the console for details.');
//     }
//   };

//   const handleDeleteProduct = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) return;
//     try {
//       const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
//       if (!res.ok) throw new Error('Failed to delete product');
//       fetchProducts();
//     } catch (err) {
//       console.error('Error deleting product:', err);
//       alert('Error deleting product. Please check the console for details.');
//     }
//   };

//   return (
//     <>
//       <AdminNavbar />
//       <main className="admin-main">
//         <div className="admin-page">
//           <h2>Manage Products</h2>
//           <button className="admin-btn" onClick={() => { setEditingProduct(null); setShowModal(true); }}>+ Add Product</button>

//           {loading ? (
//             <p>Loading products...</p>
//           ) : error ? (
//             <p className="error-message">{error}</p>
//           ) : (
//             <table className="admin-table">
//               <thead>
//                 <tr>
//                   <th>Image</th>
//                   <th>Title</th>
//                   <th>Price</th>
//                   <th>Category</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.length === 0 ? (
//                   <tr>
//                     <td colSpan="5">No products found.</td>
//                   </tr>
//                 ) : (
//                   products.map(p => (
//                     <tr key={p._id}>
//                       <td>
//                         {p.imageUrl ? (
//                           <img src={p.imageUrl} alt={p.title} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
//                         ) : (
//                           <span>No Image</span>
//                         )}
//                       </td>
//                       <td>{p.title}</td>
//                       <td>₹{p.price}</td>
//                       <td>{p.category}</td>
//                       <td>
//                         <button onClick={() => { setEditingProduct(p); setShowModal(true); }}>Edit</button>
//                         <button onClick={() => handleDeleteProduct(p._id)}>Delete</button>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </main>
//       <AdminFooter />

//       <ProductFormModal
//         show={showModal}
//         onClose={() => setShowModal(false)}
//         onSave={handleSaveProduct}
//         product={editingProduct}
//       />
//     </>
//   );
// };

// export default AdminProducts;

import React, { useEffect, useState } from "react";
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

  // Fake local products for now
  const FAKE_PRODUCTS = [
    {
      _id: "1",
      title: "4K Ultra HD CCTV",
      description: "High-resolution camera",
      price: 9999,
      category: "CCTV",
      imageUrl: "https://via.placeholder.com/60",
    },
    {
      _id: "2",
      title: "Night Vision CCTV",
      description: "Infrared camera",
      price: 7999,
      category: "CCTV",
      imageUrl: "https://via.placeholder.com/60",
    },
  ];

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleSaveProduct = (formData) => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <h2>Manage Products</h2>
        <button
          className="admin-btn"
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
        >
          + Add Product
        </button>

        {loading ? (
          <p>Loading products...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
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
