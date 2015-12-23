/*eslint-env browser, es6*/
import angular from 'angular';
import 'angular-route';

import controller from './weather.controller';
import config from './weather.config';

angular
    .module('app.weather', ['ngRoute'])
    .controller('WeatherController', controller)
    .config(config);

export default 'app.weather';
