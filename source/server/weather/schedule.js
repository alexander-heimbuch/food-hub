/* eslint-env node, es6 */
import schedule from 'node-schedule';
import Bluebird from 'bluebird';

import config from './config';
import * as service from './service';
import database from './database';

let db,
    messaging;

const startUp = () => {
    service.hourly()
        .then(db.hourly.update);

    service.daily()
        .then(db.daily.update);
};

const daily = () => {
    // Update Database hourly with service data
    service.daily()
        .then(db.daily.update);

    // Publish Hour Switch to all clients
    messaging.updateDays();
}

const hourly = () => {
    // Update Database hourly with service data
    service.hourly()
        .then(db.hourly.update);

    // Publish Hour Switch to all clients
    messaging.updateHours();
};


export default (dbConnection, notify) => {
    db = database(dbConnection);

    messaging = notify;

    startUp();
    schedule.scheduleJob('0 * * * *', hourly);
    schedule.scheduleJob('0 0 * * *', daily);

    return Bluebird.resolve(dbConnection);
}
