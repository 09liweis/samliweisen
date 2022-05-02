const {sendResp, sendErr} = require('../helpers/request');
const Blog = require('../models/blog');

exports.findList = (req, resp) => {
  Blog.find({}, '_id title url content image category published created_at',{limit:10}).sort('-created_at').exec((err, blogs) => {
    handleError(resp, err);
    return sendResp(resp,blogs);
  });
};

exports.add = (req, resp) => {
  const newBlog = new Blog(req.body);
  newBlog.save((err, blog) => {
    handleError(resp, err);
    return sendResp(resp,blog);
  });
};

exports.findDetail = (req, resp) => {
  Blog.findById(req.params.id, (err, blog) => {
    handleError(resp, err);
    return sendResp(resp,blog);
  });
};

exports.update = (req, resp) => {
  let updateblog = req.body;
  updateblog.update_at = new Date();
  Blog.findOneAndUpdate({_id: req.params.id}, updateblog, {upsert: true}, (err, blog) => {
    handleError(resp, err);
    return sendResp(resp,blog);
  });
};

exports.remove = (req, resp) => {
  Blog.remove({_id: req.params.id}, (err) => {
    handleError(resp, err);
    return sendResp(resp,'ok');
  });
};

function handleError(resp, err) {
  if (err) {
    return sendErr(resp,err);
  }
}