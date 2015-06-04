starter.service('constantsService', function($http, spinnerService, $rootScope, alertService) {
	this.getServerAddress = function(){
		SERVER_ADDRESS = 'http://breadsyserver-breadsy.rhcloud.com';
		return SERVER_ADDRESS;
	}
})