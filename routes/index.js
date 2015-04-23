var express = require('express');
var fs = require('fs');
var http = require('http');
var app = express.Router();
var Cache = require('cache-storage');
var FileStorage = require('cache-storage/Storage/FileAsyncStorage');
 
var cache = new Cache(new FileStorage('./temp'), 'namespace');

/* GET home page. */
app.get('/', function(req, res, next) {
	console.log('Welcome to Express.js');
  	res.render('index', { title: 'Express' });
});

/* slice json data to relavent dates  */
app.post('/getAnaloc', function(req, res) {

	// Get the dates from the angular script
	var startDate = req.param('startDate'),
		endDate = req.param('endDate');

	fs.readFile('./sample_data.json', function(error, data){
  		var jsonObj = JSON.parse(data);
  		
  		var manipulatedData = manipulate(jsonObj);
  		var requestedData = {}
  		// slicing the jsonArray to relevant dates.
  		for (var date in manipulatedData) {
  			if (date >= startDate && date <= endDate) {
  				requestedData[date] = manipulatedData[date];
  			}
  		}
		res.send(requestedData);
	});
	
});

// manipulate data for: {date: [object, objects]}
function manipulate(jsonArray) {
	var result = {};
	for (var index in jsonArray) {
		var element = jsonArray[index];
		if (!result[element["date"]]) {
			result[element["date"]] = [];
		}
		result[element["date"]].push(element);
	}
	return result;
}

module.exports = app;
