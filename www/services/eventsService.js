	starter.service('eventsService', function ($http, spinnerService, $rootScope, alertService, storageService, constantsService) {

	    var _self = this;

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

	    this.getEventDetails = function (eventId, callback) {
	        var params = {
	            eventId: eventId
	        }
	        spinnerService.showSpinner();
	        $http.post(constantsService.SERVER_ADDRESS + '/event/details', params)
	            .then(function (response) {
	                    var eventDetails = response.data.event;
	                    spinnerService.hideSpinner();
	                    if (callback)
	                        callback(eventDetails);
	                },
	                function (error) {
	                    console.log(error);
	                })
	    }

	    this.getEventsList = function ($scope, callback) {
	        spinnerService.showSpinner();
	        $http.get(constantsService.SERVER_ADDRESS + '/events/list')
	            .then(function (response) {
	                    var eventsList = response.data.events;
	                    $rootScope.events = eventsList;
	                    spinnerService.hideSpinner();
	                    if (callback)
	                        callback(eventsList);
	                },
	                function (error) {
	                    console.log(error);
	                })
	    }

	})