const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const Order = require('../models/Order');
const DeliveryPerson = require('../models/DeliveryPerson');

router.get('/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalDonations = await Donation.countDocuments();
    const totalDeliveryPersons = await DeliveryPerson.countDocuments();

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
      {
        $project: {
          _id: 0,
          username: "$user.username",
          count: 1
        }
      }
    ]);

    // Group by year and ISO week number
    const weeklyDonations = await Donation.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%U", date: "$createdAt" } // Weekly format
          },
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
      weeklyDonations
    });
  } catch (err) {
    console.error('Stats Error:', err);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
