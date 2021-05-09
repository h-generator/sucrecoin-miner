const events = require('./miner.constants');

let _client = null;

const setClient = (client) => {
  _client = client;
};

const listener = (data) => {
  switch(data.type) {
    case events.CONNECTION:
      _client._id = data._id;
      console.log(`new miner id: ${data._id}`);
      break;
    case events.HARVEST:
      break;
    default:
      throw new Error('message type does not exist');
      break;
  }
};

module.exports = { setClient, listener };
