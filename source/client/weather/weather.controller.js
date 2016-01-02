/*eslint-env browser, es6*/
import data from './test-data';

const WeatherController = function (socket, $scope) {
    let vm = this;

    vm.hour = [];
    vm.day = {};

    vm.current = (() => {
        let timer;
        console.log('timer');
        return () => {
            console.log('restart timer');
            if (timer !== undefined) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                socket.send('weather-hourly', {});
                socket.send('weather-daily', {});
             }, 60 * 1000 * 10);
        }
    })();

    vm.timespan = 60 * 60 * 1000 * 5;


    vm.next = () => {
        let requestTime = vm.hour[0].time + vm.timespan;

        socket.send('weather-hourly', {
            time: requestTime,
            span: 5
        });

        socket.send('weather-daily', {
            time: requestTime
        });

        vm.current();
    };

    vm.prev = () => {
        let requestTime = vm.hour[0].time - vm.timespan;

        socket.send('weather-hourly', {
            time: requestTime,
            span: 5
        });

        socket.send('weather-daily', {
            time: requestTime
        });

        vm.current();
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
        if (day === null) {
            return;
        }

        $scope.$apply(() => {
            vm.day = day;
        });
    });
}

export default ['socket' , '$scope', WeatherController];
