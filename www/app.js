    //Custom function used to find object on array based on id
    Array.prototype.indexOfObject = function(property, value) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (this[i][property] === value.toString())
          return i;
      }
      return -1;
    }

    Date.prototype.addDays = function (days) {
      if (days) {
        var time = this.getTime();
        time = time + (days * 86400000);
        this.setTime(time);
      }
      return this;
    };

    // Ionic Starter App

    // angular.module is a global place for creating, registering and retrieving Angular modules
    // 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
    // the 2nd parameter is an array of 'requires'
    var starter = angular.module('starter', ['starter.controllers','ionic', 'ngOpenFB'])
    angular.module('starter.services',[])
    angular.module('starter.controllers',[])

    starter.run(function($ionicPlatform, $rootScope) {

    $rootScope.events = [];

    // Get the current date and seven days from now in order to show the whole week's events
    $rootScope.currentDate = new Date();
    $rootScope.sevenDaysFromNow =  new Date();

    // Add seven days to the "since"
    $rootScope.sevenDaysFromNow.addDays(7);

    // Converts it into the UNIX timestamp required by Facebook
    $rootScope.CURRENT_DAY_ON_UNIX_TIMESTAMP = String($rootScope.currentDate.getTime()/1000).split('.')[0];
    $rootScope.NEXT_WEEK_ON_UNIX_TIMESTAMP = String($rootScope.sevenDaysFromNow.getTime()/1000).split('.')[0];

    $rootScope.redirectToEventDetails = function(eventId){
      var eventUri = "#/event-details/"+eventId;
      $rootScope.redirectTo(eventUri);
    }

    $rootScope.redirectTo = function(state){
      window.location.href = state;
    }

    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
  })


    starter.config(function($stateProvider, $urlRouterProvider) {

      $stateProvider

      .state('culture-map', {
        url: "/cultureMap",
        templateUrl: "sections/events-map/events-map.html",
        controller: 'eventsMapCtrl'
      })

      .state('events', {
        url: "/events",
        templateUrl: "sections/events-list/events-list.html",
        controller: 'eventsListCtrl'
      })

      .state('event-details', {
        url: "/event-details/:id",
        templateUrl: "sections/event-details/event-details.html",
        controller: 'eventDetailsCtrl'
      })

      .state('signin', {
        url: "/signin",
        templateUrl: "sections/signin/signin.html",
        controller: 'signinCtrl'
      })

      .state('signup', {
        url: "/signup",
        templateUrl: "sections/signup/signup.html",
        controller: 'signinCtrl'
      })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/signin');
  });

