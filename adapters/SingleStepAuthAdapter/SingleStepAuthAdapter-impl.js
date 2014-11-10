

function onAuthRequired(headers, errorMessage){
	errorMessage = errorMessage ? errorMessage : null;
	
	return {
		authRequired: true,
		errorMessage: errorMessage
	};
}

function submitAuthentication(email, password){
	
	WL.Logger.error("submitAuth");
	
	var response;
	
	response = WL.Server.invokeHttp({
		method: 'get',
		returnedContentType: 'json',
		path: 'users/'+email
	});
	
	if (response.isSuccessful == true) {
		
		WL.Logger.debug(" :: FOUND USERID");
		
		if (response.password == password) {
		
			WL.Logger.debug(" :: MATCHED PASSWORD");
			
			userIdentity = {
					userId: response._id,
					displayName: response.attributes.name+" "+response.attributes.surn,
					attributes: response.attributes
			}

			WL.Server.setActiveUser("SingleStepAuthRealm", userIdentity);
			
			return { 
				authRequired: false 
			};
			
		}
			
	}

	return onAuthRequired(null, "Invalid login credentials");
}

function getSecretData(){
	return {
		secretData: "A very very very very secret data"
	};
}

function onLogout(){
	WL.Server.setActiveUser("SingleStepAuthRealm", null);
	WL.Logger.debug("Logged out");
}

