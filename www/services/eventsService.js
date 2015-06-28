	starter.service('eventsService', function ($http, spinnerService, $rootScope, alertService, storageService) {

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
	        var SERVER_URL = 'http://venturalimaoserver-venturalimao.rhcloud.com';
	        spinnerService.showSpinner();
	        $http.post(SERVER_URL + '/event/details', params)
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

	        var SERVER_URL = 'http://venturalimaoserver-venturalimao.rhcloud.com';
	        spinnerService.showSpinner();
	        $http.get(SERVER_URL + '/events/list')
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