/* eslint-env node, es6 */
import express from 'express';
import engine from 'engine.io';
import path from 'path';

import connectDatabase from './connection';
import weather from './weather';

const app = express();
const socket = engine.listen(3001);

const errorHandler = (error) => {
    console.log(error);
};

app.use(express.static('app/client'));

app.get('/', (req, res) => {
    res.sendfile(path.resolve('app/client/index.html'));
});

app.listen(3000);

connectDatabase()
    .then(weather(app, socket))
    .catch(errorHandler);
