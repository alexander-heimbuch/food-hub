/*eslint-env browser, es6*/
import dateToSeason from 'date-season';
import dayTime from './lib/daytime';
import backgrounds from 'json!./weather.backgrounds.json';

const WeatherController = function (socket, $scope) {
    let vm = this;

    vm.background = '';
    vm.invertColor = false;
    vm.day = {};
    vm.daytime = [];
    vm.details = {};

    vm.timespan = 60 * 60 * 1000 * 24;

    const currentWeather = (() => {
        let timer;

        return () => {
            if (timer !== undefined) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                socket.send('weather-daytime', {});
                socket.send('weather-daily', {});
             }, 60 * 1000 * 10);
        }
    })();

    const updateBackground = () => {
        let season = dateToSeason();

        const getBackground = () => {
            let currentTime = new Date(),
                currentSeason = season(currentTime).toLowerCase(),
                currentDaytime = dayTime(currentTime).toLowerCase();

            return backgrounds[currentSeason][currentDaytime];
        };

        vm.background = getBackground().image;
        vm.invertColor = getBackground().invertText;
    };

    vm.next = () => {
        let requestTime = vm.daytime[0].time + vm.timespan;

        socket.send('weather-daytime', {
            time: requestTime
        });

        socket.send('weather-daily', {
            time: requestTime
        });

        currentWeather();
    };

    vm.prev = () => {
        let requestTime = vm.daytime[0].time - vm.timespan;

        socket.send('weather-daytime', {
            time: requestTime
        });

        socket.send('weather-daily', {
            time: requestTime
        });

        currentWeather();
    };

    socket.listen('weather-daytime', (hours) => {
        if (hours === null) {
            return;
        }

        $scope.$apply(() => {
            vm.daytime = hours;
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

    socket.listen('weather-now', (now) => {
        if (now === null) {
            return;
        }

        updateBackground();

        $scope.$apply(() => {
            vm.details = now;
        });
    });
}

export default ['socket' , '$scope', WeatherController];
