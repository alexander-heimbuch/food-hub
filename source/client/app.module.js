/*eslint-env browser, es6 */

import angular from 'angular';
import core from './core/core.module.js';
import weather from './weather/weather.module.js';

angular.module('home-hub', [weather, core]);
