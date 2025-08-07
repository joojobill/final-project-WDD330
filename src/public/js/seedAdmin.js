const User = require('../models/User');

async function createAdmin() {
  await User.deleteMany();
  await User.create({
    username: 'admin',
    password: 'tempPassword123' // Change after first login
  });
  console.log('Admin user created!');
  process.exit();
}

createAdmin();