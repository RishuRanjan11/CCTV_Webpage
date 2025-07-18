import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminStyles.css";
import { useOrderStore } from "../../stores/useOrderStore";

const AdminOrders = () => {
  const { orders, fetchAllOrders } = useOrderStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

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
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(0, 8)}...</td>
                    <td>{order.user.name || "N/A"}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          order.status?.toLowerCase() || "pending"
                        }`}
                      >
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.phone || "N/A"}</td>
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
