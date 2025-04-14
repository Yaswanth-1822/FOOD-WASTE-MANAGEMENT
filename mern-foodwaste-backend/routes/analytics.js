// mern-foodwaste-backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPerson');

/**
 * GET /api/admin/stats
 * Returns summary counts, monthly donation trends, and top donors.
 */
router.get('/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalDeliveryPersons = await DeliveryPerson.countDocuments();

    // Top 5 donors by number of donations
    const recentDonors = await Donation.aggregate([
      { $group: { _id: "$donor", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $project: { _id: 0, username: "$user.username", count: 1 } }
    ]);

    // Monthly donation counts (YYYY‑MM)
    const monthlyDonations = await Donation.aggregate([
      {
        $group: {
          _id: { $substr: ["$createdAt", 0, 7] },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalDonations,
      totalDeliveryPersons,
      recentDonors,
      monthlyDonations
    });
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
