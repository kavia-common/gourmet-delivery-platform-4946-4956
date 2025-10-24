const MenuItem = require('../models/MenuItem');

// PUBLIC_INTERFACE
async function listMenuItems({ restaurantId }) {
  const query = {};
  if (restaurantId) query.restaurantId = restaurantId;
  const docs = await MenuItem.find(query).lean();
  return docs.map((d) => ({
    id: d._id.toString(),
    restaurantId: d.restaurantId.toString(),
    name: d.name,
    description: d.description || '',
    price: typeof d.price === 'number' ? d.price : null,
    imageUrl: d.imageUrl || '',
    categories: d.categories || [],
    options: (d.options || []).map((o) => ({ name: o.name, priceDelta: o.priceDelta || 0 })),
  }));
}

module.exports = {
  listMenuItems,
};
