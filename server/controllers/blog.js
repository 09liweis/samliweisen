const { sendResp, sendErr } = require('../helpers/request');
const Blog = require('../models/blog');

exports.findList = async (req, resp) => {
  try {
    const blogs = await Blog.find({}, '_id title url content created_at', { limit: 10 }).sort('-created_at');
    blogs.forEach((blog) => {
      blog.content = blog.content.substr(0, 100) + ' ...';
    });
    return sendResp(resp, blogs);
  } catch (error) {
    return sendErr(resp, {err: error.toString()});
  }
};

exports.add = (req, resp) => {
  const newBlog = new Blog(req.body);
  newBlog.save((err, blog) => {
    handleError(resp, err);
    return sendResp(resp, blog);
  });
};

exports.findDetail = async (req, resp) => {
  const blogId = req.params.id;
  if (!blogId) return sendErr(resp, {msg:`Blog Id ${blogId} not found`});
  try {
    const blog = await Blog.findById(blogId);
    return sendResp(resp, blog);
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};

exports.update = async (req, resp) => {
  let updateblog = req.body;
  updateblog.update_at = new Date();
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateblog, { new: true});
    return sendResp(resp, blog);
  } catch (err) {
    return sendErr(resp, {err: err.toString});
  }
};

exports.remove = (req, resp) => {
  Blog.remove({ _id: req.params.id }, (err) => {
    handleError(resp, err);
    return sendResp(resp, 'ok');
  });
};

function handleError(resp, err) {
  if (err) {
    return sendErr(resp, err);
  }
}