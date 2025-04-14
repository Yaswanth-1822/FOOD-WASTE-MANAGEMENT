const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['donation', 'order', 'delivery', 'email'], required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);
