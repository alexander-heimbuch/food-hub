/*eslint-env browser, es6*/

const CoreConfig = (socketProvider) => {
    socketProvider.init('http://localhost:3001/');
}

export default CoreConfig;
