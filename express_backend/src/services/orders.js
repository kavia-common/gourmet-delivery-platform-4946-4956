const { ordersRepo } = require('../db/memory');

// PUBLIC_INTERFACE
async function createOrder({ userId, restaurantId, items, notes }) {
  // Normalize items
  const safeItems = (items || [])
    .map((i) => ({
      menuItemId: String(i.menuItemId),
      quantity: Number(i.quantity || 1),
      instructions: i.instructions || '',
    }))
    .filter((i) => i.menuItemId);

  return ordersRepo.insert({
    userId: String(userId),
    restaurantId: String(restaurantId),
    items: safeItems,
    notes,
    status: 'pending',
  });
}

// PUBLIC_INTERFACE
async function getOrderById(id) {
  return ordersRepo.findById(String(id));
}

// PUBLIC_INTERFACE
async function getOrderStatus(id) {
  return ordersRepo.getStatus(String(id));
}

module.exports = {
  createOrder,
  getOrderById,
  getOrderStatus,
};
