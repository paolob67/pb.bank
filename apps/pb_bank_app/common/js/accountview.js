/**
 * AccountView Module
 * @author Paolo Bianchini
 * @copyright IBM Corp. 2014
 */

'use strict';

angular.module('pb.bank.accountview', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/accountview', {
    templateUrl: 'accountview.html',
    controller: 'AccountViewCtrl'
  });
}])

.controller('AccountViewCtrl', [ '$scope', function($scope) {
	
	
	$scope.movements = [];
	$scope.isloading = true;
	
	
	var invocationData = {
			adapter : "MovementsAdapter",
			procedure: "getMovements",
			parameters: []
		};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: function(_response){
			$scope.movements = _response.invocationResult.movements;
			$scope.isloading = false;
			$scope.$apply();
		}, 
		onFailure: function (_response) {
			/** @todo should broadcast and add_alert event for showing the error message */
			// $scope.movements = JSON.stringify(_response.invocationResult);
			$scope.isloading = false;
			$scope.$apply();
		},
	});
	
	

}]);
