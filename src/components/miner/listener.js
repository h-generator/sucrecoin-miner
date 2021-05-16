const { fromEvent } = require('rxjs');
const events = require('./miner.constants');
const encoder = require('../encoder');
const { event, constants } = require('../emitter');

const source = fromEvent(event, constants.VALID_BLOCK);

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
      event.emit(constants.HARVEST, data);
      break;
    default:
      throw new Error('message type does not exist');
      break;
  }
};

source.subscribe((block) => {
  _client.write(encoder.encrypt({ type: events.VALID_BLOCK, block }));
});

module.exports = { setClient, listener };
