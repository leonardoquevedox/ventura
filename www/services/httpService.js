starter.service('httpService', function($http, spinnerService, $rootScope, alertService) {
	var SERVER_ADDRESS = 'http://breadsyserver-breadsy.rhcloud.com';
	// var SERVER_ADDRESS = 'http://127.0.0.1:8080';
	var _self = this;

	// USER METHODS
	this.authenticateUser = function(user, authenticationType, callback){
		spinnerService.showSpinner();

		$http.post(SERVER_ADDRESS+'/user/'+authenticationType, user)
		.success(function(data){
			if(data.message && data.message !== null && data.message.length > 0){
				if(callback)
					callback(data);
			}
			else
				alertService.alert('Falha no servidor! Por favor tente novamente mais tarde.');
			
		})
		.error(function(error){
			spinnerService.hideSpinner();
			if(error && error !== null && error.length > 0)
				alertService.alert(error);
			else
				alertService.alert('Falha no servidor! Por favor tente novamente mais tarde.');
		});
	}

	this.getUserFavouriteBakeries = function(callback){
	   //Load user favourites in case its logged in
	   var data = {}
	   data.currentUser = window.localStorage['BREADSY_USER'];
	   if(angular.isDefined(data.currentUser)){
	   	$http.post(SERVER_ADDRESS+'/user/favouriteBakeries', data)
	   	.success(function(bakeriesList){
	   		$rootScope.favouriteBakeries = bakeriesList;
	   		if(callback)
	   			callback();
	   	})
	   	.error(function(error){
	   		spinnerService.hideSpinner();
	   		alertService.alert(error); 
	   	});
	   }
	}

   // BAKERY METHODS
   this.changeBookMarkStatus = function(objectType, bakeryInfo, callback){
    // Get user data in order to update it onto MongoDB
    var user = {};

    user.name = window.localStorage['BREADSY_USER'];
    var bakery = {};

    bakery.place_id = bakeryInfo.place_id;
    bakery.address = bakeryInfo.address;
    bakery.bookmarked = bakeryInfo.bookmarked;
    bakery.neighborhood = bakeryInfo.neighborhood;
    bakery.name = bakeryInfo.name;
    bakery.vicinity = bakeryInfo.vicinity;
    bakery.geometry = bakeryInfo.geometry;
    bakery.snacks = bakeryInfo.snacks;
    
    user.bakery = bakery;

	// Show spinner until request has returned
	spinnerService.showSpinner();

	var updateUrl;
	if(objectType === "BAKERY")
		updateUrl = SERVER_ADDRESS+'/user/changeBakeryBookMarkStatus';
	else
		updateUrl = SERVER_ADDRESS+'/user/changeSnackBookMarkStatus';

	$http.post(updateUrl, user)
	.success(function(data){
		spinnerService.hideSpinner();
		alertService.alert(data.message);
		if(callback)
			callback(data);
	})
	.error(function(error){
		spinnerService.hideSpinner();
		alertService.alert(error);
	});
}

})

