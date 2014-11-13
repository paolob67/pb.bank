/**
 * Investments Module
 * @author Paolo Bianchini
 * @copyright IBM Corp. 2014
 */

'use strict';

/**
 * @description This module manages the display of the investments screen
 * @class pb.bank.investmentsview
 * @memberOf pb.bank
 * @param {ngModule} ngRoute
 */
angular.module('pb.bank.investmentsview', ['ngRoute'])

/**
 * @description Loads account page when window.location is /investmentsview
 * @callback pb.bank.investmentsview~config
 * @param $routeProvider 
 */ 
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/investmentsview', {
    templateUrl: 'investmentsview.html',
    controller: 'InvestmentsViewCtrl'
  });
}])

/**
 * @description Controller for the accountview module
 * @callback pb.bank.investmentsview~controller
 * @param {service} $scope 
 */
.controller('InvestmentsViewCtrl', ['$scope', function($scope) {
	
	/**
	 * @property {bool} $scope.isloading flag used to display and hide progress bar 
	 * while waiting for the adapter call to complete
	 * @memberOf pb.bank.isloading
	 * @default
	 */
	$scope.isloading = true;

	
	var invocationData = {
			adapter : "StocksAdapter",
			procedure: "getData",
			parameters: []
		};

	WL.Client.invokeProcedure(invocationData, {
		onSuccess: function(_response){

			var data = [];
			
			data = _response.invocationResult.data;
	        // split the data set into ohlc and volume
			var ohlc = [],
            volume = [],
            dataLength = data.length,
            
            // set the allowed units for data grouping
            groupingUnits = [[
                'week',                         // unit name
                [1]                             // allowed multiples
            ], [
                'month',
                [1, 2, 3, 4, 6]
            ]],

            i = 0;

			for (i; i < dataLength; i += 1) {
				ohlc.push([
				           data[i][0], // the date
				           data[i][1], // open
				           data[i][2], // high
				           data[i][3], // low
				           data[i][4] // close
				           ]);

				volume.push([
				             data[i][0], // the date
				             data[i][5] // the volume
				             ]);
			}
		
			// create the chart	        
			var chart = new Highcharts.StockChart({
        	
        	  chart: {
                 renderTo: 'container',
                 plotBackgroundColor: null,
                 plotBorderWidth: null,
                 plotShadow: false
               },
	            rangeSelector: {
	                selected: 1
	            },

	            title: {
	                text: 'AAPL Historical'
	            },

	            yAxis: [{
	                labels: {
	                    align: 'right',
	                    x: -3
	                },
	                title: {
	                    text: 'OHLC'
	                },
	                height: '60%',
	                lineWidth: 2
	            }, {
	                labels: {
	                    align: 'right',
	                    x: -3
	                },
	                title: {
	                    text: 'Volume'
	                },
	                top: '65%',
	                height: '35%',
	                offset: 0,
	                lineWidth: 2
	            }],

	            series: [{
	                type: 'candlestick',
	                name: 'AAPL',
	                data: ohlc,
	                dataGrouping: {
	                    units: groupingUnits
	                }
	            }, {
	                type: 'column',
	                name: 'Volume',
	                data: volume,
	                yAxis: 1,
	                dataGrouping: {
	                    units: groupingUnits
	                }
	            }]
	        
			});

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