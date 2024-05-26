var mongoose = require("mongoose"),
  Todo = require("../models/todo");
const ModelFacade = require("../models/modelFacade");
const todoModel = new ModelFacade(Todo);
var { sendResp } = require("../helpers/request");

const STRINGS = {
  BAD_ID: "Invalid todo id",
  STEP_NAME: "Missing step name",
};

exports.findTodoList = findTodoList = async (
  { page, limit = 20, status },
  cb,
) => {
  let options = { sort: "date" };
  let query = {};
  if (status) {
    query.status = status;
  }
  //TODO: fix pagination
  if (page) {
    options.skip = parseInt(page);
  } else {
    options.skip = 0;
  }
  if (limit) {
    options.limit = parseInt(limit);
  }
  try {
    const todos = await todoModel.findList(query, options);
    cb(null, todos);
  } catch (err) {
    cb(err);
  }
};

exports.findList = (req, resp) => {
  findTodoList(req.query, (err, todos) => {
    handleError(resp, err);
    return sendResp(resp, todos);
  });
};

exports.createTodo = createTodo = (input, cb) => {
  const { steps, name, date, status } = input;
  const todo = {
    name,
    date,
    status,
  };
  if (steps) {
    todo.steps = steps;
  }
  //handle post data from wechat mini program
  if (typeof steps == "string") {
    todo.steps = JSON.parse(steps);
  }
  const newTodo = new Todo(todo);
  newTodo
    .save()
    .then((todo) => {
      cb(null, todo);
    })
    .catch((err) => {
      cb(err);
    });
};

exports.create = (req, res) => {
  createTodo(req.body, (err, todo) => {
    handleError(res, err);
    return sendResp(res, todo);
  });
};

exports.findDetail = (req, resp) => {
  const todoId = req.params.id;
  if (!todoId) {
    return resp.status(404).json({ msg: STRINGS.BAD_ID });
  }
  Todo.findById(todoId, (err, todo) => {
    if (err) {
      return handleError(resp, err);
    }
    resp.status(200).json(todo);
  });
};

exports.update = async (req, resp) => {
  const { steps, name, date, status } = req.body;
  let todo = {};
  if (name) {
    todo.name = name;
  }
  if (date) {
    todo.date = date;
  }
  if (status) {
    todo.status = status;
  }
  if (steps) {
    todo.steps = steps;
  }
  //handle post data from wechat mini program
  if (typeof steps == "string") {
    todo.steps = JSON.parse(steps);
  }
  todo.update_at = new Date();
  try {
    todo = await Todo.findOneAndUpdate({ _id: req.params.id }, todo, {
      upsert: true,
      new: true,
    });
    resp.status(200).json(todo);
  } catch (err) {
    return handleError(resp, err);
  }
};

exports.remove = async (req, resp) => {
  await Todo.deleteOne({ _id: req.params.id });
  resp.status(200).json({ ok: 1 });
};

exports.updateStep = (req, resp) => {
  const todoId = req.params.id;
  var query = { _id: todoId };
  let { step, mode } = req.body;
  if (!step.name) {
    return resp.status(400).json({ msg: STRINGS.STEP_NAME });
  }
  if (!step.status) {
    step.status = "pending";
  }
  if (!mode) {
    mode = "add";
  }
  let update = {};
  switch (mode) {
    case "add":
      update["$push"] = { steps: step };
      break;
    case "delete":
      update["$pull"] = { steps: { _id: step._id } };
      break;
    case "update":
      if (step.idx == "") {
        return resp.status(400).json({ msg: "Missing step idx" });
      }
      query["steps._id"] = step._id;
      delete step._id;
      var key = "steps." + step.idx;
      update["$set"] = {};
      delete step.idx;
      update["$set"][key] = step;
      break;
    default:
      break;
  }
  Todo.findOneAndUpdate(
    query,
    update,
    { returnNewDocument: true },
    (err, todo) => {
      if (err) {
        return resp.status(400).json({ err });
      }
      resp.status(200).json({ msg: "Update Success" });
    },
  );
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
