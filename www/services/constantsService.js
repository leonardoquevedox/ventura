starter.service('constantsService', function ($http, spinnerService, $rootScope, alertService) {

    var _self = this;

    _self.SERVER_ADDRESS = 'http://venturalimaoserver-venturalimao.rhcloud.com';
//    _self.SERVER_ADDRESS = 'http://127.0.0.1:8080';

    this.getServerAddress = function () {
        return _self.SERVER_ADDRESS;
    }
})