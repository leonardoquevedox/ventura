
starter.controller('eventDetailsCtrl', function($scope, $http, $rootScope, $stateParams, eventsService) {
	$scope.eventsType = 'Shows';
	$scope.SHORT_TEXT = 300;
	$scope.LARGE_TEXT = 9999;



	$scope.readMore = function(){
		$scope.textLength = $scope.LARGE_TEXT;
	}

	$scope.readLess = function(){
		$scope.textLength = $scope.SHORT_TEXT;
	}

	$scope.$on('$ionicView.enter', function() {
		var eventId = $stateParams.id;
		eventsService.getEventDetails(eventId, function(eventInfo){
			$scope.textLength = $scope.SHORT_TEXT;
			eventsService.getFriendsAttendingToEvent(eventId, function(friendsAttending){
				console.log(friendsAttending);
				eventInfo.friendsAttending = friendsAttending;
				$scope.event = eventInfo;
			})
		});
	})

})
