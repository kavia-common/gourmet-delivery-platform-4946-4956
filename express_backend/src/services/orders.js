const { getDb, toObjectId } = require('../db/mongo');

// PUBLIC_INTERFACE
async function createOrder({ userId, restaurantId, items, notes }) {
  const db = await getDb();
  const orders = db.collection('orders');

  const doc = {
    userId: toObjectId(userId),
    restaurantId: toObjectId(restaurantId),
    items: (items || []).map((i) => ({
      menuItemId: toObjectId(i.menuItemId),
      quantity: Number(i.quantity || 1),
      instructions: i.instructions || '',
    })),
    notes: notes || '',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const { insertedId } = await orders.insertOne(doc);
  return { id: insertedId.toString(), status: doc.status };
}

// PUBLIC_INTERFACE
async function getOrderById(id) {
  const db = await getDb();
  const orders = db.collection('orders');
  const _id = toObjectId(id);
  if (!_id) return null;
  const doc = await orders.findOne({ _id });
  if (!doc) return null;

  return {
    ...doc,
    id: doc._id.toString(),
    userId: doc.userId?.toString(),
    restaurantId: doc.restaurantId?.toString(),
    items: (doc.items || []).map((i) => ({
      ...i,
      menuItemId: i.menuItemId?.toString(),
    })),
  };
}

// PUBLIC_INTERFACE
async function getOrderStatus(id) {
  const order = await getOrderById(id);
  if (!order) return null;
  return { id: order.id, status: order.status };
}

module.exports = {
  createOrder,
  getOrderById,
  getOrderStatus,
};
