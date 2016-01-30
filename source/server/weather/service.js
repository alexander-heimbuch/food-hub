/* eslint-env node, es6 */

/*
    Forecast.io Service
 */
import Forecast from 'forecast.io-bluebird';
import Bluebird from 'bluebird';

import config from './config';

const forecast = new Forecast({
    key: config.service.key,
    timeout: 2500
});

export const hourly = () =>
    forecast.fetch(config.service.lat, config.service.long, config.service.options)
        .then((result) => {
            // convert to js miliseconds
            let data = result.hourly.data.map((item) => {
                item.time = item.time * 1000
                return item;
            });

            return Bluebird.resolve(result.hourly.data);
        });

export const daily = () =>
    forecast.fetch(config.service.lat, config.service.long, config.service.options)
        .then((result) => {
            // convert to js miliseconds
            result.daily.data.map((item) => {
                item.time = item.time * 1000
                return item;
            });

            return Bluebird.resolve(result.daily.data);
        });
