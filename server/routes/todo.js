var express = require("express");
var router = express.Router();
const { verify } = require("../helpers/verifyToken");

const {
  findTodoList,
  createTodoList,
  findList,
  create,
  findDetail,
  update,
  remove,
  updateStep,
} = require("../controllers/todo.js");

router.route("/").get(findList).post(verify, create);

router.route("/:id").get(findDetail).put(verify, update).delete(verify, remove);

router.route("/:id/update_step").post(verify, updateStep);

router.route("/list").get(verify, findTodoList).post(verify, createTodoList);

module.exports = router;
