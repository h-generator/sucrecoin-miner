const net = require('net');
const {
  scrypt,
  randomFill,
  randomBytes,
  createCipheriv,
} = require('crypto');
const config = require('../../config.json');

const IV = 16;
const defaultMessage = {
  data: 'miner connected',
  config: {
    version: 1
  }
};
const algorithm = 'aes-192-cbc';

// const encrypt = (data) => {
//   if (!data) {
//     throw new Error('data is undefined');
//   }
//   const vector = randomBytes(IV);
//   const cipher = createCipheriv(algorithm, config.exchange.secret, vector);
//   const message = cipher.update(JSON.stringify(data), 'utf8');
//   return  [
//     vector.toString('hex'),
//     Buffer.concat([message, cipher.final()]).toString('hex')
//   ].join(':');
// };

const client = net.createConnection({ port: 8124 }, () => {
  console.log('server connection');
  client.write(encrypt(defaultMessage));
});

client.on('data', (data) => {
  try {
    console.log("server message", data.toString());
  } catch (err) {
    console.log(err);
  }
  //client.end();
});

client.on('close', (e) => {
  console.log('connection closed');
  const interval = setInterval(() => { 
    client.connect({ port: 8124 }, () => {
      console.log('server reconnection');
      client.write(encrypt(defaultMessage));
      clearInterval(interval);
    });    
  }, 2000);
});

// client.setTimeout(3000);
// client.on('timeout', () => {
//   console.log('socket timeout');
//   client.end();
// });

module.exports = {
  client
};
