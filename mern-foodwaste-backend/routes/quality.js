// routes/quality.js
const express = require('express');
const router = express.Router();
const PendingDonation = require('../models/PendingDonation');
const Donation = require('../models/Donation');
const sendMail = require('../utils/sendMail');

// 1️⃣ Get all pending donations
router.get('/admin/pending-donations', async (req, res) => {
  try {
    const pendingList = await PendingDonation.find()
      .populate('donor', 'username email')
      .sort({ createdAt: -1 });
    res.json(pendingList);
  } catch (err) {
    console.error('Error fetching pending donations:', err);
    res.status(500).json({ message: err.message });
  }
});

// 2️⃣ Approve a pending donation
router.put('/admin/pending-donations/:id/approve', async (req, res) => {
  try {
    const pending = await PendingDonation.findById(req.params.id).populate('donor', 'username');
    if (!pending) {
      return res.status(404).json({ message: 'Pending donation not found' });
    }

    // Create approved Donation including the location field from pending donation
    const approvedDonation = new Donation({
      donationType: pending.donationType,
      items: pending.items,
      donor: pending.donor._id,
      location: pending.location,   // Include the donor's location
      createdAt: pending.createdAt
    });
    await approvedDonation.save();

    // Remove from pending
    await PendingDonation.findByIdAndDelete(pending._id);

    res.json({ message: 'Donation approved and moved to donations' });
  } catch (err) {
    console.error('Error approving donation:', err);
    res.status(500).json({ message: err.message });
  }
});

// 3️⃣ Reject a pending donation + send email
router.put('/admin/pending-donations/:id/reject', async (req, res) => {
  try {
    const pending = await PendingDonation.findById(req.params.id).populate('donor', 'username email');
    if (!pending) {
      return res.status(404).json({ message: 'Pending donation not found' });
    }

    // Delete the pending donation
    await PendingDonation.findByIdAndDelete(pending._id);

    // Send rejection email
    const subject = 'Your food donation has been rejected';
    const text = `
Hi ${pending.donor.username},

Thank you for submitting your food donation. Unfortunately, it has been rejected due to issues such as:
- Insufficient quantity
- Missing or unclear details
- Quality concerns

Please review and consider resubmitting.

Thanks for contributing to the food-saving mission!
— Food Waste Management Team
    `;
    await sendMail(pending.donor.email, subject, text);

    res.json({ message: 'Donation rejected and donor notified' });
  } catch (err) {
    console.error('Error rejecting donation:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
