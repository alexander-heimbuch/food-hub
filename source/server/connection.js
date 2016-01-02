/* eslint-env node, es6 */
import db from 'rethinkdb';
import Bluebird from 'bluebird';

const createDb = (conn) =>
    db.dbList().run(conn)
        .then((list) => {
            if (list.indexOf('homehub') === -1) {
                return db.dbCreate('homehub').run(conn);
            }

            return Bluebird.resolve();
        })
        .return(conn);


export default () =>
    db.connect({host: 'localhost', port: 28015, db: 'homehub'})
        .then(createDb);
