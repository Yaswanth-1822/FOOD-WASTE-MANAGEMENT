// routes/donation.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const authenticate = require('../middleware/authenticate');
const Notification = require('../models/Notification');

router.post('/donations', authenticate, async (req, res) => {
  try {
    // Extract donationType, items and location from the request body
    const { donationType, items, location } = req.body;
    const donorId = req.user._id;

    const processedItems = items.map(item => {
      const newItem = { ...item };
      if (newItem.image) {
        const base64Data = newItem.image.replace(/^data:image\/\w+;base64,/, '');
        newItem.image = Buffer.from(base64Data, 'base64');
      }
      return newItem;
    });

    const donation = new Donation({ 
      donationType, 
      items: processedItems, 
      donor: donorId,
      location  // Store the user's location
    });
    await donation.save();

    // Populate donor information before accessing donor.username
    await donation.populate('donor', 'username');

    await Notification.create({
      type: 'donation',
      message: `New donation submitted by ${donation.donor.username}`
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error("Donation POST error:", error);
    res.status(500).json({ message: error.message || "Error saving donation" });
  }
});

router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'username')
      .limit(20)
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Donation GET error:", error);
    res.status(500).json({ message: error.message || "Error fetching donations" });
  }
});

module.exports = router;
