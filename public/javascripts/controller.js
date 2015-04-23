var app = angular.module('analoc', ['chart.js']);

app.controller('mainCtrl', function($scope, $http){

	$scope.sendRequest = function(){

		var range = $('#range').val(); 

		var startDate = formatDate(range.slice(0,10)),
			endDate = formatDate(range.slice(13, range.length));

		$http.post('/getAnaloc', {'startDate':startDate, 'endDate': endDate}).
			success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
			console.log(data);
			console.log(typeof data);
				if (JSON.stringify(data) !== '{}') {

					// labelsArray ($scope.labels) is the 'x' grpah representing
					// ... [date, hour, hour, date, hour, hour] - i.e [2015-02-08, 6:00, 7:00]
					var labelsArray = [];

					// filling up labelsArray.
					// -----------------------------------------
					// this for loop runs as many as number of days requested.
					for (var date in data){
						// first label is a date.
						labelsArray.push(date);

						for (var hour=6; hour<23; hour++){
							labelsArray.push(hour);
						}
					}

					// shoppersArray ($scope.data) is always a 2 index matrix - Walk-Bys, and Visitors.
					var shoppersArray = new Array(2);

					// filling up shoppersArray.
					// -----------------------------------------
					for (var i=0; i<shoppersArray.length; i++){
						shoppersArray[i] = new Array(labelsArray.length / 2);
					}

					// filling up shoppersArray.
					// -----------------------------------------
					// this for loop runs as many as number of days requested.
					var index = 0; // this index represents the index of labelsArray.
					for (var date in data){
						var walkbysPerDay = data[date]; // walk-bys for a whole day 

						for (var i=index; i<labelsArray.length; i++){
							shoppersArray[0][i] = 0; // WALK-BY 
							shoppersArray[1][i] = 0; // VISITS

							// default walk-bys/visits is 0. So we need to check it first.
							if (labelsArray[i] !== date){
								for (var j=0; j<walkbysPerDay.length; j++){
									if (walkbysPerDay[j]['hour'] === labelsArray[i]){
										if (walkbysPerDay[j]['is_inside'] === "1"){
											shoppersArray[1][i] += 1;
										}
										shoppersArray[0][i] += 1;
									}
								}
							}
							index += 1;
						}
					}

					// Setting a nicer data to present the hours on the x axis.
					// -----------------------------------------
					for (var i=0; i<labelsArray.length; i++){
						if (typeof labelsArray[i] === 'number'){
							labelsArray[i] = labelsArray[i].toString() + ':00';
						}
					}

					console.log(labelsArray);
					console.log(shoppersArray);


					// Setting the data for the graph.
					// -----------------------------------------
					$scope.data = shoppersArray;
	  				$scope.labels = labelsArray;
	  				$scope.series = ['Walk-Bys', 'Visits'];
					
					$scope.onClick = function (points, evt) {
						console.log(points, evt);
					};
				}
				// If the data returns empty
				else {
					alert("no data inbetween dates");
					$scope.message = 'No data between those dates.';
				} 
				
			}).
			error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
				console.log('ERROR RECEIVING DATA: ' + status);
				console.error(data);
			});
	};
});

function formatDate(date){
	var formattedDate = date.slice(6,10) + '-' + date.slice(0,2) + '-' + date.slice(3,5);
	return formattedDate;
};