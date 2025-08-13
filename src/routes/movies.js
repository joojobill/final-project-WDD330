const express = require('express');
const router = express.Router();
const tmdb = require('../services/tmdb');

router.get('/', async (req, res) => {
  const movies = await tmdb.getTrending();
  res.render('movies/index', {
    movies,
    user: req.user // Make sure this is passed
  });
});

router.get('/movies/:id/recommendations', async (req, res) => {
  const recommendations = await tmdb.getRecommendations(req.params.id);
  res.render('movies/recommendations', { recommendations });
});

module.exports = router;