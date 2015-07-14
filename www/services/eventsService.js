	starter.service('eventsService', function ($http, spinnerService, $rootScope, alertService, storageService, constantsService) {

	    var _self = this;

	    this.getEventsList = function ($scope, callback) {
	        spinnerService.showSpinner();
	        $http.get(constantsService.SERVER_ADDRESS + '/events/list')
	            .then(function (response) {
	                    var eventsList = response.data.events;
	                    eventsList.forEach(function (eventInfo) {
	                        eventInfo.formatedTime = new Date(eventInfo.start_time).toTimeString().substring(0, 5);
	                    })
	                    $rootScope.events = eventsList;
	                    spinnerService.hideSpinner();
	                    if (callback)
	                        callback(eventsList);
	                },
	                function (error) {
	                    console.log(error);
	                    alertService.alert('Falha no servidor! Por favor, tente novamente mais tarde.');
	                    spinnerService.hideSpinner();
	                })
	    }

	    this.getCurrentlyGoingEvents = function ($scope, callback) {
	        spinnerService.showSpinner();
	        $rootScope.currentlyGoingEvents = [];
	        var tomorrow = new Date(new Date().addDays(1).toDateString());
	        var today = new Date().removeHours(3);

	        $rootScope.events.forEach(function (event) {
	            var eventDate = new Date(event.start_time);
	            var eventHappensToday = eventDate > today && eventDate < tomorrow;

	            if (eventHappensToday)
	                $rootScope.currentlyGoingEvents.push(event);
	        });

	        spinnerService.hideSpinner();

	        if (callback)
	            callback();
	    }

	    this.getEventDetails = function (eventId, callback) {
	        spinnerService.showSpinner();

	        var params = {
	            eventId: eventId
	        }
	        var eventPositionOnEventsArray = $rootScope.events.indexOfObject("id", eventId);
	        var eventInfo = $rootScope.events[eventPositionOnEventsArray];


	        setTimeout(function () {
	            spinnerService.hideSpinner();
	        }, 200)

	        callback(eventInfo);
	        //	        spinnerService.showSpinner();
	        //	        $http.post(constantsService.SERVER_ADDRESS + '/event/details', params)
	        //	            .then(function (response) {
	        //	                    var eventDetails = response.data.event;
	        //	                    spinnerService.hideSpinner();
	        //	                    if (callback)
	        //	                        callback(eventDetails);
	        //	                },
	        //	                function (error) {
	        //	                    console.log(error);
	        //	                })
	    }

	    this.searchForEventByName = function (keyword, callback) {
	        spinnerService.showSpinner();
	        var queryPath = "/search";
	        openFB.api({
	            path: eventPath,
	            params: {
	                'fields': 'id,name,description,place,start_time,cover',
	                'type': 'event',
	                'q': keyword,
	                'center': '-30.041778,-51.220882',
	                'distance': '30000'
	            },
	            success: function (events) {
	                console.log(events);
	                if (callback)
	                    callback(events);
	            },
	            error: function (error) {
	                console.log(error);
	            }
	        });
	    }

	})