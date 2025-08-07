// routes/alerts.js
const express = require('express');
const Alert = require('../models/database'); // Adjust the path as necessary
const router = express.Router();

// Get all alerts (API endpoint)
router.get('/api/alerts', async (req, res) => {
  try {
    const alerts = await Alert.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/api/alerts', async (req, res) => {
  try {
    const newAlert = new Alert(req.body);
    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;