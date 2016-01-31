/*eslint-env browser, es6*/

export default () => ({
    restrict: 'E',
    replace: true,
    templateUrl: 'weather/weather.template.details.html',
    controller: WeatherDetailsController,
    controllerAs: 'vm',
    bindToController: true,
    scope: {}
});

WeatherDetailsController.$inject = ['socket', '$scope'];

function WeatherDetailsController (socket, $scope) {
    let vm = this;

    socket.listen('weather-details', (details) => {
        if (details === null) {
            return;
        }

        $scope.$apply(() => {
            vm.details = details;
        });
    });

    socket.send('weather-details', {});
};
