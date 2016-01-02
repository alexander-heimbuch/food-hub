/* eslint-env node, es6 */
import r from 'rethinkdb';
import Bluebird from 'bluebird';
import database from './database';

let db;

const peers = {};

const publishHours = (socket, time, span) => {
    db.hourly.get.timespan(time, span)
        .then((data) => socket.send(JSON.stringify({
            type: 'weather-hourly',
            data: data
        })));
};

const publishDay = (socket, time) => {
    db.daily.get(time)
        .then((data) => socket.send(JSON.stringify({
            type: 'weather-daily',
            data: data
        })));
};

const messageBus = (socket, signal) => {
    let message = JSON.parse(signal);
    switch (message.type) {
        case 'weather-hourly':
            publishHours(socket, message.data.time, message.data.span);
        break;
    }
};

const updateHours = (time, span) => {
    Object.keys(peers).forEach((key) => {
        publishHours(peers[key], time, span);
    });
};

const updateDays = (time) => {
    Object.keys(peers).forEach((key) => {
        publishDay(peers[key], time);
    });
};

export default (dbConnection, socketServer) => {

    db = database(dbConnection);

    socketServer.on('connection', (socket) => {
        console.log('client [' + socket.id + '] connected');

        peers[socket.id] = socket;

        socket.on('close', () => {
            delete peers[socket.id];
            console.log('client [' + socket.id + '] left');
        });

        socket.on('message', (data) => {
            messageBus(socket, data);
        });

        // initial publish data right after connection
        publishHours(socket);
        publishDay(socket);
    });

    return {
        updateHours: updateHours,
        updateDays: updateDays
    }

};
