
starter.service('facebookService', function(spinnerService, $rootScope, alertService) {

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //  openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});
    this.login = function() {
    	openFB.login(
    		function(response) {
    			if(response.status === 'connected') {
    				alertService.alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
    			} else {
    				alertService.alert('Facebook login failed: ' + response.error);
    			}
    		}, {scope: 'email,read_stream,publish_stream'});
    },

     this.getUserInfo = function(callback) {
        openFB.api({
            path: '/me',
            success: function(data) {
                alertService.alert("Olá, "+data.name+"!"); 
                $rootScope.user = data;
                if(callback)
                    callback(data);
            },
            error: function(error){
                console.log(error);
            }
        });
    },

    this.revokePermissions = function(){
    	openFB.revokePermissions(
    		function() {
    			alertService.alert('Permissions revoked');
    		},
    		function(error){
    			error
    		});
    }
})

