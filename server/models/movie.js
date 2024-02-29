const mongoose = require("mongoose");
const { Schema } = mongoose;

const MovieSchema = new Schema({
  title: String,
  douban_id: String,
  douban_rating: Number,
  poster: String,
  summary: String,
  imdb_id: String,
  imdb_rating: Number,
  visual_type: String,
  genres: [String],
  languages: [String],
  countries: [String],
  current_episode: {
    type: Number,
    default: 0,
  },
  episodes: {
    type: Number,
    default: 1,
  },
  date_watched: {
    type: Date,
    default: Date.now,
  },
  date_updated: {
    type: Date,
    default: Date.now,
  },
});

MovieSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.date_updated = currentDate;
  if (!this.date_watched) {
    this.date_watched = currentDate;
  }
  next();
});

module.exports = mongoose.model("Visual", MovieSchema);
