/**
 * HomeView Module
 * @author Paolo Bianchini [paolo.bianchini@it.ibm.com]
 * @copyright IBM Corp. 2014
 */

'use strict';

/**
 * @description This module manages the display of the welcome screen
 * @class pb.bank.homeview
 * @memberOf pb.bank
 * @param {ngModule} ngRoute
 */
angular.module('pb.bank.homeview', ['ngRoute'])

/**
 * @description Loads welcome page when window.location is /homeview
 * @callback pb.bank.homeview~config
 * @param $routeProvider 
 */    
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/homeview', {
    templateUrl: 'homeview.html',
    controller: 'HomeViewCtrl'
  });
}])

/**
 * @description Controller for the homeview module
 * @callback pb.bank.homeview~controller
 * @param {service} $scope 
 */
.controller('HomeViewCtrl', ['$scope', function($scope) {
	
	/**
	 * @property {int} $scope.slideInterval holds interval for slideshow
	 * @memberOf pb.bank.homeview
	 * @default
	 */
	$scope.slideInterval = 5000;
	
	/**
	 * @property {array} $scope.slides holds data for slideshow {image: "the url to load"}
	 * @memberOf pb.bank.homeview
	 */
	$scope.slides = [];
	
	// load images from {@link http://placehold.it|Placehold} and push them into slides array
	$scope.slides.push({ image: 'http://placehold.it/600x300/aaaaaa/ffffff&text=Campaign+content+1' });
	$scope.slides.push({ image: 'http://placehold.it/600x300/00ff00/ffffff&text=Campaign+content+2' });
	$scope.slides.push({ image: 'http://placehold.it/600x300/0000ff/ffffff&text=Campaign+content+3' });
	$scope.slides.push({ image: 'http://placehold.it/600x300/ff0000/ffffff&text=Campaign+content+4' });

}]);