const { encoder } = require('./components');
const { miner } = require('./config.json');

(async () => {
  encoder.setSecret(miner.secret);
})();

setInterval(() => {
  console.log('heartbeat');
}, 10000);
