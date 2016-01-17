/*eslint-env browser, es6*/

const CoreConfig = (socketProvider) => {
    socketProvider.init(`${location.protocol}//${location.hostname}:3001/`);
};

export default CoreConfig;
