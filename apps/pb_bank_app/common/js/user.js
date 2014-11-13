/**
 * User Module
 * @author Paolo Bianchini
 * @copyright IBM Corp. 2014
 */

'use strict';

/**
 * @description This module manages the display of user specific info
 * @class pb.bank.user
 * @memberOf pb.bank
 * @param {ngModule} ngRoute
 */
angular.module('pb.bank.user', ['ngRoute'])

/**
 * @description Loads user info page when window.location is /user
 * @callback pb.bank.user~config
 * @param $routeProvider 
 */
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/user', {
    templateUrl: 'user.html',
    controller: 'UserCtrl'
  });
}])

/**
 * @description Controller for the user module
 * @callback pb.bank.user~controller
 * @param {service} $scope 
 */
.controller('UserCtrl', [ '$scope', function($scope) {
	
	/**
	 * @property {array} $scope.alerts holds user info retrieved from the WL User Identity stored by the adapter on the server
	 * @memberOf pb.bank.user
	 */
	$scope.attributes = WL.Client.getUserInfo(the_realm,"attributes");
		
}]);