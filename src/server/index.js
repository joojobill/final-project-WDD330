require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const movieRoutes = require('../routes/movies');
const session = require('express-session');
const passport = require('passport');

const app = express();

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Routes
app.use('/', require('../routes/index'));
app.use('/alerts', require('../routes/alerts'));
app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Auth Routes
app.get('/login', (req, res) => res.render('admin/login'));
app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/admin',
    failureRedirect: '/login?error=1'
  })
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Admin Dashboard
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.redirect('/login');
  }
  res.render('admin/dashboard');
});

// Admin Movies Management
app.get('/admin/index', (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.redirect('/login');
  }
  res.render('admin/index', { title: 'Manage Movies' });
});

app.get('/alerts', (req, res) => {
  res.render('admin/alerts', { title: 'Alerts', alert: null });
});

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});   


// 404 Handler

