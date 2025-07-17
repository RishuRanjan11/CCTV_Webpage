import React from 'react';
import AdminNavbar from './AdminNavbar';
import AdminFooter from './AdminFooter';
import '../pages/Admin/AdminStyles.css';

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminNavbar />
      <div className="admin-content">
        {children}
      </div>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
