  angular.module('starter.controllers', [])

  .controller('WelcomeCtrl', function($scope, $http, $state, $window, $rootScope) {
    $scope.eventsType = 'Eventos';

    $scope.redirectTo = function(state){
      $window.location.href = '#/'+state;
    }

  // Defaults to sessionStorage for storing the Facebook token
  openFB.init({appId: '1453333228291598'});

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});

    $scope.login = function() {
      openFB.login(
        function(response) {
          if(response.status === 'connected') {
            alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
          } else {
            alert('Facebook login failed: ' + response.error);
          }
        }, {scope: 'email,read_stream,publish_stream'});
    }

    $scope.getEvents = function() {
      openFB.api({
        path: '/POACultura/events?fields=id,name,description,place,start_time,cover',
        success: function(data) {
          $rootScope.events = data.data;
          console.log($rootScope.events);
          $scope.$apply();
        },
        error: function(error){
          console.log(error);
        }
      });
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

  
  .controller('mainController', function($scope, $http) {
    $scope.eventsType = 'Shows';

  })
