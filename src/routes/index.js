const express = require('express');
const router = express.Router();
const Alert = require('../models/database');
const { isAuthenticated } = require('../AuthMiddleware/middleware/auth');

router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.render('index', { alerts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.get('/recommendations/personalized', isAuthenticated, async (req, res) => {
  const [personalized, trending] = await Promise.all([
    getPersonalizedRecommendations(req.user._id),
    tmdb.getTrending()
  ]);
  
  // Merge and deduplicate
  const recommendations = [...new Map([
    ...personalized.map(m => [m.id, m]),
    ...trending.map(m => [m.id, m])
  ]).values()];

  res.render('movies/recommendations', { recommendations });
});

module.exports = router;