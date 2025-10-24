const Restaurant = require('../models/Restaurant');

// Map DB doc to API shape used previously
function mapRestaurant(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description || '',
    categories: doc.categories || [],
    imageUrl: doc.imageUrl || '',
    rating: typeof doc.rating === 'number' ? doc.rating : null,
    deliveryFee: null, // not stored in schema; keep null for compatibility
    estimatedTimeMinutes: typeof doc.etaMinutes === 'number' ? doc.etaMinutes : null,
    address: doc.address || '', // address not in schema; keep blank for compatibility
  };
}

// PUBLIC_INTERFACE
async function listRestaurants({ category, search } = {}) {
  const query = {};
  if (category) query.categories = category;
  if (search) {
    const s = String(search);
    query.$or = [
      { name: { $regex: s, $options: 'i' } },
      { description: { $regex: s, $options: 'i' } },
    ];
  }
  const docs = await Restaurant.find(query).lean();
  return docs.map((d) => mapRestaurant(d));
}

// PUBLIC_INTERFACE
async function getRestaurantById(id) {
  const doc = await Restaurant.findById(id).lean();
  if (!doc) return null;
  return mapRestaurant(doc);
}

module.exports = {
  listRestaurants,
  getRestaurantById,
};
