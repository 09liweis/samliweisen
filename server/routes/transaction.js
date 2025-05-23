const express = require("express");
const router = express.Router();
const { verify } = require("../helpers/verifyToken");

const {
  getStatistics,
  findList,
  create,
  category_list,
  detail,
  update,
  remove,
} = require("../controllers/transaction.js");

router.post("/", verify, findList);

router.post("/statistics", verify, getStatistics);

router.post("/new", verify, create);

router.route("/categories").get(category_list);

router.route("/:id").post(detail).put(verify, update).delete(verify, remove);

module.exports = router;
