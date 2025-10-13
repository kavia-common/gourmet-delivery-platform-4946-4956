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
  return docs.map((d) => ({
    id: d._id.toString(),
    name: d.name,
    description: d.description,
    categories: d.categories || [],
    imageUrl: d.imageUrl || '',
    rating: typeof d.rating === 'number' ? d.rating : null,
    deliveryFee: typeof d.deliveryFee === 'number' ? d.deliveryFee : null,
    estimatedTimeMinutes: typeof d.estimatedTimeMinutes === 'number' ? d.estimatedTimeMinutes : null,
    address: d.address || '',
  }));
}

// PUBLIC_INTERFACE
async function getRestaurantById(id) {
  const db = await getDb();
  const col = db.collection('restaurants');
  const _id = toObjectId(id);
  if (!_id) return null;
  const d = await col.findOne({ _id });
  if (!d) return null;
  return {
    id: d._id.toString(),
    name: d.name,
    description: d.description,
    categories: d.categories || [],
    imageUrl: d.imageUrl || '',
    rating: typeof d.rating === 'number' ? d.rating : null,
    deliveryFee: typeof d.deliveryFee === 'number' ? d.deliveryFee : null,
    estimatedTimeMinutes: typeof d.estimatedTimeMinutes === 'number' ? d.estimatedTimeMinutes : null,
    address: d.address || '',
  };
}

module.exports = {
  listRestaurants,
  getRestaurantById,
};
