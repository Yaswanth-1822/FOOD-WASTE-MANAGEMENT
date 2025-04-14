// mern-foodwaste-backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const donationRoutes = require('./routes/donation');
const deliveryRoutes = require('./routes/delivery');
const orderRoutes = require('./routes/orders');
const adminUsersRoutes = require('./routes/adminUsers');
const qualityRoutes = require('./routes/quality');
const adminStats = require('./routes/adminDashboard');
const notificationsRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');
const pendingDonationRoutes = require('./routes/pendingDonation');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', pendingDonationRoutes);
app.use('/api', donationRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminUsersRoutes);
app.use('/api', qualityRoutes);
app.use('/api', adminStats);
app.use('/api', notificationsRoutes);
app.use('/api', analyticsRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
