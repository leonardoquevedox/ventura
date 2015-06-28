starter.service('httpService', function ($http, spinnerService, $rootScope, alertService) {
    var SERVER_ADDRESS = 'http://breadsyserver-breadsy.rhcloud.com';
    // var SERVER_ADDRESS = 'http://127.0.0.1:8080';
    var _self = this;

    // USER METHODS
    this.authenticateUser = function (user, authenticationType, callback) {
        spinnerService.showSpinner();

        $http.post(SERVER_ADDRESS + '/user/' + authenticationType, user)
            .success(function (data) {
                if (data.message && data.message !== null && data.message.length > 0) {
                    if (callback)
                        callback(data);
                } else
                    alertService.alert('Falha no servidor! Por favor tente novamente mais tarde.');

            })
            .error(function (error) {
                spinnerService.hideSpinner();
                if (error && error !== null && error.length > 0)
                    alertService.alert(error);
                else
                    alertService.alert('Falha no servidor! Por favor tente novamente mais tarde.');
            });
    }

})