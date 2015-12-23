/*eslint-env browser, es6*/

const WeatherConfig = ($routeProvider) => {
    $routeProvider
        .when('/weather', {
            title: 'Weather',
            templateUrl: 'weather/weather.template.html',
            controller: 'WeatherController',
            controllerAs: 'vm'
        })
        .otherwise({
            redirectTo: '/weather'
        });
}

export default ['$routeProvider', WeatherConfig];
