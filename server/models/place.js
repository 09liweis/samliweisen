const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
  name: String,
  address: String,
  lat: String,
  lng: String,
  place_id: String,
  rating:Number,
  icon:String,
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  photos:Array,
  types:Array,
  transactions:Array
});

module.exports = mongoose.model('Place', PlaceSchema);