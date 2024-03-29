var express = require('express');
var router = express.Router();

const Comment = require('../models/comment');

router.get('/', (req, res, next) => {
  let commentLimit = 5;
  const {limit} = req.body;
  if (limit) {
    commentLimit = limit;
  }
  Comment.find({},'',{limit:commentLimit}).sort('-created_at').exec((err, comments) => {
    if (err) throw err;
    res.send(comments);
  });
});

router.post('/', (req, res, next) => {
  const name = req.body.name;
  const content = req.body.content;
  const comment = Comment({
    ip: req.ip,
    name: name,
    content: content
  });

  comment.save((err) => {
    if (err) throw err;
    res.send(comment);
  });
});

module.exports = router;
