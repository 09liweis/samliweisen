const express = require("express");
const router = express.Router();
const { verify } = require("../helpers/verifyToken");

const {
  findList,
  create,
  findDetail,
  update,
} = require("../controllers/website.js");

router.route("/").get(findList).post(verify, create);

router.route("/:id").get(findDetail).put(verify, update);

module.exports = router;
