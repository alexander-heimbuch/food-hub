/* eslint-env node, es6 */
import r from 'rethinkdb';
import Bluebird from 'bluebird';
import config from './config';

let conn;

/*
    Utils
 */
const transformHour = (timestamp, hour = new Date().getHours()) => {
    let time = new Date(timestamp);

    time.setMinutes(0)
    time.setSeconds(0);
    time.setMilliseconds(0);
    time.setHours(hour);

    return time.getTime();
};

const transformDay = (timestamp) => {
    let time = new Date(timestamp);

    time.setMinutes(0)
    time.setSeconds(0);
    time.setMilliseconds(0);
    time.setHours(0);

    return time.getTime();
};

/*
    Database Daytime Methods
 */
const tableDaytime = () =>
    r.tableList().run(conn)
        .then((list) => {
            if (list.indexOf(config.table.daytime) === -1) {
                return r.tableCreate(config.table.daytime, {primaryKey: 'time'}).run(conn)
                    .return(r.table(config.table.daytime));
            }
            return Bluebird.resolve(r.table(config.table.daytime));
        });

const getDaytime = (day = new Date().getTime()) =>
   tableDaytime()
        .then((table) =>
            table
                .getAll(
                    transformHour(day, 7),
                    transformHour(day, 12),
                    transformHour(day, 16),
                    transformHour(day, 22)
                )
                .run(conn)
                .then((cursor) => cursor.toArray())
        );

const getDetails = (day = new Date().getTime()) =>
   tableDaytime()
        .then((table) =>
            table
                .get(transformHour(day))
                .run(conn)
        );


const updateDaytime = (hours) =>
    tableDaytime()
        .then((table) =>
            table
                .insert(hours)
                .run(conn)
        );

/*
    Database Daily Methods
 */
const tableDays = () =>
    r.tableList().run(conn)
        .then((list) => {
            if (list.indexOf(config.table.daily) === -1) {
                return r.tableCreate(config.table.daily, {primaryKey: 'time'}).run(conn)
                    .return(r.table(config.table.daily));
            }
            return Bluebird.resolve(r.table(config.table.daily));
        });

const updateDays = (days) =>
    tableDays()
        .then((table) =>
            table
                .insert(days)
                .run(conn)
        );

const getDay = (day = new Date().getTime()) =>
    tableDays()
        .then((table) =>
            table
                .get(transformDay(day))
                .run(conn)
        );

export default (connection) => {
    conn = connection;

    return {
        daytime: {
            create: tableDaytime,
            get: getDaytime,
            update: updateDaytime
        },
        details: {
            get: getDetails
        },
        daily: {
            create: tableDays,
            update: updateDays,
            get: getDay
        }
    };
};
