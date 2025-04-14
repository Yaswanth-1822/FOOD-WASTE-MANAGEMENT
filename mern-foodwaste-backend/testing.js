const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect('mongodb://localhost:27017/foodwastage')
  .then(async () => {
    const hash = await bcrypt.hash('adminPassword123', 10);
    await Admin.create({ adminname: 'superadmin', password: hash });
    console.log('Admin created');
    process.exit();
  });
