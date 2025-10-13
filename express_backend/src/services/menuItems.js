const { menuItemsRepo } = require('../db/memory');

// PUBLIC_INTERFACE
async function listMenuItems({ restaurantId }) {
  return menuItemsRepo.list({ restaurantId });
}

module.exports = {
  listMenuItems,
};
