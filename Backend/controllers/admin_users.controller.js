import User from '../models/user.model.js';

export const getCustomersWithFirstTimeBuyerStatus = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page from query, default to 1
    const limit = 10; // Customers per page
    const skip = (page - 1) * limit;

    const customers = await User.find({ role: 'customer' })
      .select('name email phone isFirstTimeBuyer')
      .skip(skip)
      .limit(limit);

    const totalCustomers = await User.countDocuments({ role: 'customer' });
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
