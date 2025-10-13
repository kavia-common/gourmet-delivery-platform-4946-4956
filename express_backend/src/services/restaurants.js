const { getDb, toObjectId } = require('../db/mongo');

// PUBLIC_INTERFACE
async function listRestaurants({ category, search } = {}) {
  const db = await getDb();
  const col = db.collection('restaurants');

  const query = {};
  if (category) {
    query.categories = { $in: [category] };
  }
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const docs = await col.find(query).limit(100).toArray();
  return docs.map((d) => ({ ...d, id: d._id.toString() }));
}

// PUBLIC_INTERFACE
async function getRestaurantById(id) {
  const db = await getDb();
  const col = db.collection('restaurants');
  const _id = toObjectId(id);
  if (!_id) return null;
  const doc = await col.findOne({ _id });
  if (!doc) return null;
  return { ...doc, id: doc._id.toString() };
}

module.exports = {
  listRestaurants,
  getRestaurantById,
};
