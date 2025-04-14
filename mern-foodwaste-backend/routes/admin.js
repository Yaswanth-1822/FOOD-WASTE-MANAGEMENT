// mern-foodwaste-backend/routes/admin.js
const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcrypt');
const Admin   = require('../models/Admin');

router.post('/admin/login', async (req, res) => {
  try {
    const { adminname, password } = req.body;
    const admin = await Admin.findOne({ adminname });
    if (!admin) return res.status(400).json({ message: 'Invalid adminname or password' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid adminname or password' });

    return res.status(200).json({ message: 'Admin login successful' });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
