var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Required for downloading the json file and saving it in 'temp/sample_data.json'
var fs = require('fs');
var request = require('request');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// This function stored the data from the url in local file in the client... 
// (It creats a new file if doesn't exist)
function getJson(){
  request('http://files.analoc.com/test/sample_data.json', function (error, response, importedJson) {
    if (!error && response.statusCode == 200) {
      if (!fs.existsSync("./temp/sample_data.json")){
        fs.writeFile("./temp/sample_data.json", importedJson, function(err) {
          if (err) {
            return console.log(err);
          }
        });
      }
    }
  });
}

module.exports = app;
getJson();
