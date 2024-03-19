const express = require("express");
const router = express.Router();

const { findList, findByName } = require("../controllers/stat.js");

router.route("/").get(findList);

router.route("/:name").get(findByName);

module.exports = router;
