const express = require('express');
const router = express.Router();
const Alert = require('../models/database');
const { isAuthenticated } = require('../middleware/auth');


// Edit Alert Form
router.get('/admin/alerts/:id/edit', isAuthenticated, async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  res.render('admin/edit-alert', { alert });
});

// Update Alert
router.post('/admin/alerts/:id', isAuthenticated, async (req, res) => {
  const { message, background, color } = req.body;
  await Alert.findByIdAndUpdate(req.params.id, { message, background, color });
  res.redirect('/admin');
});

// Admin Dashboard
router.get('/admin', isAuthenticated, async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });
  res.render('admin/dashboard', { alerts, user: req.user });
});

// Add New Alert
router.post('/admin/alerts', isAuthenticated, async (req, res) => {
  try {
    const { message, background, color } = req.body;
    await Alert.create({ message, background, color });
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.redirect('/admin?error=1');
  }
});

// Delete Alert
router.post('/admin/alerts/:id/delete', isAuthenticated, async (req, res) => {
  await Alert.findByIdAndDelete(req.params.id);
  res.redirect('/admin');
});

// Protected Route
router.get('/admin/settings', 
  isAuthenticated, 
  hasRole('admin'), 
  (req, res) => res.render('admin/settings')
);

module.exports = router;