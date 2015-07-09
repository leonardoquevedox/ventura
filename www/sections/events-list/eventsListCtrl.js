starter.controller('eventsListCtrl', function ($scope, $http, $rootScope, eventsService) {

    $scope.currentView = 'EVENTS';

    $scope.keyword = '';

    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.events.length === 0)
            $scope.getEvents();
    })

    $scope.getEvents = function () {
        eventsService.getEventsList($scope);
    }

})