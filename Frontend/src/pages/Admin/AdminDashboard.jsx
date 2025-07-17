import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import './AdminStyles.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await fetch('/api/admin/dashboard'); // ⛳ Adjust route if needed
        if (!res.ok) throw new Error('Failed to fetch dashboard data');
        const data = await res.json();

        setStats({
          users: data.totalUsers || 0,
          products: data.totalProducts || 0,
          orders: data.totalOrders || 0,
          totalSales: data.totalSales || 0,
        });
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <AdminLayout>
      <main className="admin-main">
        <div className="admin-page">
          <h2>Admin Dashboard</h2>

          {loading ? (
            <p>Loading stats...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <div className="admin-cards">
              <div className="admin-card">
                <h3>Total Users</h3>
                <p>{stats.users}</p>
              </div>
              <div className="admin-card">
                <h3>Total Products</h3>
                <p>{stats.products}</p>
              </div>
              <div className="admin-card">
                <h3>Total Orders</h3>
                <p>{stats.orders}</p>
              </div>
              <div className="admin-card">
                <h3>Total Sales</h3>
                <p>₹{stats.totalSales}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
};

export default AdminDashboard;
