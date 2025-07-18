import User from '../models/user.model.js';

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
