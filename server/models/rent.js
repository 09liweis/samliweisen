var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RentSchema = new Schema({
  nm: String,
  isAvailable: Number,
  startDate:String,
  endDate:String,
  cmts:String,//comments
  ts: {
    type: Date,
    default: Date.now
  },
  mt: {
    type: Date,
    default: Date.now
  },
});

RentSchema.pre('save', (next) => {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model('Rent', RentSchema);