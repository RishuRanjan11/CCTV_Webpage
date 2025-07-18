import React, { useState, useEffect } from "react";
import "../pages/Admin/AdminStyles.css";
import { useProductStore } from "../stores/useProductStore";

const ProductFormModal = ({ show, onClose, onSave, product }) => {
  const { createProduct, editProduct, fetchAllProducts } = useProductStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
  });
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        image: product.image || null,
      });
      setPreview(product.image || null);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        image: null,
      });
      setPreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };

      reader.readAsDataURL(file); // base64 format
      setPreview(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      alert("Please fill in all fields.");
      return;
    }
    if (product && product._id) editProduct(product._id, formData);
    else createProduct(formData);
    fetchAllProducts();
    onSave();
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{product ? "Edit Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          {/* ⭐ NEW Styled Upload Box */}
          <label className="upload-box">
            <span className="upload-box-label">
              {formData.image
                ? preview && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="preview-img"
                    />
                  )
                : "Click to upload image"}
            </span>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>

          {/* {preview && (
            <img src={formData.image} alt="Preview" className="preview-img" />
          )} */}

          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
