starter.service('credentialsService', function($http, $rootScope) {
	var _self = this;
	
	this.userIsLoggedIn = function(){
		return angular.isDefined(window.localStorage['VENTURA_USER']);
	}

})
