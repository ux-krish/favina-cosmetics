// Get cart key for user (by email or guest)
function getCartKey(user) {
  if (user && user.email) {
    return `cart_${user.email}`;
  }
  return 'cart_guest';
}

// Load cart items for user (array)
export function loadCart(user) {
  try {
    const key = getCartKey(user);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save cart items for user
export function saveCart(user, items) {
  try {
    const key = getCartKey(user);
    localStorage.setItem(key, JSON.stringify(items));
  } catch {}
}

// Clear cart for user
export function clearCart(user) {
  try {
    const key = getCartKey(user);
    localStorage.removeItem(key);
  } catch {}
}
