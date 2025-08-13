router.post('/add', isAuthenticated, async (req, res) => {
  const { movieId, title, posterPath } = req.body;
  await Watchlist.create({ 
    user: req.user._id, 
    movieId, 
    title, 
    posterPath 
  });
  res.redirect('back');
});

// In watchlist route
router.post('/add', isAuthenticated, async (req, res) => {
    const { movieId, title, posterPath } = req.body;
    try {
        const watchlistItem = await Watchlist.create({
            user: req.user._id,
            movieId,
            title,
            posterPath
        });

        // Update preferences
        const movieDetails = await tmdb.getMovieDetails(movieId);
        await Preference.updateOne(
            { user: req.user._id },
            { $addToSet: { genres: { $each: movieDetails.genres } } },
            { upsert: true }
        );
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        res.status(500).send("Internal Server Error");
    }
});