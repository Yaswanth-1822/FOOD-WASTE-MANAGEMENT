// models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donationType: { type: String, enum: ['homemade', 'packed'], required: true },
  items: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    quantityUnit: { type: String },
    image: { type: Buffer },
    timeSinceMade: { type: String },
    madeDate: { type: Date },
    expiryDate: { type: Date }
  }],
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true }, // New field to store the donor's location
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
