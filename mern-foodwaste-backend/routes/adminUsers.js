const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Donation = require('../models/Donation');
const Order = require('../models/Order');

// GET all users with activity summary
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password field

    const userStats = await Promise.all(users.map(async (user) => {
      const donations = await Donation.find({ donor: user._id });
      const orders = await Order.find({ user: user._id });

      return {
        ...user.toObject(),
        totalDonations: donations.length,
        totalOrders: orders.length
      };
    }));

    res.json(userStats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
