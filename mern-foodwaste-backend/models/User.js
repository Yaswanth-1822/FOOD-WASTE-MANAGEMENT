const mongoose = require('mongoose');

// Create a schema for the user
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'],
    default: 'user'
  },
  // New field to store the user's location
  location: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Create the model
const User = mongoose.model('User', UserSchema);

module.exports = User;
