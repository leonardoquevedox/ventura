starter.service('credentialsService', function($http, spinnerService, $rootScope, alertService) {
	var _self = this;
	
	this.userIsLoggedIn = function(){
		return angular.isDefined(window.localStorage['BREADSY_USER']);
	}

	this.getLoggedInUser = function(){
		return window.localStorage['BREADSY_USER'];
	}
})
