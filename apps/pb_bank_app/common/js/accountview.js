/**
 * AccountView Module
 * @author Paolo Bianchini
 * @copyright IBM Corp. 2014
 */

'use strict';

/**
 * @description This module manages the display of the account movements screen
 * @class pb.bank.accountview
 * @memberOf pb.bank
 * @param {ngModule} ngRoute
 */
angular.module('pb.bank.accountview', ['ngRoute'])

/**
 * @description Loads account page when window.location is /accountview
 * @callback pb.bank.accountview~config
 * @param $routeProvider 
 */ 
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/accountview', {
    templateUrl: 'accountview.html',
    controller: 'AccountViewCtrl'
  });
}])

/**
 * @description Controller for the accountview module
 * @callback pb.bank.accountview~controller
 * @param {service} $scope 
 */
.controller('AccountViewCtrl', [ '$scope', function($scope) {
	
	/**
	 * @property {array} $scope.movements holds movements for account
	 * @memberOf pb.bank.accountview
	 */	
	$scope.movements = [];

	/**
	 * @property {bool} $scope.isloading flag used to display and hide progress bar 
	 * while waiting for the adapter call to complete
	 * @memberOf pb.bank.isloading
	 * @default
	 */
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
