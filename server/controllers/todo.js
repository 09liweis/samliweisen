var mongoose = require("mongoose"),
  Todo = require("../models/todo"),
  TodoList = require("../models/todoList");
const ModelFacade = require("../models/modelFacade");
const todoModel = new ModelFacade(Todo);
const todoListModel = new ModelFacade(TodoList);
var { sendResp, sendErr } = require("../helpers/request");

const STRINGS = {
  BAD_ID: "Invalid todo id",
  STEP_NAME: "Missing step name",
};

exports.findTodoLists = async (req, resp) => {
  try {
    let query = { user: req.user._id };
    const unassignedTodosQuery = { todoList: { $exists: false } };
    const unassignedTodos = await todoModel.findList(unassignedTodosQuery, {
      sort: "-created_at",
    });
    const todoLists = await todoListModel.findList(query);
    if (unassignedTodos.length > 0) {
      todoLists.unshift({ name: "Unassigned Todos", _id: "unassignedTodos" });
    }
    return sendResp(resp, { todoLists });
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.createTodoList = async (req, resp) => {
  try {
    const { name } = req.body;
    const user = req.user;
    const todoList = await todoListModel.create({ name, user: user._id });
    return sendResp(resp, { msg: "Created", todoList });
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.getTodoListDetail = async (req, resp) => {
  try {
    const { id } = req.params;
    if (id === "unassignedTodos") {
      const todos = await todoModel.findList({ todoList: { $exists: false } });
      return sendResp(resp, { todos });
    }
    const todoList = await todoListModel.findOne({
      _id: id,
      user: req.user._id,
    });
    let todos = [];
    if (todoList?.items?.length > 0) {
      todos = await todoModel.findList({
        _id: { $in: todoList.items },
      });
    }
    return sendResp(resp, { todos });
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.updateTodoList = async (req, resp) => {
  try {
    const { id } = req.params;
    const { name, items } = req.body;
    const todoList = await todoListModel.updateOne(
      { _id: id, user: req.user._id },
      { name, items },
    );
    return sendResp(resp, { msg: "Updated", todoList });
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.findTodos = findTodos = async ({ page, limit = 20, status }, cb) => {
  let options = { sort: "date" };
  let query = { todoList: { $exists: false } };
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
    if (todos.length > 0) {
      todos.forEach((todo) => {
        todo.is_done = todo.status === "done";
      });
    }
    cb(null, todos);
  } catch (err) {
    cb(err);
  }
};

exports.findList = (req, resp) => {
  findTodos(req.query, (err, todos) => {
    if (err) {
      return sendErr(resp, { err });
    }
    return sendResp(resp, todos);
  });
};

exports.createTodo = createTodo = (req, cb) => {
  const user = req.user;
  const { name, date, status, todoList, loc } = req.body;
  const todo = {
    name,
    date,
    status,
    loc,
    todoList,
    user: user._id,
  };
  const newTodo = new Todo(todo);
  newTodo
    .save()
    .then((todo) => {
      todoListModel.updateOne(
        { _id: todoList, user: req.user._id },
        { $push: { items: newTodo._id } },
      );
      cb(null, { msg: "Created", todo });
    })
    .catch((err) => {
      cb(err);
    });
};

exports.create = (req, resp) => {
  createTodo(req, (err, todo) => {
    if (err) {
      return sendErr(resp, { err });
    }
    return sendResp(resp, todo);
  });
};

exports.findDetail = (req, resp) => {
  const todoId = req.params.id;
  if (!todoId) {
    return resp.status(404).json({ msg: STRINGS.BAD_ID });
  }
  Todo.findById(todoId, (err, todo) => {
    if (err) {
      return sendErr(resp, { err });
    }
    return sendResp(resp, { todo });
  });
};

exports.update = async (req, resp) => {
  const user = req.user;
  const { name, date, status, todoList, loc } = req.body;
  let todo = { todoList, user: user._id, loc };
  if (name) {
    todo.name = name;
  }
  if (date) {
    todo.date = date;
  }
  if (status) {
    todo.status = status;
  }
  todo.update_at = new Date();
  try {
    await Todo.findOneAndUpdate({ _id: req.params.id }, todo, {
      upsert: true,
      new: true,
    });
    return sendResp(resp, { msg: "Updated", todo });
  } catch (err) {
    return sendErr(resp, { err });
  }
};

exports.remove = async (req, resp) => {
  const todoId = req.params.id;
  const removedTodo = await todoModel.deleteOne({ _id: todoId });
  //TODO: delete todo from todoList
  return sendResp(resp, { msg: "Deleted", removedTodo });
};

function handleError(res, err) {
  if (err) {
    res.send(err);
  }
}
