// mern-foodwaste-backend/routes/donation.js
const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
// Assume you have authentication middleware to get req.user

// POST /api/donations - create a donation
router.post('/donations', async (req, res) => {
  try {
    const { donationType, items } = req.body;
    // Here, for demo, assume req.user exists (from auth middleware)
    const donorId = req.user ? req.user._id : "607d1a3b8c0f9b0015b4e123"; // demo donor id
    const donation = new Donation({ donationType, items, donor: donorId });
    await donation.save();
    res.status(201).json(donation);
  } catch (error) {
    console.error("Donation POST error:", error);
    res.status(500).json({ message: "Error saving donation" });
  }
});

// GET /api/donations - list all donations (for HomePage)
router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find().limit(20).sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error("Donation GET error:", error);
    res.status(500).json({ message: "Error fetching donations" });
  }
});

module.exports = router;
