
starter.controller('signinCtrl', function($scope, $http, $state, $window, $rootScope, alertService, ngFB, facebookService) {

  // Defaults to sessionStorage for storing the Facebook token
  ngFB.init({appId: '1453333228291598'});

  $scope.facebookLogin = function() {
    ngFB.login({scope: 'email,read_stream,publish_actions'})
    .then(function(data){
      facebookService.getUserInfo(function(userData){
        window.localStorage['VENTURA_USER'] = userData.id;
        $rootScope.redirectTo('#/events');
      })
    })
  }


  $scope.revokePermissions = function(){
    ngFB.revokePermissions(
      function() {
        alert('Permissions revoked');
      },
      function(error){
        error
      });
  }

})