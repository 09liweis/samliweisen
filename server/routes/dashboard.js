var express = require("express");
var router = express.Router();
const Blog = require("../models/blog");
const Experience = require("../models/experience");
const Project = require("../models/project");

router.route("/").get(async function (req, resp) {
  try {
    const blogs = await Blog.countDocuments();
    const exs = await Experience.countDocuments();
    const projs = await Project.countDocuments();
    resp.status(200).json({ blogs, exs, projs });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
