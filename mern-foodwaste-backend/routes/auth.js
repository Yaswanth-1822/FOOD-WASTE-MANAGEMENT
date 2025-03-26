const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

/**
 * POST /api/signup
 * Create a new user with hashed password
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error in /signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/signin
 * Authenticate a user with username and password
 */
router.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Incorrect username or password' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect username or password' });
    }

    // If valid, respond with success
    return res.status(200).json({ message: 'Sign in successful', user });
  } catch (error) {
    console.error('Error in /signin:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * POST /api/forgot-password
 * Update user password given username and new password
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error in /forgot-password:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
