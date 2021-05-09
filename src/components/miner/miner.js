const client = require('./client');
const encoder = require('../encoder');
const { EVENTS, RECONNECT_TIMEOUT } = require('./events.constants');

let _config = null;

const setConfig = (config) => {
  _config = config;
};

const startClient = () => {
  client.connect({
    port: _config.port,
    host: _config.host,
  });
};

client.on(EVENTS.CLOSE, (e) => {
  const interval = setInterval(() => {
    console.log('successful server reconnection');
    client.connect({ port: 8124 }, () => {
      console.log('successful server reconnection');
      //client.write(encrypt(defaultMessage));
      clearInterval(interval);
    });   
  }, RECONNECT_TIMEOUT);
});

module.exports = { setConfig, startClient };
