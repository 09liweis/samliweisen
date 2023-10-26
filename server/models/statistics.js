const mongoose = require('mongoose');
const { Schema } = mongoose;

const StatisticsSchema = new Schema({
  name: String, //todo,movie,blog,comment,
  details: Object, //{pending:Number, done:Number, in_progress:Number,total:Number}
  ts: {
    type: Date,
    default: Date.now
  },
  mt: {
    type: Date,
    default: Date.now
  }
});

StatisticsSchema.pre('save', function(next) {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model('Statistics', StatisticsSchema);