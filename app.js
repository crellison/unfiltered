// ------------------------------------
// DEPENDENCIES
// ------------------------------------

const cookieParser = require('cookie-parser');
const bodyParser   = require('body-parser');
const RateLimit    = require('express-rate-limit');
const mongoose     = require('mongoose')
const express      = require('express');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const path         = require('path');

// ------------------------------------
// CONNECT TO DATABASE
// ------------------------------------

var connect = process.env.MONGODB_URI;
mongoose.connect(connect);

var db = mongoose.connection;
db.once('open', () => console.log("DB Connected!"));

// ------------------------------------
// ROUTER FILES
// ------------------------------------

var webhook = require('./routes/webhook');
var index   = require('./routes/index');
var users   = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------
// RATE LIMITING
// ------------------------------------

app.enable('trust proxy'); 
 
var limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes 
  max: 50, // limit each IP to 50 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
 
//  apply to all requests 
app.use('/new-tweet', limiter);

// ------------------------------------
// ROUTING
// ------------------------------------

app.use('/', index);
app.use('/users', users);
app.use('/new-tweet', webhook);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
