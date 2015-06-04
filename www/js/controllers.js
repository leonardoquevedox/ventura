
starter.controller('WelcomeCtrl', function($scope, $http, $state, $window, $rootScope) {

  $scope.eventsType = 'Eventos';

  // Defaults to sessionStorage for storing the Facebook token
  openFB.init({appId: '1453333228291598'});

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});

    $scope.login = function() {
      openFB.login(function(data){
        console.log(data);
      }, {scope: 'email,read_stream,publish_actions'});
    }


    $scope.revokePermissions = function(){
      openFB.revokePermissions(
        function() {
          alert('Permissions revoked');
        },
        function(error){
          error
        });
    }

  })


.controller('mainController', function($scope, $http, $rootScope, eventsService) {
  $scope.eventsType = 'Shows';

  $scope.$on('$ionicView.enter', function() {
    console.log($rootScope.events);
  })

  $scope.getEvents = function() {
    eventsService.getEventsList($scope)
  }

})
