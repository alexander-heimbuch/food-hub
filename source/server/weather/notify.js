/* eslint-env node, es6 */
import r from 'rethinkdb';
import Bluebird from 'bluebird';
import database from './database';

let db;

const peers = {};

const publishDaytime = (socket, time) => {
    db.daytime.get(time)
        .then((data) => socket.send(JSON.stringify({
            type: 'weather-daytime',
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
        case 'weather-daytime':
            publishDaytime(socket, message.data.time);
        break;
        case 'weather-daily':
            publishDay(socket, message.data.time);
        break;
    }
};

const updateDaytime = (time) => {
    Object.keys(peers).forEach((key) => {
        publishDaytime(peers[key], time);
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
        publishDaytime(socket);
        publishDay(socket);
    });

    return {
        updateDaytime: updateDaytime,
        updateDays: updateDays
    }

};
