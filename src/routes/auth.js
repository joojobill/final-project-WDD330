const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const protect = require('../AuthMiddleware/middleware/protect');

// Render registration + login pages
router.get('/register', (req, res) => res.render('admin/register'));
router.get('/user-login', (req, res) => res.render('admin/login'));

// Auth API routes
router.post('/register', register);
router.post('/user-login', login);

// Protected route
router.get('/me', protect, getMe);

module.exports = router;
