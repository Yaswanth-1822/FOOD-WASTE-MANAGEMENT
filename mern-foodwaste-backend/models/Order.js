const mongoose = require('mongoose'); // Add this at the top

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ donationId: String, itemIndex: Number }],
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DeliveryPerson', 
    default: null
  },
  status: { 
    type: String, 
    enum: ['pending','in-process','delivered'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);