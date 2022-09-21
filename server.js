'use strict';
const DEFAULT_PORT = 8081;
const express = require('express'),
path = require('path'),
app = express(),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),

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
newsRoute = require('./server/routes/news'),
couponsRoute = require('./server/routes/coupons'),
userRoute = require('./server/routes/user'),
visualRoute = require('./server/routes/visual'),
categoryRoute = require('./server/routes/category'),

port = process.env.PORT || DEFAULT_PORT;

mongoose.Promise = global.Promise;

var dbUrl;
if (port == DEFAULT_PORT) {
  dbUrl = 'mongodb://localhost:27017/tdlisting';
} else {
  dbUrl = 'mongodb+srv://samliweisen:`Qq363404661@samliweisen.3amrq.mongodb.net/heroku_6njptcbp?retryWrites=true&w=majority';
  // dbUrl = 'mongodb://heroku_6njptcbp:dg8h3o8v9dpjk1osignqn3ibel@ds125489.mlab.com:25489/heroku_6njptcbp';
}
mongoose.connect(dbUrl,{ useNewUrlParser: true,useUnifiedTopology:true });
//,{ useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify:true }

mongoose.connection.on('connected', function() {
  console.log('Connected to db');
});

mongoose.connection.on('error', function() {
  console.log('connected fail');
});

mongoose.connection.on('disconnected', function () {    
  console.log('Mongoose connection disconnected');
}); 

app.use(function (req, res, next) {
  var host = req.headers.host;
  // if (host != 'localhost:8081' && req.protocol == 'http') {
  //   return res.redirect('https://' + req.headers.host + req.url);
  // }
  const origins = ['https://what-i-watched.herokuapp.com/','https://samliweisen.herokuapp.com/','http://localhost:4200','http://localhost:8081','http://localhost:3000'];
  // Website you wish to allow to connect
  if (origins.indexOf(req.headers.origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);   
  }
  if (req.query && req.query.origin && req.query.origin == 'localhost') {
    res.setHeader('Access-Control-Allow-Origin','*');
  }
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,auth-token');
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});
app.use('/assets', express.static(path.join(__dirname) + '/assets'));
app.use('/dashboard', express.static(path.join(__dirname) + '/dashboard'));
app.use('/resume', express.static(path.join(__dirname) + '/resume'));
app.use('/what-i-watched', express.static(path.join(__dirname) + '/what-i-watched'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'resume/resume.html'));
});

//Route for CMS: angular
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard/index.html'));
});

// Route for what i watched management application
app.get('/what-i-watched', (req, res) => {
  res.sendFile(path.join(__dirname, 'what-i-watched/what-i-watched.html'));
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', indexRoute);
app.use('/api/dashboard',dashboardRoute)
app.use('/api/todos', todoRoute);
app.use('/api/transactions', transactionRoute);
app.use('/api/experiences', experienceRoute);
app.use('/api/projects', projectRoute);
app.use('/api/places', placeRoute);
app.use('/api/blogs', blogRoute);
app.use('/api/comments', commentRoute);
app.use('/api/sites', SiteRoute);
app.use('/api/news', newsRoute);
app.use('/api/coupons', couponsRoute);
app.use('/api/user',userRoute);
app.use('/api/visuals', visualRoute);
app.use('/api/category', categoryRoute);

app.listen(port, () => {
  console.log(`${new Date()} Web server runs on: ${port}`);
});