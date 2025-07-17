import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminStyles.css';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    code: '',
    discount: '',
    isFirstTimeOnly: false,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await fetch('/api/admin/coupons'); // Adjust this
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCoupons(data.coupons || []);
      } catch (err) {
        setError('Failed to load coupons.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      code: form.code.toUpperCase(),
      discount: Number(form.discount),
      isFirstTimeOnly: form.isFirstTimeOnly,
    };

    try {
      const url = editingId
        ? `/api/admin/coupons/${editingId}`
        : '/api/admin/coupons';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Save failed');
      const updated = await res.json();

      if (editingId) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === editingId ? updated : c))
        );
      } else {
        setCoupons((prev) => [...prev, updated]);
      }

      setForm({ code: '', discount: '', isFirstTimeOnly: false });
      setEditingId(null);
    } catch (err) {
      alert('Error saving coupon.');
      console.error(err);
    }
  };

  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code,
      discount: coupon.discount,
      isFirstTimeOnly: coupon.isFirstTimeOnly,
    });
    setEditingId(coupon._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setCoupons((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert('Error deleting coupon.');
    }
  };

  return (
    <AdminLayout>
      <main className="admin-main">
        <div className="admin-page">
          <h2>Manage Coupons</h2>

          <form onSubmit={handleSave} className="coupon-form">
            <input
              type="text"
              name="code"
              placeholder="Coupon Code (e.g. NEW10)"
              value={form.code}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="discount"
              placeholder="Discount %"
              value={form.discount}
              onChange={handleChange}
              required
            />
            <label>
              <input
                type="checkbox"
                name="isFirstTimeOnly"
                checked={form.isFirstTimeOnly}
                onChange={handleChange}
              />
              First-time users only
            </label>
            <button type="submit">
              {editingId ? 'Update Coupon' : 'Add Coupon'}
            </button>
          </form>

          {loading ? (
            <p>Loading coupons...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount %</th>
                  <th>First-Time Only</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon._id}>
                    <td>{coupon.code}</td>
                    <td>{coupon.discount}%</td>
                    <td>{coupon.isFirstTimeOnly ? '✅ Yes' : '❌ No'}</td>
                    <td>
                      <button onClick={() => handleEdit(coupon)}>Edit</button>
                      <button onClick={() => handleDelete(coupon._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminCoupons;
