var express = require('express');
var app = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
	console.log('Welcome to Express.js');
  	res.render('index', { title: 'Express' });
});

/* GET json */
app.get('/analoc/', function(req, res) {

	var fs = require('fs');

	fs.readFile('./sample_data.json', function(error, data){
  		console.log(JSON.parse(data));
	});

});

module.exports = app;
