const { getDb, toObjectId } = require('../db/mongo');

// PUBLIC_INTERFACE
async function createOrder({ userId, restaurantId, items, notes }) {
  const db = await getDb();
  const orders = db.collection('orders');

  const uId = toObjectId(userId);
  const rId = toObjectId(restaurantId);
  if (!uId || !rId) {
    throw new Error('Invalid userId or restaurantId');
  }

  const safeItems = (items || [])
    .map((i) => ({
      menuItemId: toObjectId(i.menuItemId),
      quantity: Number(i.quantity || 1),
      instructions: i.instructions || '',
    }))
    .filter((i) => i.menuItemId); // drop invalid menuItemIds

  const doc = {
    userId: uId,
    restaurantId: rId,
    items: safeItems,
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

  // Return a lean object without Mongo internals
  return {
    id: doc._id.toString(),
    userId: doc.userId?.toString(),
    restaurantId: doc.restaurantId?.toString(),
    items: (doc.items || []).map((i) => ({
      menuItemId: i.menuItemId?.toString(),
      quantity: Number(i.quantity || 1),
      instructions: i.instructions || '',
    })),
    notes: doc.notes || '',
    status: doc.status || 'pending',
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
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
