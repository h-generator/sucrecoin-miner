const { randomBytes, createCipheriv, createDecipheriv, scryptSync } = require('crypto');
const { encode } = require('querystring');
const { miner } = require('../../config');
const { IV_LENGTH, ALGORITHM, ENCODE_TYPE } = require('./constants');

let _secret = null;

const setSecret = (secret) => {
  _secret = secret;
}

const encrypt = (data) => {
  if (!_secret) {
    throw new Error('_secret is undefined');
  }
  if (!data) {
    throw new Error('data is undefined');
  }
  const vector = randomBytes(16);
  const key = scryptSync(_secret, 'salt', 24);
  const cipher = createCipheriv(ALGORITHM, key, vector);
  const message = cipher.update(JSON.stringify(data), ENCODE_TYPE.UTF8);
  return  [
    vector.toString(ENCODE_TYPE.HEX),
    Buffer.concat([message, cipher.final()]).toString(ENCODE_TYPE.HEX)
  ].join(':');
};

const decrypt = (encrypted) => {
  if (!_secret) {
    throw new Error('_secret is undefined');
  }
  if (!encrypted) {
    throw new Error('encrypted is undefined');
  }
  let data = encrypted.split(':');
  let vector = Buffer.from(data.shift(), ENCODE_TYPE.HEX);
  const key = scryptSync(_secret, 'salt', 24);
  const decipher = createDecipheriv(ALGORITHM, key, vector);
  let decrypted = decipher.update(data.shift(), ENCODE_TYPE.HEX, ENCODE_TYPE.UTF8);
  decrypted += decipher.final(ENCODE_TYPE.UTF8);
  return JSON.parse(decrypted);
};

module.exports = { encrypt, decrypt, setSecret };
