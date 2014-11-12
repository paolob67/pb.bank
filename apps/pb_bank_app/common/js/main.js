/**
 * Application module
 * @author Paolo Bianchini [paolo.bianchini@it.ibm.com]
 * @copyright IBM Corp. 2014
 * @namespace pb
 */


//function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a Worklight Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
	// Common initialization code goes here
	
//}

'use strict';

/**
 * @description Declare application level module defined in {@link http://../common/index.html|common/index.html }
 * @class pb.bank
 * @memberOf pb
 * @param {ngModule} ui.bootstrap user interface
 * @param {ngModule} ngRoute manages loading of views based on window.location
 * @param {ngModule} pb.bank.navigation manages the navigation bar and the login authorization challenge handler
 * @param {ngModule} pb.bank.homeview manages the welcome page
 * @param {ngModule} pb.bank.accountview manages the first view with protected data for the account 
 * @param {ngModule} pb.bank.view2 manages the second view with public data
 * @param {ngModule} pb.bank.user manages the display of the data inside the UserIdentity object
 * @param {ngModule} pb.bank.alerts manages alerts display on page (not modal)
 * @param {ngModule} pb.bank.version manages application version display
 */
angular.module('pb.bank', [ 
                            'ui.bootstrap', 
                            'ngRoute', 
                            'pb.bank.navigation',
                            'pb.bank.homeview',
                            'pb.bank.accountview', 
                            'pb.bank.view2',
                            'pb.bank.user',
                            'pb.bank.alerts',
                            'pb.bank.version' 
                          ])
/**
 * @description Loads welcome page as default location
 * @callback pb.bank~config
 * @param {service} $routeProvider 
 */                            
.config([ '$routeProvider', function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo : '/homeview'
	});
}]) 

/**
 * @description Provide {@link http://../common/navigation.html|common/navigation} html template for the app-navigation div attribute
 * @callback pb.bank~directive
 * @param {attribute} appNavigation app-navigation div
 */
.directive('appNavigation', [function() {
	return {
		restrict: 'A',
		templateUrl: 'navigation.html'
	};

}])

/**
 * @description Provide {@link http://../common/alerts.html|common/alerts} html template for the appAlerts div attribute
 * @callback pb.bank~directive
 * @param {attribute} appAlerts app-alerts div
 */
.directive('appAlerts', [function() {
	return {
		restrict: 'A',
		templateUrl: 'alerts.html'
	};

}]);

