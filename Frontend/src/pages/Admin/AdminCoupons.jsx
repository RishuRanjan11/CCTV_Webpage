import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminStyles.css';
import axios from '../../lib/axios'; // Assuming axios is configured for /api base URL

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    code: '',
    discountPercentage: '', // Changed from discount to discountPercentage
    isFirstTimeOnly: false,
    expirationDate: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        // The path is relative to the axios baseURL, e.g., /api
        const response = await axios.get('/coupons');
        setCoupons(response.data.coupons || []);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load coupons.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []); // Fetch only once on component mount

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Validate required fields
    if (!form.code || !form.discountPercentage || !form.expirationDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const payload = {
      code: form.code.toUpperCase(),
      discountPercentage: parseInt(form.discountPercentage, 10),
      isFirstTimeOnly: form.isFirstTimeOnly,
      expirationDate: new Date(form.expirationDate).toISOString(),
    };

    if (isNaN(payload.discountPercentage) || payload.discountPercentage < 0 || payload.discountPercentage > 100) {
      setError('Discount Percentage must be a valid number between 0 and 100.');
      return;
    }

    try {
      let response;
      if (editingId) {
        // Update existing coupon
        response = await axios.put(`/coupons/${editingId}`, payload);
        setCoupons(prev => prev.map(c => (c._id === editingId ? response.data : c)));
      } else {
        // Create new coupon
        response = await axios.post('/coupons', payload);
        setCoupons(prev => [...prev, response.data]);
      }

      // Reset form and state
      setForm({ code: '', discountPercentage: '', isFirstTimeOnly: false, expirationDate: '' });
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  const handleEdit = coupon => {
    setError('');
    setForm({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      isFirstTimeOnly: coupon.isFirstTimeOnly,
      expirationDate: new Date(coupon.expirationDate).toISOString().split('T')[0], // Format for <input type="date">
    });
    setEditingId(coupon._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this coupon?')) return;
    setError('');
    try {
      await axios.delete(`/coupons/${id}`);
      setCoupons(prevCoupons => prevCoupons.filter(c => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting coupon.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <AdminLayout>
      <main className="admin-main">
        <div className="admin-page">
          <h2>Manage Coupons</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSave} className="coupon-form">
            <input type="text" name="code" placeholder="Coupon Code (e.g. NEW10)" value={form.code} onChange={handleChange} required />
            <input type="number" name="discountPercentage" placeholder="Discount %" value={form.discountPercentage} onChange={handleChange} required min="0" max="100" />
            <input type="date" name="expirationDate" value={form.expirationDate} onChange={handleChange} required />
            <label>
              <input type="checkbox" name="isFirstTimeOnly" checked={form.isFirstTimeOnly} onChange={handleChange} />
              First-time users only
            </label>
            <button type="submit">{editingId ? 'Update Coupon' : 'Add Coupon'}</button>
          </form>

          {loading ? (
            <p>Loading coupons...</p>
          ) : coupons.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount %</th>
                  <th>First-Time Only</th>
                  <th>Expiration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon._id}>
                    <td>{coupon.code}</td>
                    <td>{coupon.discountPercentage}%</td>
                    <td>
                      {coupon.isFirstTimeOnly === true
                        ? '✅ Yes'
                        : coupon.isFirstTimeOnly === false
                        ? '❌ No'
                        : 'N/A'}
                    </td>
                    <td>{formatDate(coupon.expirationDate)}</td>
                    <td>
                      <button onClick={() => handleEdit(coupon)}>Edit</button>
                      <button onClick={() => handleDelete(coupon._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No coupons found.</p>
          )}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminCoupons;
