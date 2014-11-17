/**
 * Navigation Module
 * @author Paolo Bianchini
 * @copyright IBM Corp. 2014
 */

'use strict';

/**
 * @description This module manages the navigation bar and the login/logout functions
 * @class pb.bank.navigation
 * @memberOf pb.bank
 * @param {ngModule} ui.bootstrap
 */
angular.module('pb.bank.navigation', [ 'ui.bootstrap' ])

/**
 * @description Controller for the navigation module
 * @callback pb.bank.navigation~controller
 * @param {service} $scope the current scope
 * @param {service} $rootScope the root scope, used for broadcasting down events to the alerts module
 * @param {service} $modal used for displaying the modal dialogs for the login process
 */
.controller('NavigationCtrl', ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
							
	/** navigation control */
	/**
	 * @property {boolean} __userLoggedIn flag to keep track if user is logged in
	 * @memberOf pb.bank.navigation
	 * @default 
	 */
	var __userLoggedIn = false;

	/**
	 * @property {integer} _activeView register for the active tab in navbar
	 * @default 
	 * @memberOf pb.bank.navigation
	 */
	var _activeView = 0;
	
	/**
	 * @todo not really used inside this code, might help for managing adapter returned status 
	 * @property {string} __userLogonStatus 
	 * @default 
	 * @memberOf pb.bank.navigation
	 */	
	var __userLogonStatus = "";

	/**
	 * @property {object} __this save pointer to this for using it into challenge handler callbacks
	 * @memberOf pb.bank.navigation
	 * @default
	 */
	var __this = this;

	/**
	 * @property {string} userDisplayName holds user name to display on navbar once logged in
	 * @default 
	 * @memberOf pb.bank.navigation
	 */	
	var userDisplayName = "";
			
	/**
	 * @description called when user clicks on a navbar tab, stores new view in _activeview
	 * @function select
	 * @memberOf pb.bank.navigation
	 * @param {int} _view index of view to load
	 */
	this.select = function(_view) {
		
		this._activeView = _view;
	
	};

	/**
	 * @description called to check if navbar should render as selected
	 * @function isSelected
	 * @memberOf pb.bank.navigation
	 * @param {int} _view index of view to check
	 * @returns {boolean} true if the passed view is selected
	 */
	this.isSelected = function(_view) {

		return this._activeView === _view;

	};

	/**
	 * @description 
	 * called to check if the user is logged in returns the value of the  __userLoggedIn 
	 * and calls Worklight to load user display name
	 * @function isLoggedIn
	 * @memberOf pb.bank.navigation
	 * @param {int} _view index of view to check
	 * @returns {boolean} true if user is logged in
	 */
	this.isLoggedIn = function() {

		// we got someone logged: in set data and exit
		if (this.__userLoggedIn == true) {

			this.userDisplayName = WL.Client.getUserInfo(the_realm, "displayName");
			return true;			

		};

		// no one in here reset data and exit
		this.userDisplayName = "";
		return false;

	};
	
	/**
	 * @description 
	 * called from navbar to logoff the current user
	 * @function doLogout
	 * @memberOf pb.bank.navigation
	 * @todo handle logout errors and return accordingly
	 */
	this.doLogout = function() {
		
		// call Worklight for logging off
		WL.Client.logout(the_realm);
		
		// reset properties and redirect to welcome view 
		this.userDisplayName = "";
		this.__userLoggedIn = false;
		this._activeView = 0;
		window.location = "#";
		
		// Broadcast event for displaying logged off alert on the page */
		//$rootScope.$broadcast('add_alert', {type: "success", msg: "You have successfully logged out"}); 
		$rootScope.$broadcast('add_alert', {type: "success", msg: Messages.MSG001}); 

	};

	/**
	 * @description handler returned from Worklight against the 
	 * given realm createChallengeHandler(the_realm) defined in wlInitOptions
	 * @class
	 * @property {Object} ChallengeHandler the Worklight handler for authorization challenges
	 * @memberOf pb.bank.navigation
	 */		
	var ChallengeHandler = WL.Client.createChallengeHandler(the_realm);

	/**
	 * @description 
	 * ChallengeHandler callback to test whether there is a custom challenge 
	 * to be handled in the response. If the method returns true, the IBM Worklight framework 
	 * calls the BaseChallengeHandler.handleChallenge(org.apache.commons.json.JSONObject) method.
	 * @callback pb.bank.navigation.ChallengeHandler~isCustomResponse
	 * @param {json} response 
	 */
	ChallengeHandler.isCustomResponse = function(response) {

		if (!response || !response.responseJSON	|| response.responseText === null) {

			return false;

		}

		if (typeof(response.responseJSON.authRequired) !== 'undefined'){

			return true;

		} else {

			return false;

		}

	};

	/**
	 * @description 
	 * ChallengeHandler callback to display login dialogs and logic.
	 * This function check the value of the_realm global variable in order to invoke the pin login screen
	 * after the email, password one
	 * @callback pb.bank.navigation.ChallengeHandler~handleChallenge
	 * @param {json} response 
	 * @todo implement alert on login error?
	 */
	ChallengeHandler.handleChallenge = function(response){

		// check if Worklight requests a login to be executed
		var authRequired = response.responseJSON.authRequired;

		if (authRequired == true) {

			__this.userDisplayName = "guest";
			__this.__userLoggedIn = false;
			__this.__userLogonError = "not logged in";
			
			// if we are on single step realm just open the login dialog
			// else open the login dialog and then the pin dialog depending on the step requested
			if (the_realm == __SINGLESTEPAUTHREALM__) {
				
				__this.open();
				
			} else {
				
				switch (response.responseJSON.authStep) {
				case 1:
					// open login dialog
					__this.open();
					break;
				case 2:
					// open pin dialog
					__this.openpin();
					break;
				};	
				
			};
			
			// save login error to use later
			if (response.responseJSON.errorMessage) {

				__userLogonStatus = response.responseJSON.errorMessage;

			};

		// no need to login here just update UI if needed and complete the authentication
		} else if (authRequired == false){

			ChallengeHandler.submitSuccess();
			__this.__userLoggedIn = true;
			__this.__userLogonStatus = "logged in";

		};

		// apply changes to UI 
		$scope.$apply();

	};

	/**
	 * @description Instantiate and open the login modal dialog
	 * @function open
	 * @memberOf pb.bank.navigation
	 */
	this.open = function() {

		/**
		 * @class
		 * @memberOf pb.bank.navigation
		 */
		var loginDialog = $modal.open({
			templateUrl : 'login.html',
			controller : LoginCtrl
		});

	};

	/**
	 * @description Controller for the login dialog
	 * @callback pb.bank.navigation.loginDialog~LoginCtrl
	 * @param {service} $scope the current scope
	 * @param {service} $modalInstance the instance of the modal dialogs for the login 
	 */
	var LoginCtrl = function($scope, $modalInstance) {

		/**
		 * @description 
		 * called when user clicks on the submit button, sends email and password
		 * use: mario.rossi@example.com Passw0rd!
		 * @function submit
		 * @memberOf pb.bank.navigation.loginDialog
		 * @param {string} _email email is userid
		 * @param {string} _password the password 
		 */
		$scope.submit = function(_email, _password) {
			
			// this is the procedure of the adapter to call is we are single step
			var _procedure = "submitAuthentication";
			
			// otherwise set the procedure name for the double step
			if (the_realm == __DOUBLESTEPAUTHREALM__) {
				
				_procedure = "submitAuthStep1";
				
			};
			
			// send MD5 hashes to the WL server for auth checking
			var _passwordhash = CryptoJS.MD5(_password).toString();
						
			// invoke the WL Adapter and send credentials for authorization
			var invocationData = {
					adapter : the_auth_adapter,
					procedure : _procedure,
					parameters : [ _email, _passwordhash ]
			};

			ChallengeHandler.submitAdapterAuthentication(invocationData, {});
			
			// all done here, close the dialog
			$modalInstance.close('submitted');

		};

		/**
		 * @description called when user clicks on the cancel button, closes dialog
		 * @function cancel
		 * @memberOf pb.bank.navigation.loginDialog
		 */
		$scope.cancel = function() {
			
			// tell Worklight that we did not complete the process
			ChallengeHandler.submitFailure();
			
			// close the dialog
			$modalInstance.dismiss('cancel');
		};
	};

	/**
	 * @description Instantiate and open the pin modal dialog
	 * @function open
	 * @memberOf pb.bank.navigation
	 */
	this.openpin = function() {

		/**
		 * @class
		 * @memberOf pb.bank.navigation
		 */
		var loginpinDialog = $modal.open({
			templateUrl : 'loginpin.html',
			controller : LoginpinCtrl
		});

	};

	/**
	 * @description Controller for the pin dialog
	 * @callback pb.bank.navigation.loginpinDialog~LoginpinCtrl
	 * @param {service} $scope the current scope
	 * @param {service} $modalInstance the instance of the modal dialogs for the login 
	 */
	var LoginpinCtrl = function($scope, $modalInstance) {
	
		/**
		 * @description called when user clicks on the submit button, sends pin
		 * @function submitpin
		 * @memberOf pb.bank.navigation.loginpinDialog
		 * @param {string} _pin the 4 digit pin
		 */
		$scope.submitpin = function(_pin) {

			// invoke the WL Adapter
			var invocationData = {
					adapter : the_auth_adapter,
					procedure : "submitAuthStep2",
					parameters : [ _pin ]
			};

			ChallengeHandler.submitAdapterAuthentication(invocationData, {});
			
			// all done here close the dialog
			$modalInstance.close('submitted');

		};

		/**
		 * @description called when user clicks on the cancel button, closes dialog
		 * @function cancel
		 * @memberOf pb.bank.navigation.loginpinDialog
		 */
		$scope.cancel = function() {
			
			ChallengeHandler.submitFailure();

			$modalInstance.dismiss('cancel');
		};
	};


} ]);