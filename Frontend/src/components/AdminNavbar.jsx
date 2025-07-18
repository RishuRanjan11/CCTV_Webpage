import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/useUserStore';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-logo">
        <Link to="/admin/dashboard">Admin Panel</Link>
      </div>
      <ul className="admin-navbar-links">
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/products">Products</Link>
        </li>
        <li>
          <Link to="/admin/orders">Orders</Link>
        </li>
        <li>
          <Link to="/admin/coupons">Coupons</Link>
        </li>
        <li>
          <Link to="/admin/users">Users</Link>
        </li>
        {user && user.role === "admin" && (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default AdminNavbar;
