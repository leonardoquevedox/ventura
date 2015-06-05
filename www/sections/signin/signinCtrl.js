
starter.controller('signinCtrl', function($scope, $http, $state, $window, $rootScope, alertService, ngFB) {

  // Defaults to sessionStorage for storing the Facebook token
  ngFB.init({appId: '1453333228291598'});

  $scope.facebookLogin = function() {
    ngFB.login({scope: 'email,read_stream,publish_actions'})
    .then(function(data){
      $rootScope.redirectTo('#/concerts');
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