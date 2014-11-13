/**
 * Alerts Module
 * @author Paolo Bianchini
 * @copyright IBM Corp. 2014
 */

'use strict';

/**
 * @description This module manages the display of alerts right under the navbar
 * @class pb.bank.alerts
 * @memberOf pb.bank
 * @param {ngModule} ui.bootstrap
 */
angular.module('pb.bank.alerts', [ 'ui.bootstrap' ])

/**
 * @description Controller for the alerts module
 * @callback pb.bank.alerts~controller
 * @param {service} $scope 
 */
.controller('AlertsCtrl', ['$scope', function($scope) {
	
	/**
	 * @property {array} $scope.alerts holds alerts
	 * @memberOf pb.bank.alerts
	 */
	$scope.alerts = [];
	
	/**
	 * @description called when the add_alert event is received by $scope
	 * @callback pb.bank.alerts~on
	 * @param {object} _event the event received
	 * @param {json} _data {type: "type of alert [danger|success|null]", msg: "message to display"}
	 */
	$scope.$on('add_alert', function(_event, _data) {
		
		// add _data to the alerts array
		$scope.alerts.push(_data);
	
	});

	/**
	 * @description called when user clicks close button on alert removes alert from the alerts array so that it is not rendered
	 * @function closeAlert
	 * @memberOf pb.bank.alerts
	 * @param {int} index index of alert to close
	 */
	$scope.closeAlert = function(index) {

		// remove 1 at index from alerts array
		$scope.alerts.splice(index, 1);

	};

}]);
							