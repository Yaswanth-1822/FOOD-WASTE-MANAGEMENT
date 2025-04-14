const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get latest 30 notifications
router.get('/admin/notifications', async (req, res) => {
  const logs = await Notification.find().sort({ createdAt: -1 }).limit(30);
  res.json(logs);
});
router.delete('/admin/notifications', async (req, res) => {
    await Notification.deleteMany({});
    res.json({ message: 'All notifications cleared' });
  });
  
module.exports = router;
