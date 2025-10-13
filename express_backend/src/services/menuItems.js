const { getDb, toObjectId } = require('../db/mongo');

// PUBLIC_INTERFACE
async function listMenuItems({ restaurantId }) {
  const db = await getDb();
  const col = db.collection('menu_items');

  const query = {};
  if (restaurantId) {
    const rid = toObjectId(restaurantId);
    if (!rid) {
      return [];
    }
    query.restaurantId = rid;
  }

  const docs = await col.find(query).limit(500).toArray();
  return docs.map((d) => ({ ...d, id: d._id.toString(), restaurantId: d.restaurantId?.toString() }));
}

module.exports = {
  listMenuItems,
};
