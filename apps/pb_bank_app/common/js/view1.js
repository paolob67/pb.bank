'use strict';

angular.module('pb.bank.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [ '$scope', function($scope) {
	
	/*
	$scope.response = "getting data....";
	
	$scope.movements = [
		{
        	"bala": 14900,
        	"date": "2014-01-03",
        	"move": -100
		},
		{
			"bala": 15000,
			"date": "2014-01-01",
			"move": 1100
		},
		{
			"bala": 14400,
			"date": "2014-01-06",
			"move": -500
		}
	];
		
	var invocationData = {
		adapter : the_auth_adapter,
		procedure: "getSecretData",
		parameters: []
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: function(_response){
			$scope.response = JSON.stringify(_response.invocationResult);
			//window.location = "#/view1";
			$scope.$apply();
		}, 
		onFailure: function (_response) {
			$scope.response = JSON.stringify(_response.invocationResult);
			//window.location = "#/view1";
			$scope.$apply();
		},
	});
	*/
	
	$scope.movements = [];
	var busyInd = new WL.BusyIndicator ("content", {text: "Fetching data..."});

	busyInd.show();

	
	var invocationData = {
			adapter : "MovementsAdapter",
			procedure: "getMovements",
			parameters: []
		};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: function(_response){
			busyInd.hide();

			$scope.movements = _response.invocationResult.movements;
			$scope.$apply();
		}, 
		onFailure: function (_response) {
			busyInd.hide();

			$scope.movements = JSON.stringify(_response.invocationResult);
			$scope.$apply();
		},
	});
	
	

}]);