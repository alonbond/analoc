var app = angular.module('analoc', []);

app.controller('mainCtrl', function($http, $scope){

	$scope.sendRequest = function(){

		var range = $('#range').val(), 
			startDate = formatDate(range.slice(0,10)),
			endDate = formatDate(range.slice(13, range.length));
			
		$http.get('/getAnaloc?startDate='+startDate+'&endDate='+endDate).
			success(function(data, status, headers, config) {
			// this callback will be called asynchronously
			// when the response is available
				console.log("ANGULAR DATA ACCEPTS: ");
				console.log(data);
			}).
			error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
				console.log('ERROR');
			});
	}
});

function formatDate(date){
	var formattedDate = date.slice(6,10) + '-' + date.slice(0,2) + '-' + date.slice(3,5)
	return formattedDate;
};