import User from '../models/user.model.js';
import Product from '../models/product.model.js';
import Order from '../models/order.model.js';

export const getCustomersWithFirstTimeBuyerStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page from query, default to 1
    const limit = 10; // Customers per page
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    // Build the filter query
    const query = { role: "customer" };
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for name
        { email: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search for email
      ];
    }

    const customers = await User.find(query)
      .select("name email phone isFirstTimeBuyer")
      .skip(skip)
      .limit(limit);

    const totalCustomers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCustomers / limit);

    res.status(200).json({
      customers,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(
      'Error in getCustomersWithFirstTimeBuyerStatus controller:',
      error,
    );
    res.status(500).json({
      message: 'Error fetching customer data',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Safeguard: Prevent an admin from deleting their own account.
    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account." });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser controller:", error);
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // --- User Stats ---
    const totalUsers = await User.countDocuments({ role: "customer" });
    const firstTimeBuyers = await User.countDocuments({
      role: "customer",
      isFirstTimeBuyer: true,
    });

    // --- Product Stats ---
    const totalProducts = await Product.countDocuments();

    // --- Order Stats ---
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)), // Include the whole end day
      };
    }

    // --- Chart Data Aggregation ---
    const { groupBy = 'month', year, month } = req.query;
    const matchStage = { status: { $ne: "Cancelled" } };
    let groupStage = {};

    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    if (groupBy === 'year') {
      // Group by year across all time
      groupStage = { _id: { $year: "$createdAt" }, totalSales: { $sum: "$totalAmount" } };
    } else if (groupBy === 'month') {
      // Group by month for a specific year
      matchStage.createdAt = {
        $gte: new Date(`${targetYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${targetYear + 1}-01-01T00:00:00.000Z`),
      };
      groupStage = { _id: { $month: "$createdAt" }, totalSales: { $sum: "$totalAmount" } };
    } else { // Default to 'day'
      // Group by day for a specific month and year
      const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
      const startDate = new Date(targetYear, targetMonth - 1, 1);
      const endDate = new Date(targetYear, targetMonth, 1);
      matchStage.createdAt = { $gte: startDate, $lt: endDate };
      groupStage = { _id: { $dayOfMonth: "$createdAt" }, totalSales: { $sum: "$totalAmount" } };
    }

    const salesData = await Order.aggregate([
      { $match: matchStage },
      { $group: groupStage },
      { $sort: { _id: 1 } }, // Sort by date
    ]);

    // --- Card Stats (uses separate dateFilter) ---
    const orders = await Order.find(dateFilter);

    let totalSales = 0;
    const totalOrders = orders.length;
    let pendingOrders = 0;
    let shippedOrders = 0;
    let deliveredOrders = 0;

    orders.forEach(order => {
      if (order.status !== "Cancelled") {
        totalSales += order.totalAmount;
      }
      if (order.status === "Pending") pendingOrders++;
      if (order.status === "Shipped") shippedOrders++;
      if (order.status === "Delivered") deliveredOrders++;
    });

    res.status(200).json({
      totalUsers,
      firstTimeBuyers,
      totalProducts,
      totalSales,
      totalOrders,
      orderStatusCounts: {
        pending: pendingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders,
      },
      salesData, // Add this for the chart
    });
  } catch (error) {
    console.error("Error in getDashboardStats controller:", error);
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message,
    });
  }
};
