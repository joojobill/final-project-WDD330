const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  message: String,
  background: String,
  color: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);