var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const commentSchema = new Schema({
  name: String,
  content: String,
  ip: String,
  created_at: Date,
  updated_at: Date
});

var Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;