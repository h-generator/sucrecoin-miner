const client = require('./client');
const encoder = require('../encoder');
const { EVENTS, RECONNECT_TIMEOUT } = require('./events.constants');
const { timeout } = require('rxjs/operators');

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

client.on(EVENTS.ERROR, (data) => {
  console.log(data.toString());
  client.end();
});

const intervalCallback = () => {
  client.connect({
    port: _config.port,
    host: _config.host,
  });
 };

client.on(EVENTS.CLOSE, () => {
  console.log('reconnecting...');
  setTimeout(intervalCallback, RECONNECT_TIMEOUT);
});

module.exports = { setConfig, startClient };
