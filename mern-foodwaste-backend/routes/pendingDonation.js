// routes/pendingDonation.js
const express = require('express');
const router = express.Router();
const PendingDonation = require('../models/PendingDonation');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const authenticate = require('../middleware/authenticate');

// 1️⃣ Submit a new donation → save into PendingDonation
router.post('/pending-donations', authenticate, async (req, res) => {
  try {
    // Now also extract location from the request body
    const { donationType, items, location } = req.body;
    const donorId = req.user._id;

    // Convert any base64 images to Buffer
    const processedItems = items.map(item => {
      const newItem = { ...item };
      if (newItem.image) {
        const base64 = newItem.image.replace(/^data:image\/\w+;base64,/, '');
        newItem.image = Buffer.from(base64, 'base64');
      }
      return newItem;
    });

    const pending = new PendingDonation({
      donationType,
      items: processedItems,
      donor: donorId,
      location  // Store the user's location
    });

    await pending.save();
    await pending.populate('donor', 'username');

    // Create a notification for new pending donation
    await Notification.create({
      type: 'donation',
      message: `New donation awaiting approval from ${pending.donor.username}`
    });

    res.status(201).json(pending);
  } catch (err) {
    console.error('Error saving pending donation:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
});

// 2️⃣ (Optional) List approved donations as before
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'username')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(donations);
  } catch (err) {
    console.error('Error fetching donations:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
