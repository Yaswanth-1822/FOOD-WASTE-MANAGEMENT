// mern-foodwaste-backend/routes/donation.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const authenticate = require('../middleware/authenticate'); // use your auth middleware

// POST /api/donations - create a donation; require authentication
router.post('/donations', authenticate, async (req, res) => {
  try {
    const { donationType, items } = req.body;
    // Use the logged-in user's _id as donor
    const donorId = req.user._id;

    // Process each item: convert image from base64 string to Buffer if present
    const processedItems = items.map(item => {
      const newItem = { ...item };
      if (newItem.image) {
        // Remove any data URL prefix (e.g., "data:image/png;base64,")
        const base64Data = newItem.image.replace(/^data:image\/\w+;base64,/, '');
        newItem.image = Buffer.from(base64Data, 'base64');
      }
      return newItem;
    });

    // Create donation with donor set to the logged-in user’s _id
    const donation = new Donation({ donationType, items: processedItems, donor: donorId });
    await donation.save();

    // Populate donor field with username before sending response
    await donation.populate('donor', 'username');
    res.status(201).json(donation);
  } catch (error) {
    console.error("Donation POST error:", error);
    res.status(500).json({ message: "Error saving donation" });
  }
});

// GET /api/donations - list all donations (for HomePage) with populated donor username
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate('donor', 'username') // populate donor with only the username
      .limit(20)
      .sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Donation GET error:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
});

module.exports = router;
