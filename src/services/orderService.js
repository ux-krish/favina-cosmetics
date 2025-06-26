// Get all orders from localStorage
export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  } catch {
    return [];
  }
}

// Save all orders to localStorage
export function saveOrders(orders) {
  try {
    localStorage.setItem('orders', JSON.stringify(orders));
  } catch {}
}

// Add a new order, returns the new order with id
export function addOrder(order) {
  const orders = getOrders();
  const newOrder = { ...order, id: Date.now().toString() };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
}

// Get order by id
export function getOrderById(orderId) {
  const orders = getOrders();
  return orders.find(o => o.id === orderId) || null;
}
