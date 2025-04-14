// models/DeliveryPerson.js
const mongoose = require('mongoose');

const DeliveryPersonSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  email:         { type: String, required: true, unique: true },
  phone:         { type: String, required: true },
  isActive:      { type: Boolean, default: true }, // availability
  assignedOrders:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPerson', DeliveryPersonSchema);
