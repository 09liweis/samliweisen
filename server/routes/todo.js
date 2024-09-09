var express = require("express");
var router = express.Router();
const { verify } = require("../helpers/verifyToken");

const {
  findTodoList,
  createTodoList,
  getTodoListDetail,
  updateTodoList,
  findList,
  create,
  findDetail,
  update,
  remove,
  updateStep,
} = require("../controllers/todo.js");

router.route("/").get(findList).post(verify, create);

router.route("/lists").get(verify, findTodoList).post(verify, createTodoList);

router.route("/lists/:id").get(verify, getTodoListDetail).put(verify, updateTodoList);

router.route("/:id").get(findDetail).put(verify, update).delete(verify, remove);

router.route("/:id/update_step").post(verify, updateStep);

module.exports = router;
