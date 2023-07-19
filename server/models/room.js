var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoomSchema = new Schema({
  nm: String,
  isAvailable: Boolean,
  startDate: String,
  endDate: String,
  cmts: String,//comments
  lastChecked: {
    type: Date
  },
  ts: {
    type: Date,
    default: Date.now
  },
  mt: {
    type: Date,
    default: Date.now
  },
});

RoomSchema.pre('save', (next) => {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model('Room', RoomSchema);