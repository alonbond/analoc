var express = require('express');
var fs = require('fs');
var http = require('http');
var app = express.Router();

/* slice json data to relavent dates  */
app.post('/getAnaloc', function(req, res) {

	// Get the dates from the angular script
	var startDate = req.param('startDate'),
		endDate = req.param('endDate'),
		datesPath = "./temp/"+startDate.toString()+"_"+endDate.toString()+".json";
		
	var requestedData = {}; // Initializing an empy dict to be returned with correct data 

	// For each new dates range a file is created in ./temp so that can be reused quickly 
	// again ('my caching');
	// If file already exists 
	if (fs.existsSync(datesPath))
	{
		try {
			fs.readFile(datesPath, function(error, data){
				requestedData = JSON.parse(data);
				res.send(requestedData);
			});
		}
		catch(err) { 
			console.log("ERROR :", err); }	
	}
	// If file doesn't exist
	else {
		fs.readFile('./temp/sample_data.json', function(error, data){
	  		var jsonObj = JSON.parse(data);

	  		// Manipulating the data for {date: [object, object, object...]}
	  		var manipulatedData = manipulate(jsonObj);
	  		// slicing the jsonObj to relevant dates.
	  		for (var date in manipulatedData) {
	  			if (date >= startDate && date <= endDate) {
	  				requestedData[date] = manipulatedData[date];
	  			}
	  		}

	  		// writing the requested to a temp file so that we can reuse in the samce case of dates.
	  		fs.writeFile(datesPath, JSON.stringify(requestedData), function(err) {
	    		if (err) {
	      			return console.log(err);
	    		}
	  		});
	  		// Send the data back to the client. 
			res.send(requestedData);
		});
	};
});

// manipulate data for: {date: [object, object, object...]}
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