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

/* GET json */
app.get('/getAnaloc', function(req, res) {

	// Get the dates from the angular script
	var startDate = req.param('startDate');
	var endDate = req.param('endDate');

	console.log("START DATE: ", startDate);
	console.log("END DATE: ", endDate);

	fs.readFile('./sample_data.json', function(error, data){
  		var jsonObj = JSON.parse(data);
  		jsonObj = inDates(jsonObj, startDate, endDate);

  		// cache.save('data', jsonObj, function(err, savedDate){
  		// 	console.log("data is stord in cache.");
  		// });

	res.send(jsonObj);
	});
	
});

function inDates(jsonObj, startDate, endDate) {
	// Setting up a new array to store the sata only in between the desiered dates.
	jsonInDates = []

	// Because the format of the date of each element is: YYYY-MM-DD..
	// (i.e. '2015-02-14') we could jest compate between the strings.
	for (var i = 0; i < jsonObj.length; i++) {
		if ((jsonObj[i].date >= startDate) && (jsonObj[i].date <= endDate)) {
			jsonInDates.push(jsonObj[i]);
			// console.log(jsonObj[i]);
		}
	};

	return jsonInDates;
};

module.exports = app;
