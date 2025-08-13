const preferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  genres: [String],
  likedDirectors: [String],
  minRating: { type: Number, default: 6 }
});