import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminNavbar.css";
import { useUserStore } from "../stores/useUserStore";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserStore();
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-logo">
        <Link to="/admin/dashboard">CCTV Digital Surveillance's Admin</Link>
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
