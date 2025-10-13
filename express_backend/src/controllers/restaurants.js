const restaurantsService = require('../services/restaurants');

class RestaurantsController {
  // PUBLIC_INTERFACE
  async list(req, res) {
    try {
      const { category, search } = req.query || {};
      const data = await restaurantsService.listRestaurants({ category, search });
      return res.json({ data });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to list restaurants' });
    }
  }

  // PUBLIC_INTERFACE
  async getById(req, res) {
    try {
      const { id } = req.params;
      const item = await restaurantsService.getRestaurantById(id);
      if (!item) return res.status(404).json({ error: 'Restaurant not found' });
      return res.json(item);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get restaurant' });
    }
  }
}

module.exports = new RestaurantsController();
