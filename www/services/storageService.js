starter.service('storageService', function($http, $rootScope) {
	this.getLoggedInUser = function(){
		return window.localStorage['VENTURA_USER'];
	}
})