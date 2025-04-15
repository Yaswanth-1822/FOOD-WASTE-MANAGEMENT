const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const Donation = require('../models/Donation');
const Order = require('../models/orders');
const router = express.Router();

// Multer setup for image upload
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only .jpeg, .png, or .webp files are allowed!'));
    }
    cb(null, true);
  }
});

// POST /api/user/upload-profile-image
router.post('/upload-profile-image', upload.single('image'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const imageBase64 = req.file.buffer.toString('base64');

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageBase64 },
      { new: true }
    );

    res.json({ message: 'Image uploaded successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

// GET /api/user/:id - Get user profile details
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const profileImage = user.profileImage ? user.profileImage.toString('base64') : null;

    res.json({
      name: user.name,
      email: user.email,
      contact: user.contact || '',
      location: user.location || '',
      charityAccount: user.charityAccount || '',
      profileImage
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// GET /api/user/:id/donations - Get user donations
router.get('/:id/donations', async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.params.id });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching donations' });
  }
});

// GET /api/user/:id/orders - Get user orders
router.get('/:id/orders', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

module.exports = router;
