'use strict';
const DEFAULT_PORT = 8081;
const express = require('express'),
  path = require('path'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  indexRoute = require('./server/routes/index'),
  dashboardRoute = require('./server/routes/dashboard'),
  todoRoute = require('./server/routes/todo'),
  transactionRoute = require('./server/routes/transaction'),
  experienceRoute = require('./server/routes/experience'),
  projectRoute = require('./server/routes/project'),
  placeRoute = require('./server/routes/place'),
  blogRoute = require('./server/routes/blog'),
  commentRoute = require('./server/routes/comment'),
  SiteRoute = require('./server/routes/site'),
  userRoute = require('./server/routes/user'),
  visualRoute = require('./server/routes/visual'),
  videoRoute = require('./server/routes/video'),
  categoryRoute = require('./server/routes/category'),
  roomRoute = require('./server/routes/room'),
  contactRoute = require('./server/routes/contact'),
  port = process.env.PORT || DEFAULT_PORT;

mongoose.Promise = global.Promise;

var dbUrl;
if (port == DEFAULT_PORT) {
  dbUrl = 'mongodb://localhost:27017/tdlisting';
} else {
  dbUrl =
    'mongodb+srv://samliweisen:`Qq363404661@samliweisen.3amrq.mongodb.net/heroku_6njptcbp?retryWrites=true&w=majority';
  // dbUrl = 'mongodb://heroku_6njptcbp:dg8h3o8v9dpjk1osignqn3ibel@ds125489.mlab.com:25489/heroku_6njptcbp';
}
dbUrl =
  'mongodb+srv://samliweisen:`Qq363404661@samliweisen.3amrq.mongodb.net/heroku_6njptcbp?retryWrites=true&w=majority';
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
//,{ useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify:true }

mongoose.connection.on('connected', function() {
  console.log('Connected to db');
});

mongoose.connection.on('error', function() {
  console.log('connected fail');
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose connection disconnected');
});

app.use(cors());

const getPathName = (dir) => {
  return express.static(path.join(__dirname) + '/' + dir);
}

app.use(function(req, res, next) {
  var host = req.headers.host;
  // if (host != 'localhost:8081' && req.protocol == 'http') {
  //   return res.redirect('https://' + req.headers.host + req.url);
  // }
  const origins = [
    'https://samliweisen.onrender.com/',
    'https://dashboard.09liweis.repl.co/',
    'http://localhost:4200',
    'http://localhost:8081',
    'http://localhost:3000',
    'https://what-sam-watched.onrender.com/',
    'https://samliweisen.cyclic.app/',
  ];
  // Website you wish to allow to connect
  if (origins.indexOf(req.headers.origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  }
  if (req.query && req.query.origin && req.query.origin == 'localhost') {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,auth-token'
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

app.use('/assets', getPathName('assets'));
app.use('/resume', getPathName('resume'));

const http = require('http').Server(app);

const socketIO = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const { createTodo } = require('./server/controllers/todo.js');
//👇🏻 Add this before the app.get() block
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  console.log(socketIO.sockets.sockets.size);
  socket.on('addTodo', (todo) => {
    //👇🏻 todo - contains the object from the React app
    createTodo(todo, (err, newTodo) => {
      findTodoList({}, (err, todos) => {
        socket.emit('getTodos', todos);
        socket.broadcast.emit('getTodos', todos);
      });
    });
  });

  socket.on('disconnect', () => {
    socket.disconnect();
    console.log('🔥: A user disconnected');
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'resume/resume.html'));
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', indexRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/videos', videoRoute);
app.use('/api/movies', visualRoute);
app.use('/api/todos', todoRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/experiences', experienceRoute);
app.use('/api/projects', projectRoute);
app.use('/api/blogs', blogRoute);
app.use('/api/comments', commentRoute);
app.use('/api/sites', SiteRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/places', placeRoute);
app.use('/api/rooms', roomRoute);
app.use('/api/contacts', contactRoute);

http.listen(port, () => {
  console.log(`${new Date()} Web server runs on: ${port}`);
});
