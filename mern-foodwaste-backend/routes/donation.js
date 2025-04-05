// mern-foodwaste-backend/routes/donation.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const authenticate = require('../middleware/authenticate');

router.post('/donations', authenticate, async (req, res) => {
  try {
    const { donationType, items } = req.body;
    const donorId = req.user._id;

    // Process each item (if there's an image field, process it; otherwise, pass it along)
    const processedItems = items.map(item => {
      const newItem = { ...item };
      if (newItem.image) {
        const base64Data = newItem.image.replace(/^data:image\/\w+;base64,/, '');
        newItem.image = Buffer.from(base64Data, 'base64');
      }
      return newItem;
    });

    const donation = new Donation({ donationType, items: processedItems, donor: donorId });
    await donation.save();
    // Populate donor with username for response
    await donation.populate('donor', 'username');
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
