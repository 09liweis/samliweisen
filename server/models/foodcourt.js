const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FoodcourtSchema = new Schema({
  name: String,
  address: String,
  loc:{
    lat: Number,
    lng: Number,
  },
  place_id: String,
  rating:Number,
  ts: {
    type: Date,
    default: Date.now
  },
  mt: {
    type: Date,
    default: Date.now
  },
  photos:Array,
});

FoodcourtSchema.pre('save', function(next) {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model('Foodcourt', FoodcourtSchema);