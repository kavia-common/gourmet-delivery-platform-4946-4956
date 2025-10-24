const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// PUBLIC_INTERFACE
async function createOrder({ userId, restaurantId, items, notes }) {
  // Normalize items and enrich with price snapshot
  const safeItemsReq = Array.isArray(items) ? items : [];
  const normalized = safeItemsReq
    .map((i) => ({
      menuItemId: String(i.menuItemId),
      quantity: Math.max(1, Number(i.quantity || 1)),
      instructions: i.instructions || '',
    }))
    .filter((i) => i.menuItemId);

  // Fetch prices for snapshot
  const menuIds = normalized.map((i) => i.menuItemId);
  const menuDocs = await MenuItem.find({ _id: { $in: menuIds } }, { _id: 1, price: 1 }).lean();
  const priceMap = new Map(menuDocs.map((d) => [d._id.toString(), d.price]));

  const itemsForOrder = normalized.map((i) => ({
    menuItemId: i.menuItemId,
    quantity: i.quantity,
    instructions: i.instructions,
    priceAtOrder: priceMap.get(i.menuItemId) ?? 0,
  }));

  const created = await Order.create({
    userId,
    restaurantId,
    items: itemsForOrder,
    notes: notes || '',
    status: 'created',
  });

  return { id: created._id.toString(), orderId: created._id.toString(), status: created.status };
}

// PUBLIC_INTERFACE
async function getOrderById(id) {
  const doc = await Order.findById(id).lean();
  if (!doc) return null;
  return {
    id: doc._id.toString(),
    orderId: doc._id.toString(),
    userId: doc.userId.toString(),
    restaurantId: doc.restaurantId.toString(),
    items: (doc.items || []).map((i) => ({
      menuItemId: i.menuItemId.toString(),
      quantity: Number(i.quantity || 1),
      instructions: i.instructions || '',
    })),
    notes: doc.notes || '',
    status: doc.status || 'created',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// PUBLIC_INTERFACE
async function getOrderStatus(id) {
  const doc = await Order.findById(id, { _id: 1, status: 1 }).lean();
  if (!doc) return null;
  return { id: doc._id.toString(), orderId: doc._id.toString(), status: doc.status };
}

module.exports = {
  createOrder,
  getOrderById,
  getOrderStatus,
};
