// routes/delivery.js
const express = require('express');
const router  = express.Router();
const DeliveryPerson = require('../models/DeliveryPerson');

// Create
router.post('/delivery-persons', async (req, res) => {
  try {
    const dp = new DeliveryPerson(req.body);
    await dp.save();
    res.status(201).json(dp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all
router.get('/delivery-persons', async (req, res) => {
  const list = await DeliveryPerson.find();
  res.json(list);
});

// Update (edit or toggle isActive)
router.put('/delivery-persons/:id', async (req, res) => {
  try {
    const dp = await DeliveryPerson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
router.delete('/delivery-persons/:id', async (req, res) => {
  await DeliveryPerson.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
