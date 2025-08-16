const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, { httpOnly: true });
    res.redirect('/admin/dashboard');
  } catch (err) {
    console.error(err);
    res.render('/admin/register', { error: 'Failed to register user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.render('admin/login', { error: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.render('admin/login', { error: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  res.render('dashboard', { user: req.user });
};
