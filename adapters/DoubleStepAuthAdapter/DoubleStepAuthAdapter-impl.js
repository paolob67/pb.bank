/**
 * Double Step Authorization Adapter
 * @author Paolo Bianchini [paolo.bianchini@it.ibm.com]
 * @copyright IBM Corp. 2014
 */

/**
 * @description This adapter accesses a backend db to perform credential checks
 * @class pb.bank.DoubleStepAuthAdapter
 * @memberOf pb.bank
 */

/**
 * @property {object} userIdentity holds info received from backend
 * @memberOf pb.bank.DoubleStepAuthAdapter
 */
var userIdentity;

/**
 * @description the login function
 * @function onAuthRequired
 * @memberOf pb.bank.DoubleStepAuthAdapter
 * @param {object} headers
 * @param {string} errorMessage
 * @returns {object} data JSON structure indication if authorization is required
 */
function onAuthRequired(headers, errorMessage){
	errorMessage = errorMessage ? errorMessage : null;
	return {
		authRequired: true,
		authStep: 1,
		errorMessage: errorMessage
	};
}

/**
 * @description called by the challenge handler to perform the first step of by the submitAuth functions
 * @function submitAuthStep1
 * @memberOf pb.bank.DoubleStepAuthAdapter
 * @param {string} email the userid for the user record
 * @param {string} password MD5 hash of the password
 * @returns data JSON structure indication if authorization is required
 */
function submitAuthStep1(email, password){
	
	var response;
	
	response = WL.Server.invokeHttp({
		method: 'get',
		returnedContentType: 'json',
		path: 'users/'+email
	});
			
	
	if (response.isSuccessful == true) {
		
		WL.Logger.debug("Step 1 :: FOUND USERID " + email + " " + response.password);
		
		if (response.password == password) {
		
			WL.Logger.debug("Step 1 :: MATCHED PASSWORD");
			
			userIdentity = {
					userId: response._id,
					displayName: response.attributes.name+" "+response.attributes.surn,
					attributes: response.attributes
			}
			
			// we made it to the authentication
			return {
				authRequired: true,
				authStep: 2,
				question: "Please enter security PIN",
				errorMessage : ""
			};
			
		};
			
	};
	
	// ok we were not able to authenticate return error
	// we wont give info about the error to the app for security reasons
	// but we can log on the server
	WL.Logger.debug("Step 1 :: FAILURE");
	return onAuthRequired(null, "Invalid login credentials");
	
}

/**
 * @description called by the challenge handler to perform the second step of by the submitAuth functions
 * @function submitAuthStep2
 * @memberOf pb.bank.DoubleStepAuthAdapter
 * @param {string} pin the 4 digit pin
 * @returns {object} data JSON structure indication if authorization is required
 */
function submitAuthStep2(pin){
	
	// let's check if we got the same pin
	/** @todo rather than getting this from the userid attributes implement a different pin check method */
	if (pin == userIdentity.attributes.pin_){
		WL.Logger.debug("Step 2 :: SUCCESS");
		WL.Server.setActiveUser("DoubleStepAuthRealm", userIdentity);
		WL.Logger.debug("Authorized access granted");
		
		return {
			authRequired: false
		};
	}
	
	else{
		WL.Logger.debug("Step 2 :: FAILURE");
		return onAuthRequired(null, "Wrong security PIN");
	}
		
}

function getSecretData(){
	return {
		secretData: "A very very very very secret data"
	};
}

/**
 * @description the logout function
 * @function onLogout
 * @memberOf pb.bank.DoubleStepAuthAdapter
 */
function onLogout(){
	userIdentity = null;
	WL.Server.setActiveUser("DoubleStepAuthRealm", userIdentity);
	WL.Logger.debug("Logged out");
}

