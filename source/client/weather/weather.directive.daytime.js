/*eslint-env browser, es6*/

export default () => ({
    restrict: 'E',
    replace: true,
    templateUrl: 'weather/weather.template.daytime.html',
    controller: WeatherDaytimeController,
    controllerAs: 'vm',
    scope: {
        time: '='
    },
    bindToController: true
});

WeatherDaytimeController.$inject = ['socket', '$scope'];

function WeatherDaytimeController (socket, $scope) {
    let vm = this;

    socket.listen('weather-daytime', (hours) => {
        if (hours === null) {
            return;
        }

        $scope.$apply(() => {
            vm.daytime = hours;
        });
    });

    $scope.$watch('time', () => {
        socket.send('weather-daytime', {
            time: vm.time
        });
    });
};
