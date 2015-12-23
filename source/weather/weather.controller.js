/*eslint-env browser, es6*/
import data from './test-data';

const WeatherController = function () {
    let vm = this;

    vm.hourly = data.hourly.data;
}

export default [WeatherController];
