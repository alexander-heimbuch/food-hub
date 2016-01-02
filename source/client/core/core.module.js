/*eslint-env browser, es6*/
import angular from 'angular';

import socketProvider from './core.provider.socket';
import config from './core.config';

angular
    .module('app.core', [])
    .provider('socket', socketProvider)
    .config(config);

export default 'app.core';
