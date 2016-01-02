/*eslint-env browser, es6*/
import angular from 'angular';
import 'angular-route';
import 'angular-touch';
import 'angular-animate';

import 'moment';
import 'angular-moment';

import controller from './weather.controller';
import config from './weather.config';

angular
    .module('app.weather', ['ngRoute', 'ngTouch', 'ngAnimate' ,'angularMoment'])
    .controller('WeatherController', controller)
    .config(config);

export default 'app.weather';
