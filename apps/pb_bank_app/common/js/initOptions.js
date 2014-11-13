/**
 * wlInitOptions module
 * @author Paolo Bianchini
 * @copyright IBM Corp. 2014
 */

// Uncomment the initialization options as required. For advanced initialization options please refer to IBM Worklight Information Center 
/**
 * @module wlInitOptions
 * @memberOf pb
 * @property {json} wlInitOptions Worklight specific options
 */
 var wlInitOptions = {
	
	// # To disable automatic hiding of the splash screen uncomment this property and use WL.App.hideSplashScreen() API
	//autoHideSplash: false,
		 
	// # The callback function to invoke in case application fails to connect to Worklight Server
	//onConnectionFailure: function (){},
	
	// # Worklight server connection timeout
	//timeout: 30000,
	
	// # How often heartbeat request will be sent to Worklight Server
	//heartBeatIntervalInSecs: 20 * 60,
	
	// # Enable FIPS 140-2 for data-in-motion (network) and data-at-rest (JSONStore) on iOS or Android.
	//   Requires the FIPS 140-2 optional feature to be enabled also.
	//enableFIPS : false,
	
	// # The options of busy indicator used during application start up
	//busyOptions: {text: "Loading..."}
};
 
/** attach callback to call WL.Client.init window load and onload events */
if (window.addEventListener) {
	window.addEventListener('load', function() { WL.Client.init(wlInitOptions); }, false);
} else if (window.attachEvent) {
	window.attachEvent('onload',  function() { WL.Client.init(wlInitOptions); });
}

/**
 * @description
 * Single step authorization realm name
 * @constant
 * @default
 */
const __SINGLESTEPAUTHREALM__ = "SingleStepAuthRealm";
/**
 * @description Single step authorization adapter name
 * @constant
 * @default
 */
const __SINGLESTEPAUTHADAPT__ = "SingleStepAuthAdapter";

/**
 * @description Double step authorization ream name
 * @constant
 * @default
 */
const __DOUBLESTEPAUTHREALM__ = "DoubleStepAuthRealm";
/**
 * @description Single step authorization adapter name
 * @constant
 * @default
 */
const __DOUBLESTEPAUTHADAPT__ = "DoubleStepAuthAdapter";

/**
 * @property {string} the_realm holds the name of the realm used
 * @default
 * @todo change this value to choose between single and double step
 */
var the_realm = __DOUBLESTEPAUTHREALM__;
/**
 * @property {string} the_auth_adapter holds the name of the adapter used
 * @default
 * @todo change this value to choose between single and double step
 */
var the_auth_adapter = __DOUBLESTEPAUTHADAPT__;