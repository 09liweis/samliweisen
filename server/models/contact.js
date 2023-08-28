var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the task'
  },
  groups: [String],
  ts: {
    type: Date,
    default: Date.now
  },
  mt: {
    type: Date,
    default: Date.now
  }
});

ContactSchema.pre('save', (next) => {
  const currentDate = new Date();
  this.mt = currentDate;
  if (!this.ts) {
    this.ts = currentDate;
  }
  next();
});

module.exports = mongoose.model('Contact', ContactSchema);