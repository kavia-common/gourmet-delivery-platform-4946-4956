const { restaurantsRepo } = require('../db/memory');

// PUBLIC_INTERFACE
async function listRestaurants({ category, search } = {}) {
  return restaurantsRepo.list({ category, search });
}

// PUBLIC_INTERFACE
async function getRestaurantById(id) {
  return restaurantsRepo.getById(id);
}

module.exports = {
  listRestaurants,
  getRestaurantById,
};
