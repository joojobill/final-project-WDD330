// services/recommendations.js
async function getPersonalizedRecommendations(userId) {
  const prefs = await Preference.findOne({ user: userId });
  const { data } = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
    params: {
      with_genres: prefs.genres.slice(0, 3).join(','),
      'vote_average.gte': prefs.minRating,
      sort_by: 'popularity.desc'
    }
  });
  return data.results;
}