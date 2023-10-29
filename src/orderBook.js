const { sortedIndexBy } = require('lodash');
const orderTypes = require('./utils/orderTypes');
let buyingOrders = []; //highest first
let sellingOrders = []; //lowest first

// lets check the existing selling orders
// if there is a match we should check if it is a partial or full match
// and let's adjust the quantities accordingly
const fulfillBuyingOrder = (order) => {
  const index = 0;
  let remainingQuantity = order.quantity;
  while (true) {
    const currentSellingOrder = sellingOrders[index] || {};
    const isMatch = currentSellingOrder.price <= order.price;
    // if buying order price is lower than the existing selling orders, then there is no match
    // let's insert it so it can be match later on. (lower price amounts first in the list)
    if (!isMatch) {
      buyingOrders.splice(sortedIndexBy(buyingOrders, order, 'price'), 0, order);
      break;
    }

    // now we know there is a match
    // if it is a partial sell, let's adjust the remaining quantity
    const isPartialSell = currentSellingOrder.quantity > remainingQuantity;
    if (isPartialSell) {
      currentSellingOrder.quantity -= remainingQuantity;
      remainingQuantity = 0;
      break;
    }

    // now we know it is a full sell, we can remove it now as it is fullfilled
    // and adjust the remaining buying quantity
    sellingOrders.splice(index, 1);
    remainingQuantity -= currentSellingOrder.quantity;
    if (remainingQuantity === 0) {
      break;
    }
    index++;
  }
};

const fulfillSellingOrder = (order) => {
  let index = 0;
  let remainingQuantity = order.quantity;
  while (true) {
    const currentBuyingOrder = buyingOrders[index] || {};
    const isMatch = currentBuyingOrder.price >= order.price;
    // if selling order price is higher than the existing buying orders, then there is no match
    // let's insert it so it can be match later on. (higher amounts first in the list)
    if (!isMatch) {
      sellingOrders.splice(
        sortedIndexBy(sellingOrders, order, (o) => -o.price),
        0,
        order
      );
      break;
    }

    // now we know there is a match
    // if it is a partial buy, let's adjust the remaining quantity
    const isPartialBuy = currentBuyingOrder.quantity > remainingQuantity;
    if (isPartialBuy) {
      currentBuyingOrder.quantity -= remainingQuantity;
      remainingQuantity = 0;
      break;
    }

    // now we know it is a full buy, we can remove it now as it is fullfilled
    // and adjust the remaining buying quantity, if it s 0 we can stop
    buyingOrders.splice(index, 1);
    remainingQuantity -= currentBuyingOrder.quantity;
    if (remainingQuantity === 0) {
      break;
    }
    index++;
  }
};

const fulfill = (order) => {
  if (order.orderType === orderTypes.Buy) {
    return fulfillBuyingOrder(order);
  }
  return fulfillSellingOrder(order);
};

const init = (orders = []) => {
  buyingOrders = orders.filter((order) => order.type === orderTypes.Buy);
  sellingOrders = orders.filter((order) => order.type === orderTypes.Sell);
};

getOrders = () => buyingOrders.concat(sellingOrders);

module.exports = { fulfill, init, getOrders };
