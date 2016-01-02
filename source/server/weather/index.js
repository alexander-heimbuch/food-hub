/* eslint-env node, es6 */
import r from 'rethinkdb';
import Bluebird from 'bluebird';

import config from './config';
import schedule from './schedule';
import notify from './notify';

export default (server, socket) => {
    return (dbConnection) =>
        schedule(dbConnection, notify(dbConnection, socket));
}

