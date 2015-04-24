var app = angular.module('analoc', ['chart.js']);

app.controller('mainCtrl', function($scope, $http){

	// Initializing the data for an empy chart, based on the picker.
	var shoppersArray = [[0], [0]],
		labelsArray   = [moment().format("MMM Do YY")],
		seriesArray	  = ['Walk-Bys', 'Visits'];

	$scope.sendRequest = function(startDate, endDate){

		$http.post('/getAnaloc', {'startDate':startDate, 'endDate': endDate}).
			success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
				if (JSON.stringify(data) !== '{}') {

					// different reslution from one day to a few days
					if (Object.keys(data).length > 1){
						datesArray = [];
						// this for loop runs as many as number of days requested.
						for (var date in data){
							dateInfo = {'date': moment(date).format("MMM Do YY"), 'walkBys': 0, 'visits': 0};

							for (var j=0; j<data[date].length; j++){
								if (data[date][j]['is_inside'] === "1"){
									dateInfo.visits += 1;
								}
								dateInfo.walkBys += 1; // Every visitor is also a walk-by.
							};
							datesArray.push(dateInfo);
						};

						// Rearranging the data to match the graph settings.
						var labelsArray = [],
							shoppersArray = [[],[]];
						for (var i=0; i<datesArray.length; i++){
							labelsArray.push(datesArray[i].date);
							shoppersArray[0].push(datesArray[i].walkBys);
							shoppersArray[1].push(datesArray[i].visits);
						};
					}
					// One day resolution - optimized straight to visualizing later in the grpah.
					else {
						// labelsArray ($scope.labels) is the 'x' grpah representing
						// ... [date, hour, hour, date, hour, hour] - i.e [2015-02-08, 6:00, 7:00]
						var labelsArray = [];
						labelsArray.push(startDate);

						for (var hour=6; hour<23; hour++){
							labelsArray.push(hour);
						};

						var shoppersArray = new Array(2);
						//shoppersArray ($scope.data) is always a 2 index matrix - Walk-Bys, and Visitors.
						for (var i=0; i<shoppersArray.length; i++){
							shoppersArray[i] = new Array(labelsArray.length);
						};

						for (var i=0; i<labelsArray.length; i++){
							// default walk-bys/visits is 0. So we need to initialize it first.
							shoppersArray[0][i] = 0; // WALK-BY 
							shoppersArray[1][i] = 0; // VISITS
							var walkbysPerDay = data[startDate];

							if (labelsArray[i] === startDate){
								labelsArray[i] = moment(labelsArray[i]).format("MMM Do YY");

							}
							// A representation of hours
							else {
								for (var j=0; j<walkbysPerDay.length; j++){
									if (walkbysPerDay[j]['hour'] === labelsArray[i]){
										if (walkbysPerDay[j]['is_inside'] === "1"){
											shoppersArray[1][i] += 1;
										}
										shoppersArray[0][i] += 1;
									}
								};
							};
						};
						// Setting a nicer data to present the hours on the x axis.
						// -----------------------------------------
						for (var i=0; i<labelsArray.length; i++){
							if (typeof labelsArray[i] === 'number'){
								labelsArray[i] = labelsArray[i].toString() + ':00';
							}
						};
					};
				}	
				// If the data returns empty
				else {
					$scope.datamessage = 'Oops! no entries for these dates.';
				} 
				// Filling up the graph with the updated data.
				console.log(shoppersArray, labelsArray, seriesArray);
				fillGrpah(shoppersArray, labelsArray, seriesArray);
				
			}).
			error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
				console.log('ERROR RECEIVING DATA: ' + status);
				console.error(data);
			});
	}; // End of sendRequest.

	// Initializing grpah
	fillGrpah(shoppersArray, labelsArray, seriesArray);

	// Launching the datepicker
	$('#daterange').val(moment().format("YYYY-MM-DD")+' - '+ moment().add('days', 1).format("YYYY-MM-DD"));

	$('input[name="daterange"]').daterangepicker(
		{	
			format   : 'YYYY-MM-DD',
			startDate: moment().format("YYYY-MM-DD"),
			endDate  : moment().format("YYYY-MM-DD"),
		});
	$('#daterange').on('apply.daterangepicker', function(ev, picker) {
		var startDate = picker.startDate.format('YYYY-MM-DD'),
			endDate   = picker.endDate.format('YYYY-MM-DD');

		$scope.sendRequest(startDate, endDate);
	});

	// Filling up the chart (angular-charts)
	function fillGrpah(shoppersArray, labelsArray, seriesArray){
		$scope.data = shoppersArray;
		$scope.labels = labelsArray;
		$scope.series = seriesArray;
	}
});