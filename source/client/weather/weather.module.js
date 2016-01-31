/*eslint-env browser, es6*/
import angular from 'angular';
import 'angular-route';
import 'angular-touch';
import 'angular-animate';

import daytimeFilter from './weather.filter.daytime';
import controller from './weather.controller';
import dayDirective from './weather.directive.day';
import daytimeDirective from './weather.directive.daytime'
import detailsDirective from './weather.directive.details'
import config from './weather.config';

angular
    .module('app.weather', ['ngRoute', 'ngTouch', 'ngAnimate'])
    .filter('daytime', daytimeFilter)
    .controller('WeatherController', controller)
    .directive('weatherDay', dayDirective)
    .directive('weatherDaytime', daytimeDirective)
    .directive('weatherDetails', detailsDirective)
    .config(config);

export default 'app.weather';
