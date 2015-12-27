/*eslint-env browser, es6*/
import data from './test-data';

const WeatherController = function () {
    let vm = this;
    console.log(data);
    vm.hourly = data.hourly.data;
}

export default [WeatherController];
