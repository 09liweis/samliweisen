var express = require("express");
var router = express.Router();

const Comment = require("../models/comment");

router.get("/", (req, res, next) => {
  const limit = parseInt(req.query.limit) || 5;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  Comment.find({})
    .sort("-created_at")
    .skip(skip)
    .limit(limit)
    .then((comments) => {
      return Comment.countDocuments().then((total) => {
        res.send({
          comments,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        });
      });
    })
    .catch((err) => {
      if (err) throw err;
    });
});

router.post("/", (req, res, next) => {
  const name = req.body.name;
  const content = req.body.content;
  const comment = Comment({
    ip: req.ip,
    name: name,
    content: content,
  });

  comment.save()
    .then(() => res.send(comment))
    .catch((err) => { throw err; });
});

module.exports = router;
