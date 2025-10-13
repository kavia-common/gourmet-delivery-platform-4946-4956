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
  return docs.map((d) => ({
    id: d._id.toString(),
    restaurantId: d.restaurantId?.toString(),
    name: d.name,
    description: d.description || '',
    price: typeof d.price === 'number' ? d.price : null,
    imageUrl: d.imageUrl || '',
    categories: d.categories || [],
    options: d.options || [],
  }));
}

module.exports = {
  listMenuItems,
};
