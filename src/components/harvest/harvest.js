const { fromEvent } = require('rxjs');
const { nextHash } = require('./hash');
const { event, constants } = require('../emitter');

const source = fromEvent(event, constants.HARVEST);

const difficultyGenerator = (difficulty) => {
  if (!difficulty) {
    throw new Error('nonce is undefined');
  }
  let concat = '';
  for (let i = 0; i < difficulty; i++) {
    concat += '0';
  }
  return concat;
};

const harvest = ({ strategy, block }) => {
  let nonce = 0;
  const difficulty = difficultyGenerator(block.difficulty);
  while (++nonce) {
    block.nonce = nonce; 
    const hash = nextHash(JSON.stringify(block));
    if (difficulty === hash.substring(0, block.difficulty)) {
      console.log(nonce, hash);
      block.hash = hash;
      event.emit(constants.VALID_BLOCK, block);
      break;
    }
  }
};

source.subscribe((config) => {
  harvest(config);
});


module.exports = source;
