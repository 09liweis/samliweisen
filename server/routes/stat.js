const express = require("express");
const router = express.Router();

const { findList } = require("../controllers/stat.js");

router.route("/").get(findList);

module.exports = router;
