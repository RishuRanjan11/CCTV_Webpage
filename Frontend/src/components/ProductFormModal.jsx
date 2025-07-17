import React, { useState, useEffect } from 'react';
import '../pages/Admin/AdminStyles.css';

const ProductFormModal = ({ show, onClose, onSave, product }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        image: null,
      });
      setPreview(product.imageUrl || null);
    } else {
      setFormData({
        title: '',
        description: '',
        price: '',
        category: '',
        image: null,
      });
      setPreview(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.category) {
      alert('Please fill in all fields.');
      return;
    }
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{product ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
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
                ? `Selected: ${formData.image.name}`
                : 'Click to upload image'}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>

          {preview && <img src={preview} alt="Preview" className="preview-img" />}

          <div className="modal-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
