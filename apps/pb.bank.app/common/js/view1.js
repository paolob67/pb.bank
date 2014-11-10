'use strict';

angular.module('pb.bank.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', [ '$scope', function($scope) {
	
	$scope.response = "getting data....";
		
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
	

}]);