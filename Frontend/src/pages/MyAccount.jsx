import React, { useEffect, useState } from 'react';
import { useUserStore } from '../stores/useUserStore';
import { useOrderStore } from '../stores/useOrderStore';
import './MyAccount.css';

const MyAccount = () => {
  const { user, updateProfile, changePassword, loading: userLoading } = useUserStore();
  const { myOrders, fetchMyOrders, loading } = useOrderStore();
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    if (user) {
      fetchMyOrders();
      setPhone(user.phone || "");
    }
  }, [user, fetchMyOrders]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter]);

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handlePhoneSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ phone });
      setShowPhoneModal(false); // Close modal on success
    } catch (error) {
      // Error is already toasted in the store
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      alert("New passwords do not match."); // Using alert for simplicity, toast can be used
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      // Clear password fields on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowPasswordModal(false); // Close modal on success
    } catch (error) {
      // Error is already toasted in the store
      console.error("Password change failed");
    }
  };

  const filteredMyOrders = myOrders.filter((order) => {
    const statusMatch = statusFilter ? order.status === statusFilter : true;

    const dateMatch = dateFilter
      ? new Date(order.createdAt).toISOString().split("T")[0] === dateFilter
      : true;

    return statusMatch && dateMatch;
  });

  const resetFilters = () => {
    setStatusFilter("");
    setDateFilter("");
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredMyOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredMyOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (!user) {
    // This case is mostly handled by the protected route, but it's good practice.
    return <p>Please log in to view your account.</p>;
  }

  return (
    <div className="account-container">
      <h2>My Account</h2>

      <section className="account-section">
        <h3>Personal Details</h3>
        <div className="detail-item">
          <strong>Name:</strong> {user.name}
        </div>
        <div className="detail-item"><strong>Email:</strong> {user.email}</div>
        <div className="detail-item"><strong>Phone:</strong> {user.phone || 'Not provided'}</div>
        <div className="account-actions">
          <button className="edit-btn" onClick={() => setShowPhoneModal(true)}>Update Phone</button>
          <button className="edit-btn" onClick={() => setShowPasswordModal(true)}>Change Password</button>
        </div>
      </section>

      <section className="account-section">
        <h3>My Orders</h3>
        {!loading && myOrders.length > 0 && (
          <div className="my-orders-filters">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
            <button onClick={resetFilters}>Reset</button>
          </div>
        )}
        {loading ? (
          <p>Loading your orders...</p>
        ) : myOrders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : filteredMyOrders.length === 0 ? (
          <p>No orders match your filters.</p>
        ) : (
          <>
            <div className="orders-list">
              {currentOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <p><strong>Order ID:</strong> {order._id}</p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.createdAt)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "--")}
                      </p>
                    </div>
                    <div>
                      <p><strong>Total:</strong> Rs. {order.totalAmount}</p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span
                          className={`status-badge ${order.status.toLowerCase()}`}
                        >
                          {order.status}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="order-card-body">
                    <h4>Products:</h4>
                    <ul>
                      {order.products.map(({ product, quantity, _id }) => (
                        <li key={product?._id || _id}>
                          {quantity} x {product?.name || "Deleted Product"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>&laquo; Prev</button>
                {[...Array(totalPages).keys()].map((number) => (
                  <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? "active" : ""}>{number + 1}</button>
                ))}
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>Next &raquo;</button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Update Phone Modal */}
      {showPhoneModal && (
        <div className="modal-backdrop" onClick={() => setShowPhoneModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Update Phone Number</h3>
            <form className="edit-form" onSubmit={handlePhoneSave}>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowPhoneModal(false)}>Cancel</button>
                <button type="submit" disabled={userLoading}>{userLoading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="modal-backdrop" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Change Password</h3>
            <form className="edit-form" onSubmit={handlePasswordSave}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-wrapper">
                  <input type={showCurrentPassword ? "text" : "password"} id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                  <button type="button" className="toggle-password" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-wrapper">
                  <input type={showNewPassword ? "text" : "password"} id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                  <button type="button" className="toggle-password" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z"/><path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.83-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z"/></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/></svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" disabled={userLoading}>{userLoading ? 'Changing...' : 'Change Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAccount;
