  angular.module('starter.controllers', [])

  .controller('WelcomeCtrl', function($scope, $http, $state, $window) {
    $scope.eventsType = 'Eventos';

    console.log('boo haa');

    $scope.goFullScreen = function(){
     var i = document.getElementsByTagName("body")[0];
     
    // go full-screen
    if (i.requestFullscreen) {
      i.requestFullscreen();
    } else if (i.webkitRequestFullscreen) {
      i.webkitRequestFullscreen();
    } else if (i.mozRequestFullScreen) {
      i.mozRequestFullScreen();
    } else if (i.msRequestFullscreen) {
      i.msRequestFullscreen();
    }
  }

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
        path: '/POACultura/events?fields=id,name,description,place,start_time',
        success: function(data) {
          $scope.events = data.data;
          console.log($scope.events);
          $scope.$apply();
          console.log(data);
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
