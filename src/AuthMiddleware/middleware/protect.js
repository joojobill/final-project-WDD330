const jwt = require('jsonwebtoken');
const User = require('../../models/User');

module.exports = async function protect(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) return res.redirect('/user-login');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id).select('-password');
    if (!user) return res.redirect('/user-login');

    req.user = user;
    next();
  } catch (err) {
    return res.redirect('/user-login');
  }
};
