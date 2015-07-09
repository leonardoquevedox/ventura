
starter.constant('WEATHER_ICONS', {
    'partlycloudy': 'ion-ios-partlysunny-outline',
    'mostlycloudy': 'ion-ios-partlysunny-outline',
    'cloudy': 'ion-ios-cloudy-outline',
    'rain': 'ion-ios-rainy-outline',
    'tstorms': 'ion-ios-thunderstorm-outline',
    'sunny': 'ion-ios-sunny-outline',
    'clear-day': 'ion-ios-sunny-outline',
    'nt_clear': 'ion-ios-moon-outline',
    'clear-night': 'ion-ios-moon-outline'
})

.directive('weatherIcon', function (WEATHER_ICONS) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            icon: '='
        },
        template: '<i class="icon" ng-class="weatherIcon"></i>',
        link: function ($scope) {
            
            console.log('Yahoo!');

            $scope.$watch('icon', function (v) {
                if (!v) {
                    return;
                }

                var icon = v;

                if (icon in WEATHER_ICONS) {
                    $scope.weatherIcon = WEATHER_ICONS[icon];
                } else {
                    $scope.weatherIcon = WEATHER_ICONS['cloudy'];
                }
            });
        }
    }
})

.directive('scrollToTop', function(){
    return {
        restrict: 'A',
        scope: {
            trigger: '=scrollToTop'
        },
        link: function postLink(scope, elem) {
            scope.$watch('trigger', function() {
                elem[0].scrollTop = 0;
            });
        }
    };
});