/*eslint-env browser, es6*/
import Socket from 'engine.io-client';

const SocketProvider = function () {
    this.socket = false;

    this.listen = (type, cb) => {
        this.socket.on('message', (signal) => {
            let message = JSON.parse(signal);

            if (message.type !== type) {
                return;
            }

            cb(message.data);
        });
    };

    this.send = (type, data) => {
        this.socket.send(JSON.stringify({
            type: type,
            data: data
        }));
    };

    this.$get = () => {
        if (this.socket === false) {
            throw new Error('Missing connection to server, connection should be established in the config');
        }

        return {
            listen: this.listen,
            send: this.send
        }
    }

    this.init = (server) => {
        this.socket = new Socket(server);

        this.socket.on('open', (socket) => {
            console.log('client opens connection');
        });
    }
}

export default SocketProvider;
