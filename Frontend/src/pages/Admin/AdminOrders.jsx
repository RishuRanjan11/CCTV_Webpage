import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminStyles.css";
import { useOrderStore } from "../../stores/useOrderStore";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminOrders = () => {
  const { orders, fetchAllOrders, updateOrderStatus } = useOrderStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewingOrder, setViewingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "descending",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 20;

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // The store action will fetch the orders
        await fetchAllOrders();
      } catch (err) {
        // This catch is a fallback if the store action throws an error
        setError("Failed to fetch orders. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [fetchAllOrders]);

  // Reset to first page whenever filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, sortConfig]);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const filteredOrders = orders.filter((order) => {
    const statusMatch = statusFilter ? order.status === statusFilter : true;

    const dateMatch = dateFilter
      ? new Date(order.createdAt).toISOString().split("T")[0] === dateFilter
      : true;

    const searchLower = searchQuery.toLowerCase();
    const searchMatch = searchQuery
      ? order._id.toLowerCase().includes(searchLower) ||
        order.user?.name.toLowerCase().includes(searchLower) ||
        order.user?.email.toLowerCase().includes(searchLower)
      : true;

    return statusMatch && dateMatch && searchMatch;
  });

  const sortedAndFilteredOrders = useMemo(() => {
    let sortableItems = [...filteredOrders];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date sorting specifically
        if (sortConfig.key === "createdAt") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredOrders, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending";
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setDateFilter("");
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentAdminOrders = sortedAndFilteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(sortedAndFilteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleDownload = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.text("Order Invoice", pageWidth / 2, y, { align: "center" });
    y += 15;

    // --- From and To Section ---
    const fromX = margin;
    const toX = pageWidth / 2 + 10;
    let fromY = y;
    let toY = y;

    // From (Shop Info)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("From:", fromX, fromY);
    fromY += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("CCTV Digital Surveillance", fromX, fromY);
    fromY += 5;
    const shopAddress = doc.splitTextToSize(
      "Saguna More, Balaji Nagar, New Tarachak, Danapur Nizamat, Patna, Danapur, Bihar 801503",
      pageWidth / 2 - margin
    );
    doc.text(shopAddress, fromX, fromY);
    fromY += shopAddress.length * 5;
    doc.text("digitalsurveillance93@gmail.com", fromX, fromY);
    fromY += 5;
    doc.text("+91 7488900700", fromX, fromY);

    // To (Customer & Shipping Info)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("To (Shipping Address):", toX, toY);
    toY += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(order.user?.name || "N/A", toX, toY);
    toY += 5;
    const addressLines = doc.splitTextToSize(
      order.Address,
      pageWidth / 2 - margin - 10
    );
    doc.text(addressLines, toX, toY);
    toY += addressLines.length * 5;
    doc.text(`Phone: ${order.phone}`, toX, toY);

    // Set y to the greater of the two columns, adding a buffer
    y = Math.max(fromY, toY) + 15;

    // Order Info Line
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
    doc.setFontSize(12);
    doc.text(`Order ID: ${order._id}`, margin, y);
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleDateString()}`,
      pageWidth - margin,
      y,
      { align: "right" }
    );
    y += 15;

    // Products Table
    const tableColumn = ["Product Name", "Quantity", "Price", "Subtotal"];
    const tableRows = order.products.map((item) => [
      item.product?.name || "Deleted Product",
      item.quantity,
      `Rs. ${item.price}`,
      `Rs. ${item.quantity * item.price}`,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: y,
      theme: "grid",
      headStyles: { fillColor: [13, 27, 42] }, // #0d1b2a
      margin: { left: margin, right: margin },
    });

    // Total
    let finalY = doc.lastAutoTable.finalY;
    y = finalY + 15;

    // Check if there is enough space for the total, otherwise add a new page
    if (y > pageHeight - margin) {
      doc.addPage();
      y = 20; // Reset Y on new page
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    // Manually calculate position for robust right-alignment
    const totalString = `Total Amount: Rs. ${order.totalAmount}`;
    const totalStringWidth = doc.getTextWidth(totalString);
    doc.text(totalString, pageWidth - margin - totalStringWidth, y);

    // Save the PDF
    doc.save(`order_${order._id}.pdf`);
  };

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
            <>
              <div className="admin-filters">
                <input
                  type="text"
                  placeholder="Search by Order ID, Name, or Email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="filter-input"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="filter-input"
                />
                <button onClick={resetFilters} className="filter-reset-btn">
                  Reset
                </button>
              </div>
              {filteredOrders.length > 0 ? (
                <>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Email</th>
                          <th
                            className="sortable"
                            onClick={() => requestSort("totalAmount")}
                          >
                            Total{" "}
                            {sortConfig.key === "totalAmount" &&
                              (sortConfig.direction === "ascending" ? "🔼" : "🔽")}
                          </th>
                          <th>Status</th>
                          <th
                            className="sortable"
                            onClick={() => requestSort("createdAt")}
                          >
                            Date{" "}
                            {sortConfig.key === "createdAt" &&
                              (sortConfig.direction === "ascending" ? "🔼" : "🔽")}
                          </th>
                          <th>Phone Number</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentAdminOrders.map((order) => (
                          <tr key={order._id}>
                            <td
                              className="clickable-cell"
                              onClick={() => setViewingOrder(order)}
                            >
                              {order._id}
                            </td>
                            <td>{order.user?.name || "N/A"}</td>
                            <td>{order.user?.email || "N/A"}</td>
                            <td>₹{order.totalAmount}</td>
                            <td>
                              <select
                                value={order.status || "Pending"}
                                onChange={(e) =>
                                  handleStatusChange(order._id, e.target.value)
                                }
                                className={`status-select status-badge ${
                                  order.status?.toLowerCase() || "pending"
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td>{order.phone || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
              ) : (
                <p>No orders match your filters.</p>
              )}
            </>
          )}
        </div>
      </main>
      {viewingOrder && (
        <div className="modal-backdrop" onClick={() => setViewingOrder(null)}>
          <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {viewingOrder._id}</p>
            <p><strong>Customer:</strong> {viewingOrder.user?.name || "N/A"} ({viewingOrder.user?.email || "N/A"})</p>
            <p><strong>Phone:</strong> {viewingOrder.phone}</p>
            <p><strong>Address:</strong> {viewingOrder.Address}</p>
            <h4>Products</h4>
            <ul className="order-details-products">
              {viewingOrder.products.map(({ product, quantity, price }) => (
                <li key={product?._id || price}>
                  {quantity} x {product?.name || "Deleted Product"} @ ₹{price} each
                </li>
              ))}
            </ul>
            <p className="order-details-total"><strong>Total:</strong> ₹{viewingOrder.totalAmount}</p>
            <div className="modal-buttons">
              <button onClick={() => handleDownload(viewingOrder)}>Download Details</button>
              <button onClick={() => setViewingOrder(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminOrders;
