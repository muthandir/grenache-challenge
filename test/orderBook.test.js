const orderBook = require('../src/orderBook');

describe('Order Tests', () => {
  it('should manage the order sort for the same type', async () => {
    const order = { price: 4, quantity: 11, orderType: 'Sell' };
    orderBook.fulfill(order);
    const order2 = { price: 5, quantity: 12, orderType: 'Sell' };
    orderBook.fulfill(order2);
    const orders = orderBook.getOrders();
    const sellingOrder = orders[1];
    const sellingOrder2 = orders[0];

    expect(sellingOrder).toBeDefined();
    expect(sellingOrder).toBe(order);
    expect(sellingOrder2).toBe(order2);
  });
  it('should manage the order quantity for different types', async () => {
    const order = { price: 5, quantity: 12, orderType: 'Sell' };

    orderBook.fulfill(order);
    const order2 = { price: 5, quantity: 11, orderType: 'Buy' };
    orderBook.fulfill(order2);
    const orders = orderBook.getOrders();
    const sellingOrder = orders[0];
    expect(sellingOrder).toBeDefined();
    expect(sellingOrder.price).toBe(order.price);
    expect(sellingOrder.quantity).toBe(1);
  });
});
