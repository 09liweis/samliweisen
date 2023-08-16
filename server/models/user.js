const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  eml: String,
  nm: String,
  pwd: String,
  roles: Array,
  lts: Date, //Last Login
  githubId: Number,
  created_at: {
    type: Date,
    default: Date.now
  },
  update_at: {
    type: Date,
    default: Date.now
  }
});
UserSchema.pre('save', (next) => {
  const currentDate = new Date();
  this.update_at = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});
module.exports = mongoose.model('User', UserSchema);