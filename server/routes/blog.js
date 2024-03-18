const express = require("express");
const router = express.Router();
const { verify } = require("../helpers/verifyToken");

const {
  findList,
  add,
  findDetail,
  update,
  remove,
} = require("../controllers/blog.js");

router.route("/").get(findList).post(verify, add);

router.route("/:id").get(findDetail).put(verify, update).delete(verify, remove);

module.exports = router;
