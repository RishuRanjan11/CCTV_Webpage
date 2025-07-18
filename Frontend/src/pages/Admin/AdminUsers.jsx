import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../lib/axios';
import AdminLayout from '../../components/AdminLayout';
import './AdminStyles.css';
import { toast } from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const usersPerPage = 10; // Define for clarity in S.No. calculation

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null); // Reset error on new fetch
    try {
      const response = await axios.get('/admin/customers', {
        params: { page: currentPage, search: debouncedSearchQuery },
      });
      setUsers(response.data.customers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to page 1 whenever a new search is performed
  useEffect(() => {
    if (debouncedSearchQuery) {
      setCurrentPage(1);
    }
  }, [debouncedSearchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully.");
      // If the deleted user was the only one on the current page, go back one page.
      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Otherwise, just refetch the current page's data
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const pageNeighbours = 1; // How many pages to show on each side of the current page

    // Always add the first page
    pageNumbers.push(1);

    // Add left ellipsis if needed
    if (currentPage > pageNeighbours + 2) {
      pageNumbers.push("...");
    }

    // Add pages around the current page
    const startPage = Math.max(2, currentPage - pageNeighbours);
    const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add right ellipsis if needed
    if (currentPage < totalPages - pageNeighbours - 1) {
      pageNumbers.push("...");
    }

    // Always add the last page if it's not already included
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return (
      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &laquo; Prev
        </button>
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          }
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (users.length === 0) return <p>No users found.</p>;

    return (
      <>
        <div className="admin-filters">
          <input
            type="text"
            placeholder="Search by Name or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="admin-table-wrapper">
          <table className='admin-table'>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>First Time Buyer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{(currentPage - 1) * usersPerPage + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || 'N/A'}</td>
                  <td>{user.isFirstTimeBuyer ? "Yes" : "No"}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {renderPagination()}
      </>
    );
  };

  return (
      <AdminLayout>
      <div className="admin-page">
        <h2>Manage Users</h2>
        {renderContent()}
      </div>
      </AdminLayout>
  );
};

export default AdminUsers;
