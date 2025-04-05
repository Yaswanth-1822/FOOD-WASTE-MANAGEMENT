// mern-foodwaste-backend/models/Donation.js
const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donationType: { type: String, enum: ['homemade', 'packed'], required: true },
  items: [{
    name: { type: String, required: true },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    quantityUnit: { type: String }, // e.g., 'Kg', 'Liters', 'Pcs', 'Boxes'
    image: { type: Buffer },         // Now storing image as a Buffer
    timeSinceMade: { type: String },
    madeDate: { type: Date },
    expiryDate: { type: Date }
  }],
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
