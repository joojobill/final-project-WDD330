const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  watchlist: [{
    movieId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    posterPath: String,
    addedAt: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add movie to watchlist
userSchema.methods.addToWatchlist = async function(movieData) {
  // Check if movie already exists in watchlist
  const exists = this.watchlist.some(movie => 
    movie.movieId === movieData.movieId
  );
  
  if (exists) {
    throw new Error('Movie already in watchlist');
  }

  this.watchlist.push(movieData);
  return this.save();
};

// Method to remove movie from watchlist
userSchema.methods.removeFromWatchlist = async function(movieId) {
  this.watchlist = this.watchlist.filter(
    movie => movie.movieId !== movieId
  );
  return this.save();
};

// Method to rate movie in watchlist
userSchema.methods.rateMovie = async function(movieId, rating) {
  const movie = this.watchlist.find(
    movie => movie.movieId === movieId
  );
  
  if (!movie) {
    throw new Error('Movie not found in watchlist');
  }

  movie.rating = rating;
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User;