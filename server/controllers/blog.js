const { sendResp, sendErr } = require("../helpers/request");
const Blog = require("../models/blog");
const ModelFacade = require("../models/modelFacade");
const blogModel = new ModelFacade(Blog);

exports.findList = async (req, resp) => {
  try {
    const options = { limit: 10, sort: "-created_at" };
    const blogs = await blogModel.findList({}, options);
    if (!blogs || blogs?.length == 0) {
      return sendResp(resp, []);
    }
    blogs.forEach((blog) => {
      blog.content = blog.content.substring(0, 100) + " ...";
    });
    return sendResp(resp, { blogs });
  } catch (error) {
    return sendErr(resp, { err: error.toString() });
  }
};

exports.add = async (req, resp) => {
  const { title } = req.body;
  if (!title) return sendErr(resp, { err: "No Title" });
  const newBlog = new Blog(req.body);
  try {
    const blog = await newBlog.save();
    return sendResp(resp, blog);
  } catch (err) {
    return sendErr(resp, { err: er.toString() });
  }
};

exports.findDetail = async (req, resp) => {
  const blogId = req.params.id;
  if (!blogId) return sendErr(resp, { msg: `Blog Id ${blogId} not found` });
  try {
    const blog = await Blog.findById(blogId);
    if (blog) return sendResp(resp, blog);
    return sendErr(resp, { err: `Blog not found wwith ${blogId}` });
  } catch (err) {
    return sendErr(resp, { err: err.toString() });
  }
};

exports.update = async (req, resp) => {
  let updateblog = req.body;
  updateblog.update_at = new Date();
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateblog, {
      new: true,
    });
    return sendResp(resp, blog);
  } catch (err) {
    return sendErr(resp, { err: err.toString });
  }
};

exports.remove = (req, resp) => {
  Blog.remove({ _id: req.params.id }, (err) => {
    handleError(resp, err);
    return sendResp(resp, "ok");
  });
};

function handleError(resp, err) {
  if (err) {
    return sendErr(resp, err);
  }
}
