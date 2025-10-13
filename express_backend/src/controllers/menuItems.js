const menuService = require('../services/menuItems');

class MenuItemsController {
  // PUBLIC_INTERFACE
  async list(req, res) {
    try {
      const { restaurantId, flat } = req.query;
      const data = await menuService.listMenuItems({ restaurantId });
      if (String(flat) === '1') return res.json(data);
      return res.json({ data });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to list menu items' });
    }
  }

  // PUBLIC_INTERFACE
  async listByRestaurant(req, res) {
    try {
      const { id } = req.params;
      const { flat } = req.query || {};
      const data = await menuService.listMenuItems({ restaurantId: id });
      if (String(flat) === '1') return res.json(data);
      return res.json({ data });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to list menu items' });
    }
  }
}

module.exports = new MenuItemsController();
