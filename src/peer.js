const { PeerRPCServer, PeerRPCClient } = require('grenache-nodejs-ws');
const Link = require('grenache-nodejs-link');
const { fulfill, getOrders } = require('./orderBook');
const lockHelper = require('./utils/lockHelper');

const ip = '127.0.0.1';
const link = new Link({
  grape: `http://${ip}:30001`
});
link.start();

const peerServer = new PeerRPCServer(link, { timeout: 300000 });
peerServer.init();
const peerClient = new PeerRPCClient(link, {});
peerClient.init();

const port = 1024 + Math.floor(Math.random() * 1000);
const service = peerServer.transport('server');
service.listen(port);

// peer server functionality
service.on('request', (rid, key, payload, handler) => {
  switch (key) {
    case 'order:lock':
      lockHelper.lock(payload);
      handler.reply(null, { success: true });
      break;
    case 'order:unlock':
      lockHelper.unlock(payload);
      handler.reply(null, { success: true });
      break;
    case 'order:get':
      handler.reply(null, { orderBook: getOrders() });
      break;
    case 'order:new':
      fulfill(payload);
      handler.reply(null, { success: true });
      break;
    default:
  }
});

link.startAnnouncing('order:new', service.port, {});
link.startAnnouncing('order:lock', service.port, {});
link.startAnnouncing('order:unlock', service.port, {});
link.startAnnouncing('order:get', service.port, {});

// peer client functionality
const send = async (topic, data) => {
  return new Promise((resolve, reject) => {
    peerClient.map(topic, data, { timeout: 10000 }, (err, payload) => {
      if (err) {
        if (err.message === 'ERR_GRAPE_LOOKUP_EMPTY') {
          resolve(payload);
          return;
        } else {
          console.error(`${topic} error:`, err.message);
          reject(err);
          return;
        }
      }
      resolve(payload);
    });
  });
};

const isClientRegistered = async () => {
  return new Promise((res, rej) => {
    while (true) {
      link.lookup('order:new', { timeout: 10000 }, (err, data) => {
        if (err) {
          console.error('lookup error:', err.message);
          reject(err);
          return;
        }

        isClientRegistered = data.includes(`${ip}:${port}`);
        return resolve();
      });
      setTimeout(5000);
    }
  });
};

process.on('SIGINT', async () => {
  link.stop();
  peerClient.stop();
  peerServer.stop();
  service.stop();
  process.exit(0);
});

module.exports = { send, isClientRegistered };
