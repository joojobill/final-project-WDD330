const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../AuthMiddleware/middleware/auth');

const Watchlist = require('../models/Watchlist');  // Make sure this exists
const User = require('../models/User');            // Adjust path as needed
const tmdb = require('../services/tmdb');          // If you use this
const Preference = require('../models/Preference'); // If you use prefs

// Add to watchlist
router.post('/add', isAuthenticated, async (req, res) => {
  try {
    const { movieId, title, posterPath } = req.body;

    // Save to Watchlist collection
    await Watchlist.create({
      user: req.user._id,
      movieId,
      title,
      posterPath
    });

    // Also update user's watchlist array
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchlist: { movieId, title, posterPath } } },
      { new: true }
    );

    // Update preferences (optional)
    // const movieDetails = await tmdb.getMovieDetails(movieId);
    // await Preference.updateOne(
    //   { user: req.user._id },
    //   { $addToSet: { genres: { $each: movieDetails.genres } } },
    //   { upsert: true }
    // );

    // res.redirect('back'); // or JSON
    res.json({ success: true });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
