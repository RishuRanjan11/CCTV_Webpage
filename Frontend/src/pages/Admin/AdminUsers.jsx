import React, { useState, useEffect } from 'react';
import { useUserStore } from "../../stores/useUserStore";
import { Link } from 'react-router-dom';
import axios from '../../lib/axios';
import AdminNavbar from '../../components/AdminNavbar';
import AdminFooter from '../../components/AdminFooter';
import './AdminStyles.css';
import AdminLayout from '../../components/AdminLayout';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const userStore = useUserStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/admin/customers', {
          params: { page: currentPage },
        });
        setUsers(response.data.customers);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
      <AdminLayout>
      <div className="admin-page">
        <h2>Manage Users</h2>
        
          {loading ? (
            <p>Loading users...</p>
          ) : (
            <table className='admin-table'>
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>First Time Buyer</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{(currentPage - 1) * 10 + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{user.isFirstTimeBuyer ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? "active" : ""}
                >
                  {page}
                </button>
              )
            )}
          </div>
      </div>
      </AdminLayout>
  );
};

export default AdminUsers;
