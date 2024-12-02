const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  url: String,
  name: String,
  address: String,
  loc: {
    lat: Number,
    lng: Number,
  },
  place_id: String,
  rating: Number,
  ts: {
    type: Date,
    default: Date.now,
  },
  mt: {
    type: Date,
    default: Date.now,
  },
  photos: Array,
  phone: String,
  foodcourt_id: String,
});

RestaurantSchema.pre("save", function (next) {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
