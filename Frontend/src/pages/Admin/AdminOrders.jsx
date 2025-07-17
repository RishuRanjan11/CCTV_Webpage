import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminStyles.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/admin/orders'); // Adjust if different
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data.orders || []); // Expecting { orders: [...] }
      } catch (err) {
        console.error('Fetch Orders Error:', err);
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <AdminLayout>
      <main className="admin-main">
        <div className="admin-page">
          <h2>Manage Orders</h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id.slice(0, 8)}...</td>
                    <td>{order.customerName || 'N/A'}</td>
                    <td>₹{order.total}</td>
                    <td>
                      <span
                        className={`status-badge ${order.status?.toLowerCase() || 'pending'}`}
                      >
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
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

export default AdminOrders;
