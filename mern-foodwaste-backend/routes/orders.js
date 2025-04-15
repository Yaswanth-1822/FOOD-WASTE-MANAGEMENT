// routes/orders.js
const express = require('express');
const router  = express.Router();
const Order   = require('../models/Order');
const User    = require('../models/User');
const DeliveryPerson = require('../models/DeliveryPerson');
const sendMail = require('../utils/sendMail');

// Create
router.post('/orders', async (req, res) => {
  try {
    const { user, items, location } = req.body;
    if (!location) {
      return res.status(400).json({ message: 'Location is required' });
    }

    const order = new Order({ user, items, location });
    await order.save();

    // Optionally notify user
    const u = await User.findById(user);
    if (u && u.email) {
      await sendMail(
        u.email,
        'Order Received',
        `Hi ${u.username},\n\nWe received your order and will process it shortly.\n\nLocation: ${location}`
      );
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read all
router.get('/orders', async (req, res) => {
  const orders = await Order.find()
    .populate('user','username')
    .populate('assignedTo','name email');
  res.json(orders);
});


// Assign → status='in-process', person unavailable, send mails
router.put('/orders/:id/assign', async (req, res) => {
  try {
    const { deliveryPersonId } = req.body;
    if (!deliveryPersonId) return res.status(400).json({ message: 'deliveryPersonId required' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedTo: deliveryPersonId, status: 'in-process' },
      { new: true }
    )
    .populate('user','username email')
    .populate('assignedTo','name email');

    // mark unavailable & track
    await DeliveryPerson.findByIdAndUpdate(deliveryPersonId, {
      isActive: false,
      $addToSet: { assignedOrders: order._id }
    });

    // notify user
    await sendMail(order.user.email,
      'Order Assigned',
      `Hi ${order.user.username},\n\nYour order has been assigned to ${order.assignedTo.name}.\n\nThank you!`
    );
    // notify delivery person
    await sendMail(order.assignedTo.email,
      'New Delivery Assigned',
      `Hi ${order.assignedTo.name},\n\nYou have a new delivery for ${order.user.username}.\n\nPlease proceed.`
    );

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Assign failed' });
  }
});

// Deliver → status='delivered', person available, send mail
router.put('/orders/:id/deliver', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'username email')
      .populate('assignedTo', 'name email');

    if (!order.assignedTo) {
      return res.status(400).json({ message: 'No delivery person assigned' });
    }

    order.status = 'delivered';
    await order.save();

    // mark available & remove from assignedOrders
    await DeliveryPerson.findByIdAndUpdate(order.assignedTo._id, {
      isActive: true,
      $pull: { assignedOrders: order._id }
    });

    // No need for separate populate after save
    // Mail sending
    await sendMail(
      order.user.email,
      'Order Delivered',
      `Hi ${order.user.username},\n\nYour order has been delivered.\n\nEnjoy!`
    );

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Deliver failed' });
  }
});

module.exports = router;

