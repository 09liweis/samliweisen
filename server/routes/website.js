const express = require("express");
const router = express.Router();
const { verify } = require("../helpers/verifyToken");

const {
  findList,
  create,
  update,
} = require("../controllers/website.js");

router.route("/").get(verify, findList).post(verify, create);

router.route("/:id").put(verify, update);

module.exports = router;
