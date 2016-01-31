/*eslint-env browser, es6*/
import dateToSeason from 'date-season';
import dayTime from './lib/daytime';
import backgrounds from 'json!./weather.backgrounds.json';

const WeatherController = function (socket, $scope) {
    let vm = this;

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

    const

    vm.next = () => {
        let time = vm.time + vm.timespan;

        socket.send('weather-daily', {
            time: time
        });

        socket.send('weather-daytime', {
            time: time
        });

        currentWeather();
    };

    vm.prev = () => {
        let time = vm.time - vm.timespan;

        socket.send('weather-daily', {
            time: requestTime
        });

        socket.send('weather-daily', {
            time: time
        });

        socket.send('weather-daytime', {
            time: time
        });

        currentWeather();
    };

    socket.listen('weather-daily', (day) => {
        if (day === null) {
            return;
        }

        $scope.$apply(() => {
            vm.time = day.time;
        });
    });

    //socket.listen('weather-details', updateBackground);
    vm.time = new Date().getTime();
    updateBackground();
}

export default ['socket' , '$scope', WeatherController];
