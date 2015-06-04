
starter.factory('spinnerService', function($ionicLoading) {
	return {
		showSpinner: function(){
			$ionicLoading.show({
				template: '<ion-spinner icon="android" class="spinner spinner-assertive" style="background-color: rgba(0,0,0,0.0)"></ion-spinner>'
			});
		},
		hideSpinner: function(callback){
				$ionicLoading.hide();
		},
	}
})