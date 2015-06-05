starter.service('eventsService', function($http, spinnerService, $rootScope, alertService) {
	var _self = this;

	this.getEventDetails = function(eventId, callback){
		spinnerService.showSpinner();
		var eventPath = "/"+eventId;
		openFB.api({
			path: eventPath,
			params: {
				'fields':'id,name,description,place,start_time,cover'
			},
			success: function(eventDetails) {
				spinnerService.hideSpinner();
				if(callback)
					callback(eventDetails);
			},
			error: function(error){
				console.log(error);
			}
		});
	}


	this.getEventsList = function($scope, callback){
		spinnerService.showSpinner();
		openFB.api({
			path: '/events/attending',
			params: {
				'ids': '189410864517242,171220726312631,210624832323354,114073091977375',
				'since' : '2015-06-01T00:00:00-0300',
				'until' :'2015-06-07T00:00:00-0300',
				'fields':'id,name,description,place,start_time,cover'
			},
			success: function(eventPagesList) {
				for(var page in eventPagesList) {
					var pageEventsList = eventPagesList[page].data;
					pageEventsList.forEach(function(eventInfo){
						eventInfo.formatedDate = getFormatedDate(eventInfo.start_time);
						var eventHasntBeenLoaded = $rootScope.events.indexOfObject("id", eventInfo.id) === -1;
						if(eventHasntBeenLoaded)
							$rootScope.events.push(eventInfo);
					})
				}
				$scope.$apply();
				spinnerService.hideSpinner();
				if(callback)
					callback();
			},
			error: function(error){
				console.log(error);
			}
		});
	}

	function getFormatedDate(date){
		var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		var formatedDate = new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
		return formatedDate;
	}

})

