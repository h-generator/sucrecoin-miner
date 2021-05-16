const { createHash } = require('crypto');

const nextHash = (message) => {
  if (!message) {
    throw new Error('message is undefined');
  }
  return createHash('sha256').update(message).digest('hex');
};

module.exports = { nextHash };
