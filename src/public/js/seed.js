const Alert = require('../models/database');
const alerts = [
  { message: "New movies added weekly!", background: "#2c3e50", color: "white" },
  { message: "Summer sale - 20% off subscriptions", background: "#e67e22", color: "#fff" }
];

async function seedDB() {
  await Alert.deleteMany();
  await Alert.insertMany(alerts);
  console.log('Database seeded!');
  process.exit();
}

seedDB();