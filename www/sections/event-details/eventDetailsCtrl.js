starter.controller('eventDetailsCtrl', function ($scope, $http, $rootScope, $stateParams, eventsService, spinnerService) {

    $scope.currentView = 'EVENTS';

    $scope.SHORT_TEXT = 300;

    $scope.readMore = function (text) {

        $scope.textLength = text.length;
        spinnerService.showSpinner();

        window.setTimeout(function () {
            spinnerService.hideSpinner();
        }, 500)
    }

    $scope.readLess = function () {
        $scope.textLength = $scope.SHORT_TEXT;
    }

    $scope.$on('$ionicView.enter', function () {
        var eventId = $stateParams.id;
        eventsService.getEventDetails(eventId, function (eventInfo) {
            console.log(eventInfo);
            $scope.textLength = $scope.SHORT_TEXT;
            $scope.event = eventInfo;
        });
    })

})