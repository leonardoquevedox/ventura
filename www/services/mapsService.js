starter.service('mapsService', function($rootScope, $http, spinnerService, alertService, constantsService) {
	var _self = this;
	var SERVER_ADDRESS = constantsService.getServerAddress();

	this.instanceMap = function(){
		
		$rootScope.mapAlreadyRenderedEvents = [];
		$rootScope.events = [];

		var mapOptions = {
			disableDefaultUI: true,
			zoom: 16,
			panControl: false,
			zoomControl: false,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			overviewMapControl: false,
			backgroundColor: "#E9E5DC"
		}

		$rootScope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

		google.maps.event.addListener($rootScope.map, "dragend", function(event) {
			_self.refreshMap();
		});

		return $rootScope.map;
	},


	this.addMyLocationController = function(controlDiv, map, myLocationPosition){

		  // Set CSS for the control border
		  var controlUI = document.createElement('div');
		  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
		  controlUI.style.backgroundColor = 'rgba(0,0,0,0,0.9)';
		  controlUI.style.marginRight = '5px';
		  controlUI.style.marginTop = '10px';
		  controlUI.style.borderRadius = '5px';

		  controlUI.title = 'Click to recenter the map';
		  controlDiv.appendChild(controlUI);

		  // Set CSS for the control interior
		  var controlText = document.createElement('div');
		  controlText.innerHTML = '<button class="button target-button"><i class="icon ion-android-locate"></button>';
		  controlUI.appendChild(controlText);

		  // Setup the click event listeners: simply set the map to
		  // Chicago
		  google.maps.event.addDomListener(controlUI, 'click', function() {
		  	map.setZoom(16);
		  	map.panTo(myLocationPosition);	
		  });

		  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlUI);

		},

		this.getUserLocation = function(map, callback){
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					// var pos = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);
					var pos = new google.maps.LatLng(-30.041778,-51.220882);

					$rootScope.userCoordinates = pos;

					_self.setMapMarker($rootScope.map, 'img/marker.png', pos);

					if(callback)
						callback(pos);

				}, function() {
					_self.handleNoGeolocation(true);
				});
			} else {
	        // Browser doesn't support Geolocation
	        _self.handleNoGeolocation(false);
	    }
	},


	this.handleNoGeolocation = function(map, errorFlag) {
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}

		var options = {
			map: map,
			position: new google.maps.LatLng(60, 105),
			content: content
		};

		var marker = new google.maps.InfoWindow(options);
		map.setCenter(options.position);
	},

	this.setEventsMarkers = function(coordinatesList, coordinates, $rootScope, callback){
		$rootScope.requestOnGoing = true;

		_self.generateEventMarkers(coordinatesList);
		spinnerService.hideSpinner();
		$rootScope.requestOnGoing = false;
		if(callback)
			callback();
	},

	this.getEventCoordinates = function(event){
		if(!event.place)
			return;
		var pos = new google.maps.LatLng(event.place.location.latitude, event.place.location.longitude);
		return pos;
	}


	this.generateEventMarkers = function(eventsList, callback){
		eventsList.forEach(function(eventInfo){
			if(angular.isDefined(eventInfo)){
				var markerHasAlreadyBeenRendered = $rootScope.mapAlreadyRenderedEvents.indexOf(eventInfo.id) > -1;
				if(markerHasAlreadyBeenRendered)
					return;
				else{
					$rootScope.mapAlreadyRenderedEvents.push(eventInfo.id);
					$rootScope.events.push(eventInfo);
				}

				var pos = _self.getEventCoordinates(eventInfo);

				var iconImage = "";

				iconImage = 'img/custom_marker.png';

				_self.setMapMarker($rootScope.map, iconImage, pos, eventInfo);
			}
		});
		if(callback)
			callback();
	},

	this.setMapMarker = function(map, image, pos, event){
		var marker;
		if(event){
			marker = new google.maps.Marker({
				map: map,
				icon: image,
				position: pos,
				visible: true,
				title: event.name
			});
		}
		else{
			marker = new google.maps.Marker({
				map: map,
				icon: image,
				position: pos,
				visible: true,
				title: 'Sua localização'
			});
		}


		google.maps.event.addListener(marker, 'click', function() {
			alertService.alert(event.name);
		});
		if(event)
			event.googleMapsMarker = marker;
	},

	this.refreshMap =  function (callback){
		if(!$rootScope.requestOnGoing){
			var currentMapCenter = $rootScope.map.getCenter();
			_self.setEventsMarkers($rootScope.events, currentMapCenter, $rootScope, callback);
		}
	}

})