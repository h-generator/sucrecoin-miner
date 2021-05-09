const { interval } = require('rxjs');
const { encoder, miner } = require('./components');
const config = require('./config.json');

const source = interval(10000);

(async () => {
  encoder.setSecret(config.miner.secret);
  miner.setConfig(config.miner.server);
  miner.startClient();
})();

source.subscribe((o) => console.log('heartbeat:', o));
