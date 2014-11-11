'use strict';

angular.module('pb.bank.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [ '$scope', function($scope) {
	
	
	$scope.movements = [];
	
	// var busyInd = new WL.BusyIndicator ("content", {text: "Fetching data..."});

	busyInd.show();

	
	var invocationData = {
			adapter : "MovementsAdapter",
			procedure: "getMovements",
			parameters: []
		};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: function(_response){
			// busyInd.hide();

			$scope.movements = _response.invocationResult.movements;
			$scope.$apply();
		}, 
		onFailure: function (_response) {
			// busyInd.hide();

			$scope.movements = JSON.stringify(_response.invocationResult);
			$scope.$apply();
		},
	});
	
	

}]);
