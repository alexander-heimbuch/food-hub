/*eslint-env browser, es6*/
import dateToSeason from 'date-season';
import backgrounds from 'json!./weather.backgrounds.json';

const WeatherController = function (socket, $scope) {
    let vm = this;

    vm.background = '';
    vm.hour = [];
    vm.day = {};
    vm.timespan = 60 * 60 * 1000 * 5;

    const currentWeather = (() => {
        let timer;

        return () => {
            if (timer !== undefined) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                socket.send('weather-hourly', {});
                socket.send('weather-daily', {});
             }, 60 * 1000 * 10);
        }
    })();

    const background = ((background) => {
        let season = dateToSeason();

        const getBackground = () => {
            let currentTime = new Date(),
                currentSeason = season(currentTime).toLowerCase(),
                hour = currentTime.getHours();

            if (hour >= 4 && hour < 10) {
                return backgrounds[currentSeason]['morning'];
            }

            if (hour >= 10 && hour < 16) {
                return backgrounds[currentSeason]['noon'];
            }

            if (hour >= 16 && hour < 22) {
                return backgrounds[currentSeason]['evening'];
            }

            if (hour >= 22 && hour < 4) {
                return backgrounds[currentSeason]['night'];
            }
        };

        vm.background = getBackground();

        setInterval(() => {
            vm.background = getBackground();
        }, 60 * 60 * 1000);
    })();

    vm.next = () => {
        let requestTime = vm.hour[0].time + vm.timespan;

        socket.send('weather-hourly', {
            time: requestTime,
            span: 5
        });

        socket.send('weather-daily', {
            time: requestTime
        });

        currentWeather();
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

        currentWeather();
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
