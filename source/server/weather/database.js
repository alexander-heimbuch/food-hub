/* eslint-env node, es6 */
import r from 'rethinkdb';
import Bluebird from 'bluebird';
import config from './config';

let conn;

/*
    Utils
 */
const transformHour = (timestamp) => {
    let time = new Date(timestamp);

    time.setMinutes(0)
    time.setSeconds(0);
    time.setMilliseconds(0);

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
    Database Hourly Methods
 */
const tableHours = () =>
    r.tableList().run(conn)
        .then((list) => {
            if (list.indexOf(config.table.hourly) === -1) {
                return r.tableCreate(config.table.hourly, {primaryKey: 'time'}).run(conn)
                    .return(r.table(config.table.hourly));
            }
            return Bluebird.resolve(r.table(config.table.hourly));
        });

const getHoursTimeSpan = (start = new Date().getTime(), span = 5) => {
    start = transformHour(start);

    return tableHours()
        .then((table) =>
            table
                .orderBy({index: 'time'})
                .between(start, start + (60 * 60 * 1000 * span))
                .run(conn)
                .then((cursor) => cursor.toArray())
        );
};

const updateHours = (hours) =>
    tableHours()
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
        hourly: {
            create: tableHours,
            get: {
                timespan: getHoursTimeSpan
            },
            update: updateHours
        },
        daily: {
            create: tableDays,
            update: updateDays,
            get: getDay
        }
    };
};
