
var userIdentity;

function onAuthRequired(headers, errorMessage){
	errorMessage = errorMessage ? errorMessage : null;
	return {
		authRequired: true,
		authStep: 1,
		errorMessage: errorMessage
	};
}

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

function submitAuthStep2(answer){
	
	// let's check if we got the same pin
	/** @todo rather than getting this from the userid attributes implement a different pin check method */
	if (answer == userIdentity.attributes.pin_){
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

function onLogout(){
	userIdentity = null;
	WL.Server.setActiveUser("DoubleStepAuthRealm", userIdentity);
	WL.Logger.debug("Logged out");
}

