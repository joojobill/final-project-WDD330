const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  movieId: String,
  title: String,
  posterPath: String,
  addedAt: { type: Date, default: Date.now }
});