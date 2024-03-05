"use strict";
const DEFAULT_PORT = 8081;
const mongoose = require("mongoose"),
  port = process.env.PORT || DEFAULT_PORT;

mongoose.Promise = global.Promise;

const dbUrl = process.env["MONGODB_URL"];
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//,{ useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify:true }

mongoose.connection.on("connected", function () {
  console.info("Connected to db");
});

mongoose.connection.on("error", function () {
  console.error("connected fail");
  //TODO: add email notification
});

mongoose.connection.on("disconnected", function () {
  console.error("Mongoose connection disconnected");
  //TODO: add email notification
});

const ExpressJs = require("./server/express");
const express = new ExpressJs();
express.init();

const http = require("http").Server(express.getApp());

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const { createTodo } = require("./server/controllers/todo.js");
//👇🏻 Add this before the app.get() block
socketIO.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  console.log(socketIO.sockets.sockets.size);
  socket.on("addTodo", (todo) => {
    //👇🏻 todo - contains the object from the React app
    createTodo(todo, (err, newTodo) => {
      findTodoList({}, (err, todos) => {
        socket.emit("getTodos", todos);
        socket.broadcast.emit("getTodos", todos);
      });
    });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

http.listen(port, () => {
  console.log(`${new Date()} Web server runs on: ${port}`);
});
