import React from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import AdminFooter from '../../components/AdminFooter';
import './AdminStyles.css';
import AdminLayout from '../../components/AdminLayout';

const AdminUsers = () => {
  return (
    
      <AdminLayout>
      <div className="admin-page">
        <h2>Manage Users</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Phone</th>
              <th>First-Time Buyer</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>user@example.com</td>
              <td>Jane Doe</td>
              <td>9876543210</td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
      </AdminLayout>
  );
};

export default AdminUsers;
