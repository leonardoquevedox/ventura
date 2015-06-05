starter.factory('alertService', function($ionicPopup) {
	return {
		alert: function(message, callback){
			var messageIsNotEmpty = message !== null && message.length > 0;
			if(messageIsNotEmpty){
				var alertPopup = $ionicPopup.alert({
					title: 'Alerta!',
					template: '<p>'+message+'</p>',
					okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.
				})
				if(callback){
					alertPopup.then(callback);
				}
			}
			else{
				var alertPopup = $ionicPopup.alert({
					title: 'Alerta!',
					template: '<p>Falha no servidor! Por favor, tente novamente mais tarde.</p>',
					okType: 'button-balanced', // String (default: 'button-positive'). The type of the OK button.
				})
			}
		},
		confirm: function(title, message, callback){
			var cancelButton = { text: 'Cancelar' };
			var confirmButton =  { text: '<b>Ok</b>', type: 'button-balanced', onTap: callback };
			var confirmPopup = $ionicPopup.confirm({
				title: '<strong>'+title+'</strong>',
				template: message,
				buttons: [ cancelButton, confirmButton]
			});
		}
	}
})