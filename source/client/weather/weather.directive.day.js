/*eslint-env browser, es6*/

export default () => ({
    restrict: 'E',
    replace: true,
    templateUrl: 'weather/weather.template.day.html',
    controller: WeatherDayController,
    controllerAs: 'vm',
    scope: {
        time: '='
    },
    bindToController: true
});

WeatherDayController.$inject = ['socket', '$scope'];

function WeatherDayController (socket, $scope) {
    let vm = this;

    socket.listen('weather-daily', (day) => {
        if (day === null) {
            return;
        }

        $scope.$apply(() => {
            vm.day = day;
        });
    });

    $scope.$watch('time', () => {
        socket.send('weather-daily', {
            time: vm.time
        });
    });
};
