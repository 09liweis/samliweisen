var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const commentSchema = new Schema({
  name: String,
  content: String,
  ip: String,
  created_at: Date,
  updated_at: Date
});

commentSchema.pre('save', function(next) {
  const currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at) {
      this.created_at = currentDate;
  }
  next();
});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;