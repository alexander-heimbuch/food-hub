/*eslint-env browser, es6*/
import data from './test-data';

const WeatherController = function (socket, $scope) {
    let vm = this;

    vm.hour = [];
    vm.day = {};

    vm.timespan = 60 * 60 * 1000 * 5;


    vm.next = () => {
        socket.send('weather-hourly', {
            time: vm.hour[0].time + vm.timespan,
            span: 5
        });
    };

    vm.prev = () => {
        socket.send('weather-hourly', {
            time: vm.hour[0].time - vm.timespan,
            span: 5
        });
    };

    socket.listen('weather-hourly', (hours) => {
        if (hours.length < 5) {
            return;
        }

        $scope.$apply(() => {
            vm.hour = hours;
        });
    });

    socket.listen('weather-daily', (day) => {
        if (day === undefined) {
            return;
        }
        console.log(day);
        $scope.$apply(() => {
            vm.day = day;
        });
    });
}

export default ['socket' , '$scope', WeatherController];
