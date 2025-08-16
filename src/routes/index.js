const express = require('express');
const router = express.Router();
const Alert = require('../models/database');
const { isAuthenticated } = require('../AuthMiddleware/middleware/authMiddleware');
const tmdb = require('../services/tmdb');
const User = require('../models/User');

// Helper function for recommendations
const getPersonalizedRecommendations = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];
    
    // Implement your recommendation logic here
    // Example: Get movies similar to user's watchlist
    return []; // Return mock data for now
  } catch (err) {
    console.error('Recommendation error:', err);
    return [];
  }
};

// Public route - Get all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.render('index', { 
      alerts,
      title: 'Home Page'
    });
  } catch (err) {
    console.error('Alert fetch error:', err);
    res.status(500).render('error', { 
      message: 'Failed to load alerts',
      title: 'Error'
    });
  }
});

// Protected route - Personalized recommendations
router.get('/recommendations/personalized', 
  isAuthenticated, 
  async (req, res) => {
    try {
      const [personalized, trending] = await Promise.all([
        getPersonalizedRecommendations(req.user._id),
        tmdb.getTrending()
      ]);

      // Merge and remove duplicates
      const recommendations = [...new Map([
        ...personalized.map(movie => [movie.id, movie]),
        ...trending.map(movie => [movie.id, movie])
      ]).values()];

      res.render('movies/recommendations', {
        recommendations,
        user: req.user,
        title: 'Your Recommendations'
      });

    } catch (err) {
      console.error('Recommendation error:', err);
      res.status(500).render('error', {
        message: 'Failed to load recommendations',
        title: 'Error'
      });
    }
  }
);

// Test protected route
router.get('/test-auth', isAuthenticated, (req, res) => {
  res.json({
    success: true,
    message: 'You accessed a protected route',
    user: {
      id: req.user._id,
      username: req.user.username
    }
  });
});

module.exports = router;
console.log('Middleware is:', typeof isAuthenticated); // Should log "function"