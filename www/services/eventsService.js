	starter.service('eventsService', function($http, spinnerService, $rootScope, alertService, storageService) {

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
					eventDetails.date = new Date(eventDetails.start_time);
					eventDetails.formatedDate = getFormatedDate(eventDetails.start_time);
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

		// Mount the events path based on the user id path
		var userEventsPath = "/me/events";
		spinnerService.showSpinner();

		openFB.api({
			path: userEventsPath,
			params: {
				'since' : $rootScope.CURRENT_DAY_ON_UNIX_TIMESTAMP,
				'until' : $rootScope.NEXT_WEEK_ON_UNIX_TIMESTAMP,
				'fields':'id,name,description,place,start_time,cover'
			},
			success: function(eventPagesList) {

				getEventsInfo(eventPagesList, function(eventPagesList){
					getNextEventsListPage(eventPagesList);
				})

				spinnerService.hideSpinner();
				if(callback)
					callback();
			},
			error: function(error){
				console.log(error);
			}
		});
	}

	function getEventsInfo(eventPagesList, callback){
		var eventsList;
		var keepGoing = true;
		if(eventPagesList.data.data)
			eventsList = eventPagesList.data.data;
		else
			eventsList = eventPagesList.data;

		eventsList.forEach(function(eventInfo){
			eventInfo.date = new Date(eventInfo.start_time);
			eventInfo.formatedDate = getFormatedDate(eventInfo.start_time);
			var eventHasntBeenLoaded = $rootScope.events.indexOfObject("id", eventInfo.id) === -1;

			var eventDate = new Date(eventInfo.start_time);
			var eventIsAfterToday = eventDate > $rootScope.currentDate;

			if(eventHasntBeenLoaded && eventIsAfterToday)
				$rootScope.events.push(eventInfo);

			if(!eventIsAfterToday)
			keepGoing = false;

		})

		if(callback)
			callback(eventPagesList.paging.next, keepGoing);
	}

	var getNextEventsListPage = function(nextEventListURL, keepGoing){
		$http.get(nextEventListURL)
		.then(function(eventPagesList){
			getEventsInfo(eventPagesList.data, function(){
				if(keepGoing && eventPagesList.data.paging.next)
					getNextEventsListPage(eventPagesList.data.paging.next, keepGoing);
				else{
					console.log("End of the list: " + $rootScope.events.length + " events loaded.");
				}
			})
		},
		function(error){
			console.log(error);
		})
	}

	function getFormatedDate(date){
		var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		var formatedDate = new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
		return formatedDate;
	}
})

