
starter.controller('eventsListCtrl', function($scope, $http, $rootScope, eventsService) {
  $scope.eventsType = 'Shows';

  $scope.$on('$ionicView.enter', function() {
    console.log($rootScope.events);
  })

  $scope.getEvents = function() {
    eventsService.getEventsList($scope)
  }

})
