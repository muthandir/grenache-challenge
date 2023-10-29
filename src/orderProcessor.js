const peer = require('./peer');
const orderBook = require('./orderBook');

// used whenever a new order comes in (through express, queue etc)
const submit = async (order) => {
  await peer.send('order:lock');
  const result = await peer.send('order:new', order);
  await peer.send('order:unlock');
};

// used in the bootstap to load the client order data
const init = async () => {
  await peer.send('order:lock');
  const orders = await peer.send('order:get');
  orderBook.init(orders);
  await peer.send('order:unlock');
};

module.exports = { init, submit };
