
starter.controller('eventDetailsCtrl', function($scope, $http, $rootScope, $stateParams, eventsService) {
  $scope.eventsType = 'Shows';

  $scope.$on('$ionicView.enter', function() {
    var eventId = $stateParams.id;
    eventsService.getEventDetails(eventId, function(data){
    	console.log(data);
    	$scope.event = data;
    });
  })

})
